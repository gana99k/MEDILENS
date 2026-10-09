from __future__ import annotations

import base64
import io
import json
import math
import mimetypes
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import urllib.error
import urllib.request
import uuid
from datetime import date, datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import quote, urlparse


ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
UPLOAD_DIR = DATA_DIR / "uploads"
STATIC_DIR = ROOT / "static"
MAX_UPLOAD_MB = max(1, int(os.getenv("MAX_UPLOAD_MB", "12")))
if os.getenv("VERCEL", "").casefold() == "1":
    MAX_UPLOAD_MB = min(MAX_UPLOAD_MB, 4)
MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024
DB_LOCK = threading.RLock()
LEGACY_ABHA_IDENTIFIER_SYSTEM = "https://abha.abdm.gov.in"
SIMULATED_ABHA_IDENTIFIER_SYSTEM = "https://medlens.local/identifiers/simulated-abha"


def load_dotenv() -> None:
    env_file = ROOT / ".env"
    if not env_file.exists():
        return
    for raw_line in env_file.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip("\"'"))


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def new_id(prefix: str) -> str:
    return f"{prefix}-{uuid.uuid4().hex[:12]}"


class PostgresConnection:
    def __init__(self, connection: Any):
        self.connection = connection

    def __enter__(self) -> PostgresConnection:
        return self

    def __exit__(self, exc_type: Any, exc: Any, traceback: Any) -> None:
        try:
            if exc_type is None:
                self.connection.commit()
            else:
                self.connection.rollback()
        finally:
            self.connection.close()

    def execute(self, query: str, parameters: tuple[Any, ...] = ()) -> Any:
        return self.connection.execute(query.replace("?", "%s"), parameters)

    def executescript(self, script: str) -> None:
        for statement in script.split(";"):
            if statement.strip():
                self.execute(statement)


def connect_db() -> PostgresConnection:
    database_url = os.getenv("SUPABASE_DB_URL", "").strip()
    if not database_url:
        raise RuntimeError("Supabase is not configured. Set SUPABASE_DB_URL in your .env file.")
    scheme = urlparse(database_url).scheme.casefold()
    if scheme in {"http", "https"}:
        raise RuntimeError(
            "SUPABASE_DB_URL is set to the Supabase project HTTPS URL. "
            "Use the PostgreSQL connection string from Project Settings > Database > Connection string."
        )
    if scheme not in {"postgres", "postgresql"}:
        raise RuntimeError(
            "SUPABASE_DB_URL must be a PostgreSQL connection string beginning with postgres:// or postgresql://."
        )
    try:
        import psycopg
        from psycopg.rows import dict_row
    except ImportError as exc:
        raise RuntimeError("Supabase support is missing. Install dependencies with: pip install -r requirements.txt") from exc
    try:
        connection = psycopg.connect(
            database_url,
            row_factory=dict_row,
            connect_timeout=10,
            prepare_threshold=None,
        )
    except psycopg.Error as exc:
        raise RuntimeError(f"Could not connect to the Supabase database: {exc}") from exc
    return PostgresConnection(connection)


def vercel_runtime() -> bool:
    return os.getenv("VERCEL", "").casefold() == "1"


def supabase_storage_url(path: str, authenticated: bool = False) -> tuple[str, str]:
    project_url = os.getenv("SUPABASE_URL", "").strip().rstrip("/")
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
    bucket = os.getenv("SUPABASE_STORAGE_BUCKET", "medlens-uploads").strip()
    if not project_url or not service_key or not bucket:
        raise RuntimeError(
            "Supabase Storage is not configured. Set SUPABASE_URL, "
            "SUPABASE_SERVICE_ROLE_KEY, and SUPABASE_STORAGE_BUCKET."
        )
    clean_path = path.strip("/")
    if not clean_path or any(part in {"", ".", ".."} for part in clean_path.split("/")):
        raise ValueError("Invalid storage object path.")
    route = "authenticated/" if authenticated else ""
    encoded_path = "/".join(quote(part, safe="") for part in clean_path.split("/"))
    url = f"{project_url}/storage/v1/object/{route}{quote(bucket, safe='')}/{encoded_path}"
    return url, service_key


def upload_storage_object(path: str, content: bytes, content_type: str) -> None:
    url, key = supabase_storage_url(path)
    request = urllib.request.Request(
        url,
        data=content,
        method="POST",
        headers={
            "Authorization": f"Bearer {key}",
            "apikey": key,
            "Content-Type": content_type,
            "x-upsert": "true",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            if response.status not in {200, 201}:
                raise RuntimeError(f"Supabase Storage upload returned HTTP {response.status}.")
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"Supabase Storage upload failed (HTTP {exc.code}).") from exc


def download_storage_object(path: str) -> tuple[bytes, str]:
    url, key = supabase_storage_url(path, authenticated=True)
    request = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {key}", "apikey": key},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            content_type = response.headers.get("Content-Type", "application/octet-stream")
            return response.read(), content_type
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            raise FileNotFoundError("Stored document was not found.") from exc
        raise RuntimeError(f"Supabase Storage download failed (HTTP {exc.code}).") from exc


def delete_storage_object(path: str) -> None:
    url, key = supabase_storage_url(path)
    request = urllib.request.Request(
        url,
        data=b"",
        method="DELETE",
        headers={"Authorization": f"Bearer {key}", "apikey": key},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            if response.status not in {200, 204}:
                raise RuntimeError(f"Supabase Storage delete returned HTTP {response.status}.")
    except urllib.error.HTTPError as exc:
        if exc.code != 404:
            raise RuntimeError(f"Supabase Storage delete failed (HTTP {exc.code}).") from exc


def persist_resource(connection: PostgresConnection, resource: dict[str, Any]) -> None:
    resource_type = resource["resourceType"]
    resource_id = resource["id"]
    patient_id = resource.get("subject", {}).get("reference", "Patient/demo-patient").split("/")[-1]
    connection.execute(
        """INSERT INTO fhir_resources(id, resource_type, patient_id, data, updated_at)
           VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(id) DO UPDATE SET resource_type=excluded.resource_type,
             patient_id=excluded.patient_id, data=excluded.data, updated_at=excluded.updated_at""",
        (resource_id, resource_type, patient_id, json.dumps(resource, ensure_ascii=False), now_iso()),
    )


def read_resources(connection: PostgresConnection, resource_type: str | None = None) -> list[dict[str, Any]]:
    if resource_type:
        rows = connection.execute(
            "SELECT data FROM fhir_resources WHERE resource_type = ? ORDER BY created_at, id",
            (resource_type,),
        ).fetchall()
    else:
        rows = connection.execute("SELECT data FROM fhir_resources ORDER BY created_at, id").fetchall()
    return [json.loads(row["data"]) for row in rows]


def codeable(text: str, system: str = "https://medlens.local/codes") -> dict[str, Any]:
    return {"text": text, "coding": [{"system": system, "code": text.casefold().replace(" ", "-"), "display": text}]}


def normalize_simulated_abha_id(value: Any) -> str:
    raw_value = str(value or "").strip()
    if not re.fullmatch(r"(?:[0-9]{14}|[0-9]{2}(?:-[0-9]{4}){3})", raw_value):
        raise ValueError("Enter a fictional demo ID as 14 digits or in 12-3456-7890-1234 format.")
    digits = raw_value.replace("-", "")
    return f"{digits[:2]}-{digits[2:6]}-{digits[6:10]}-{digits[10:]}"


def migrate_simulated_abha_identifier(patient: dict[str, Any]) -> bool:
    changed = False
    identifiers = patient.get("identifier", [])
    if not isinstance(identifiers, list):
        return False
    for identifier in identifiers:
        if not isinstance(identifier, dict):
            continue
        assigner = identifier.get("assigner", {})
        assigner_display = assigner.get("display", "") if isinstance(assigner, dict) else ""
        if (
            identifier.get("system") == LEGACY_ABHA_IDENTIFIER_SYSTEM
            and isinstance(assigner_display, str)
            and "simulated" in assigner_display.casefold()
        ):
            identifier["system"] = SIMULATED_ABHA_IDENTIFIER_SYSTEM
            changed = True
    return changed


def seed_database() -> None:
    if not vercel_runtime():
        DATA_DIR.mkdir(exist_ok=True)
        UPLOAD_DIR.mkdir(exist_ok=True)
    with DB_LOCK, connect_db() as connection:
        connection.executescript((ROOT / "schema.sql").read_text(encoding="utf-8"))
        exists = connection.execute(
            "SELECT 1 FROM fhir_resources WHERE resource_type='Patient' LIMIT 1"
        ).fetchone()
        if exists:
            patient_row = connection.execute(
                "SELECT data FROM fhir_resources WHERE resource_type='Patient' LIMIT 1"
            ).fetchone()
            if patient_row:
                patient = json.loads(patient_row["data"])
                if migrate_simulated_abha_identifier(patient):
                    persist_resource(connection, patient)
            seeded_translations = {
                "doc-lab-2024": (
                    "या अहवालात एकूण कोलेस्टेरॉल 226 mg/dL हे 200 mg/dL पेक्षा कमी या मार्गदर्शक मर्यादेपेक्षा जास्त आणि उपाशीपोटी ग्लुकोज 99 mg/dL हे दिलेल्या 70–99 mg/dL मर्यादेत नोंदले आहे. मर्यादेबाहेरील परिणाम म्हणजे निदान नव्हे. आपल्या आरोग्याच्या इतिहासानुसार डॉक्टरांना विचारा. या सारांशावरून उपचार बदलू नका.",
                    "இந்த அறிக்கையில் மொத்த கொலஸ்ட்ரால் 226 mg/dL என்பது 200 mg/dL-க்கு கீழ் என்ற வழிகாட்டி வரம்பை விட அதிகம்; உண்ணாவிரத குளுக்கோஸ் 99 mg/dL என்பது கொடுக்கப்பட்ட 70–99 mg/dL வரம்பிற்குள் உள்ளது. வரம்புக்கு வெளியே உள்ள மதிப்பு மட்டும் நோயறிதல் அல்ல. மருத்துவரிடம் கேளுங்கள்; இந்தச் சுருக்கத்தின் அடிப்படையில் சிகிச்சையை மாற்ற வேண்டாம்.",
                    "ఈ నివేదికలో మొత్తం కొలెస్ట్రాల్ 226 mg/dL అనేది 200 mg/dL కంటే తక్కువ మార్గదర్శక పరిమితికి మించి, ఉపవాస గ్లూకోజ్ 99 mg/dL అనేది ఇచ్చిన 70–99 mg/dL పరిధిలో ఉంది. పరిధికి బయట విలువ ఒక్కటే నిర్ధారణ కాదు. వైద్యుడిని అడగండి; ఈ సారాంశం ఆధారంగా చికిత్సను మార్చవద్దు.",
                ),
                "doc-lab-2025": (
                    "या अहवालात उपाशीपोटी ग्लुकोज 96 mg/dL हे दिलेल्या 70–99 mg/dL मर्यादेत आणि एकूण कोलेस्टेरॉल 214 mg/dL हे अहवालातील 200 mg/dL पेक्षा कमी मार्गदर्शक मर्यादेपेक्षा जास्त नोंदले आहे. मर्यादेबाहेरील मूल्य म्हणजे निदान नव्हे. आपल्या आरोग्याच्या इतिहासानुसार डॉक्टरांना विचारा. या सारांशावरून उपचार बदलू नका.",
                    "இந்த அறிக்கையில் உண்ணாவிரத குளுக்கோஸ் 96 mg/dL என்பது கொடுக்கப்பட்ட 70–99 mg/dL வரம்பிற்குள் உள்ளது; மொத்த கொலஸ்ட்ரால் 214 mg/dL என்பது 200 mg/dL-க்கு கீழ் என்ற வழிகாட்டி வரம்பை விட அதிகம். இது மட்டும் நோயறிதல் அல்ல. மருத்துவரிடம் கேளுங்கள்; சிகிச்சையை மாற்ற இந்தச் சுருக்கத்தைப் பயன்படுத்த வேண்டாம்.",
                    "ఈ నివేదికలో ఉపవాస గ్లూకోజ్ 96 mg/dL ఇచ్చిన 70–99 mg/dL పరిధిలో ఉంది; మొత్తం కొలెస్ట్రాల్ 214 mg/dL 200 mg/dL కంటే తక్కువ మార్గదర్శక పరిమితికి మించి ఉంది. ఇది ఒక్కటే నిర్ధారణ కాదు. వైద్యుడిని అడగండి; ఈ సారాంశం ఆధారంగా చికిత్స మార్చవద్దు.",
                ),
                "doc-prescription-2025": (
                    "डेमो प्रिस्क्रिप्शनमध्ये Vitamin D3, 1,000 IU दिवसातून एकदा असे लिहिले आहे. हे नमुना दस्तऐवजाचे लिप्यंतरण आहे; औषध सुरू किंवा चालू ठेवण्याचा सल्ला नाही. डॉक्टर किंवा फार्मासिस्टकडून खात्री करा.",
                    "டெமோ மருந்துச் சீட்டில் Vitamin D3, 1,000 IU தினமும் ஒருமுறை என உள்ளது. இது மாதிரி ஆவணத்தின் உரைமாற்றம் மட்டுமே; மருந்தைத் தொடங்கவோ தொடரவோ பரிந்துரை அல்ல. மருத்துவர் அல்லது மருந்தாளரிடம் உறுதிப்படுத்துங்கள்.",
                    "డెమో ప్రిస్క్రిప్షన్‌లో Vitamin D3, 1,000 IU రోజుకు ఒకసారి అని ఉంది. ఇది నమూనా పత్రంలోని వాక్యం మాత్రమే; మందు ప్రారంభించమని లేదా కొనసాగించమని సూచన కాదు. వైద్యుడు లేదా ఫార్మసిస్ట్‌తో నిర్ధారించుకోండి.",
                ),
                "doc-discharge-2024": (
                    "या नमुना डिस्चार्ज नोंदीत डेमो क्लिनिकमधील भेट आणि पुढील तपासणीच्या सूचना नोंदल्या आहेत. सूचना दस्तऐवजात जशा आहेत तशाच दाखवल्या आहेत; ही नवीन उपचार योजना नाही. अस्पष्ट सूचना आपल्या आरोग्यसेवा पथकाकडून समजून घ्या.",
                    "இந்த மாதிரி வெளியேற்றக் குறிப்பில் டெமோ கிளினிக் வருகையும் தொடர்ந்து கவனிப்பதற்கான வழிமுறைகளும் உள்ளன. இவை ஆவணத்தில் உள்ளவாறே காட்டப்பட்டுள்ளன; புதிய சிகிச்சைத் திட்டம் அல்ல. தெளிவில்லாதவற்றை உங்கள் சிகிச்சைக் குழுவிடம் கேளுங்கள்.",
                    "ఈ నమూనా డిశ్చార్జ్ నోట్‌లో డెమో క్లినిక్ సందర్శన, తదుపరి సూచనలు ఉన్నాయి. పత్రంలో ఉన్న సూచనలనే చూపిస్తున్నాం; ఇది కొత్త చికిత్సా ప్రణాళిక కాదు. అస్పష్టమైన సూచనలను మీ వైద్య బృందాన్ని అడిగి తెలుసుకోండి.",
                ),
            }
            for doc_id, translations in seeded_translations.items():
                row = connection.execute(
                    "SELECT data FROM fhir_resources WHERE id=? AND resource_type='DocumentReference'",
                    (doc_id,),
                ).fetchone()
                if row:
                    resource = json.loads(row["data"])
                    extensions = get_extensions(resource)
                    changed = False
                    for locale, translated in zip(("mr", "ta", "te"), translations):
                        if not extensions.get(f"summary-{locale}"):
                            extensions[f"summary-{locale}"] = translated
                            changed = True
                    if changed:
                        set_extensions(resource, extensions)
                        persist_resource(connection, resource)
            rows = connection.execute(
                "SELECT data FROM fhir_resources WHERE resource_type='DocumentReference'"
            ).fetchall()
            for row in rows:
                resource = json.loads(row["data"])
                extensions = get_extensions(resource)
                missing = [locale for locale in ("mr", "ta", "te") if not extensions.get(f"summary-{locale}")]
                if missing:
                    fallback = fallback_extract(extensions.get("ocr-text", ""))
                    for locale in missing:
                        extensions[f"summary-{locale}"] = fallback[f"summary_{locale}"]
                    set_extensions(resource, extensions)
                    persist_resource(connection, resource)
            return

        patient = {
            "resourceType": "Patient",
            "id": "demo-patient",
            "identifier": [
                {
                    "use": "usual",
                    "system": SIMULATED_ABHA_IDENTIFIER_SYSTEM,
                    "value": "12-3456-7890-1234",
                    "assigner": {"display": "Simulated ABHA ID — demo only"},
                }
            ],
            "name": [{"use": "usual", "text": "Aarav Sharma", "family": "Sharma", "given": ["Aarav"]}],
            "gender": "male",
            "birthDate": "1985-04-12",
            "address": [{"text": "Pune, Maharashtra, India"}],
            "extension": [{"url": "https://medlens.local/demo", "valueBoolean": True}],
        }
        resources: list[dict[str, Any]] = [patient]

        def add_doc(
            doc_id: str,
            title: str,
            kind: str,
            record_date: str,
            summary: str,
            summary_hi: str,
            summary_mr: str,
            summary_ta: str,
            summary_te: str,
            confidence: float,
            linked: list[dict[str, Any]],
        ) -> None:
            resources.append(
                {
                    "resourceType": "DocumentReference",
                    "id": doc_id,
                    "status": "current",
                    "subject": {"reference": "Patient/demo-patient"},
                    "date": f"{record_date}T09:00:00+05:30",
                    "type": codeable(kind),
                    "description": title,
                    "content": [
                        {
                            "attachment": {"contentType": "application/pdf", "title": title},
                            "format": {"code": "demo-seed"},
                        }
                    ],
                    "context": {"related": [{"reference": f"{r['resourceType']}/{r['id']}"} for r in linked]},
                    "extension": [
                        {"url": "https://medlens.local/summary-en", "valueString": summary},
                        {"url": "https://medlens.local/summary-hi", "valueString": summary_hi},
                        {"url": "https://medlens.local/summary-mr", "valueString": summary_mr},
                        {"url": "https://medlens.local/summary-ta", "valueString": summary_ta},
                        {"url": "https://medlens.local/summary-te", "valueString": summary_te},
                        {"url": "https://medlens.local/confidence", "valueDecimal": confidence},
                        {"url": "https://medlens.local/review-status", "valueCode": "confirmed"},
                        {"url": "https://medlens.local/source-name", "valueString": title},
                    ],
                }
            )

        visit = {
            "resourceType": "Encounter",
            "id": "encounter-annual-checkup",
            "status": "finished",
            "class": codeable("outpatient"),
            "subject": {"reference": "Patient/demo-patient"},
            "period": {"start": "2025-01-18T09:00:00+05:30"},
            "reasonCode": [codeable("Routine health review")],
            "serviceProvider": {"display": "Demo City Clinic"},
        }
        observation_chol = {
            "resourceType": "Observation",
            "id": "observation-total-cholesterol-2025",
            "status": "final",
            "category": [{"text": "laboratory"}],
            "code": codeable("Total cholesterol"),
            "subject": {"reference": "Patient/demo-patient"},
            "effectiveDateTime": "2025-01-18",
            "valueQuantity": {"value": 214, "unit": "mg/dL", "system": "http://unitsofmeasure.org", "code": "mg/dL"},
            "referenceRange": [{"low": {"value": 0, "unit": "mg/dL"}, "high": {"value": 200, "unit": "mg/dL"}, "text": "Desirable: below 200 mg/dL"}],
            "interpretation": [{"text": "high"}],
            "derivedFrom": [{"reference": "DocumentReference/doc-lab-2025"}],
        }
        observation_glucose = {
            "resourceType": "Observation",
            "id": "observation-glucose-2025",
            "status": "final",
            "category": [{"text": "laboratory"}],
            "code": codeable("Fasting glucose"),
            "subject": {"reference": "Patient/demo-patient"},
            "effectiveDateTime": "2025-01-18",
            "valueQuantity": {"value": 96, "unit": "mg/dL", "system": "http://unitsofmeasure.org", "code": "mg/dL"},
            "referenceRange": [{"low": {"value": 70, "unit": "mg/dL"}, "high": {"value": 99, "unit": "mg/dL"}, "text": "70–99 mg/dL"}],
            "derivedFrom": [{"reference": "DocumentReference/doc-lab-2025"}],
        }
        report = {
            "resourceType": "DiagnosticReport",
            "id": "report-labs-2025",
            "status": "final",
            "code": codeable("Routine blood tests"),
            "subject": {"reference": "Patient/demo-patient"},
            "effectiveDateTime": "2025-01-18",
            "result": [{"reference": "Observation/observation-total-cholesterol-2025"}, {"reference": "Observation/observation-glucose-2025"}],
            "basedOn": [{"reference": "Encounter/encounter-annual-checkup"}],
        }
        medication = {
            "resourceType": "MedicationRequest",
            "id": "medication-vitamin-d-2025",
            "status": "active",
            "intent": "order",
            "medicationCodeableConcept": codeable("Vitamin D3"),
            "subject": {"reference": "Patient/demo-patient"},
            "authoredOn": "2025-01-18",
            "dosageInstruction": [{"text": "1,000 IU once daily (as written on demo prescription)", "timing": {"repeat": {"frequency": 1, "period": 1, "periodUnit": "d"}}}],
            "requester": {"display": "Demo City Clinic"},
        }
        condition = {
            "resourceType": "Condition",
            "id": "condition-hypertension-demo",
            "clinicalStatus": codeable("active"),
            "verificationStatus": codeable("provisional"),
            "code": codeable("Hypertension (documented history)"),
            "subject": {"reference": "Patient/demo-patient"},
            "recordedDate": "2025-01-18",
            "note": [{"text": "Seeded demonstration item; not a new diagnosis."}],
        }
        resources.extend([visit, observation_chol, observation_glucose, report, medication, condition])
        prior_visit = {
            "resourceType": "Encounter",
            "id": "encounter-checkup-2024",
            "status": "finished",
            "class": codeable("outpatient"),
            "subject": {"reference": "Patient/demo-patient"},
            "period": {"start": "2024-06-12T09:00:00+05:30"},
            "reasonCode": [codeable("Routine blood tests")],
            "serviceProvider": {"display": "Demo City Clinic"},
        }
        prior_cholesterol = {
            "resourceType": "Observation",
            "id": "observation-total-cholesterol-2024",
            "status": "final",
            "category": [{"text": "laboratory"}],
            "code": codeable("Total cholesterol"),
            "subject": {"reference": "Patient/demo-patient"},
            "effectiveDateTime": "2024-06-12",
            "valueQuantity": {"value": 226, "unit": "mg/dL", "system": "http://unitsofmeasure.org", "code": "mg/dL"},
            "referenceRange": [{"low": {"value": 0, "unit": "mg/dL"}, "high": {"value": 200, "unit": "mg/dL"}, "text": "Desirable: below 200 mg/dL"}],
            "interpretation": [{"text": "high"}],
            "derivedFrom": [{"reference": "DocumentReference/doc-lab-2024"}],
        }
        prior_glucose = {
            "resourceType": "Observation",
            "id": "observation-glucose-2024",
            "status": "final",
            "category": [{"text": "laboratory"}],
            "code": codeable("Fasting glucose"),
            "subject": {"reference": "Patient/demo-patient"},
            "effectiveDateTime": "2024-06-12",
            "valueQuantity": {"value": 99, "unit": "mg/dL", "system": "http://unitsofmeasure.org", "code": "mg/dL"},
            "referenceRange": [{"low": {"value": 70, "unit": "mg/dL"}, "high": {"value": 99, "unit": "mg/dL"}, "text": "70–99 mg/dL"}],
            "derivedFrom": [{"reference": "DocumentReference/doc-lab-2024"}],
        }
        prior_report = {
            "resourceType": "DiagnosticReport",
            "id": "report-labs-2024",
            "status": "final",
            "code": codeable("Routine blood tests"),
            "subject": {"reference": "Patient/demo-patient"},
            "effectiveDateTime": "2024-06-12",
            "result": [{"reference": "Observation/observation-total-cholesterol-2024"}, {"reference": "Observation/observation-glucose-2024"}],
            "basedOn": [{"reference": "Encounter/encounter-checkup-2024"}],
        }
        resources.extend([prior_visit, prior_cholesterol, prior_glucose, prior_report])
        add_doc(
            "doc-lab-2024",
            "Previous blood test results",
            "Laboratory report",
            "2024-06-12",
            "This report lists total cholesterol of 226 mg/dL, above the printed desirable-below-200 mg/dL guide, and fasting glucose of 99 mg/dL, within its printed 70–99 mg/dL range. Comparisons to a report's range are not diagnoses. Ask your clinician to interpret results with your health history; do not change treatment based on this summary.",
            "इस रिपोर्ट में कुल कोलेस्ट्रॉल 226 mg/dL (रिपोर्ट की वांछित 200 mg/dL से कम मार्गदर्शक सीमा से ऊपर) और फास्टिंग ग्लूकोज़ 99 mg/dL (दिए गए 70–99 mg/dL दायरे में) दर्ज है। रिपोर्ट की सीमा से तुलना निदान नहीं है। परिणामों को अपने स्वास्थ्य इतिहास के संदर्भ में समझने के लिए डॉक्टर से पूछें; इस सारांश के आधार पर उपचार न बदलें।",
            "या अहवालात एकूण कोलेस्टेरॉल 226 mg/dL (अहवालातील 200 mg/dL पेक्षा कमी या मार्गदर्शक मर्यादेपेक्षा जास्त) आणि उपाशीपोटी ग्लुकोज 99 mg/dL (दिलेल्या 70–99 mg/dL मर्यादेत) नोंदले आहे. मर्यादेबाहेरील परिणाम म्हणजे स्वतःहून निदान नव्हे. आपल्या आरोग्याच्या इतिहासानुसार याचा अर्थ डॉक्टरांना विचारा. या सारांशावरून उपचार बदलू नका.",
            "இந்த அறிக்கையில் மொத்த கொலஸ்ட்ரால் 226 mg/dL (அறிக்கையின் 200 mg/dL-க்கு கீழ் என்ற வழிகாட்டி வரம்பை விட அதிகம்), உண்ணாவிரத குளுக்கோஸ் 99 mg/dL (கொடுக்கப்பட்ட 70–99 mg/dL வரம்பிற்குள்) என உள்ளது. வரம்புக்கு வெளியே உள்ள மதிப்பு மட்டும் நோயறிதல் அல்ல. உங்கள் உடல்நல வரலாற்றின் அடிப்படையில் இதன் பொருளை மருத்துவரிடம் கேளுங்கள். இந்தச் சுருக்கத்தின் அடிப்படையில் சிகிச்சையை மாற்ற வேண்டாம்.",
            "ఈ నివేదికలో మొత్తం కొలెస్ట్రాల్ 226 mg/dL (నివేదికలోని 200 mg/dL కంటే తక్కువ మార్గదర్శక పరిమితికి మించి), ఉపవాస గ్లూకోజ్ 99 mg/dL (ఇచ్చిన 70–99 mg/dL పరిధిలో) ఉన్నట్లు ఉంది. పరిధికి బయట ఉన్న విలువ ఒక్కటే నిర్ధారణ కాదు. మీ ఆరోగ్య చరిత్రకు అనుగుణంగా దీని అర్థం ఏమిటో వైద్యుడిని అడగండి. ఈ సారాంశం ఆధారంగా చికిత్సను మార్చవద్దు.",
            0.95,
            [prior_visit, prior_report, prior_cholesterol, prior_glucose],
        )
        add_doc(
            "doc-lab-2025",
            "Annual blood test results",
            "Laboratory report",
            "2025-01-18",
            "This report lists fasting glucose of 96 mg/dL, within the printed 70–99 mg/dL range, and total cholesterol of 214 mg/dL, above the report's desirable-below-200 mg/dL guide. A value outside a stated guide is not a diagnosis. Ask your clinician how these results fit your health history. Do not change any treatment based on this summary.",
            "इस रिपोर्ट में फास्टिंग ग्लूकोज़ 96 mg/dL (दिए गए 70–99 mg/dL दायरे में) और कुल कोलेस्ट्रॉल 214 mg/dL (रिपोर्ट के वांछित 200 mg/dL से कम मान से ऊपर) दर्ज है। सीमा से बाहर मान अपने-आप में निदान नहीं होता। अपने स्वास्थ्य इतिहास के संदर्भ में डॉक्टर से पूछें। इस सारांश के आधार पर उपचार न बदलें।",
            "या अहवालात उपाशीपोटी ग्लुकोज 96 mg/dL (दिलेल्या 70–99 mg/dL मर्यादेत) आणि एकूण कोलेस्टेरॉल 214 mg/dL (अहवालातील 200 mg/dL पेक्षा कमी मार्गदर्शक मर्यादेपेक्षा जास्त) नोंदले आहे. मर्यादेबाहेरील मूल्य म्हणजे निदान नव्हे. आपल्या आरोग्याच्या इतिहासानुसार डॉक्टरांना विचारा. या सारांशावरून उपचार बदलू नका.",
            "இந்த அறிக்கையில் உண்ணாவிரத குளுக்கோஸ் 96 mg/dL (கொடுக்கப்பட்ட 70–99 mg/dL வரம்பிற்குள்), மொத்த கொலஸ்ட்ரால் 214 mg/dL (அறிக்கையின் 200 mg/dL-க்கு கீழ் என்ற வழிகாட்டி வரம்பை விட அதிகம்) என உள்ளது. வரம்புக்கு வெளியே உள்ள மதிப்பு மட்டும் நோயறிதல் அல்ல. உங்கள் உடல்நல வரலாற்றின் அடிப்படையில் மருத்துவரிடம் கேளுங்கள். இந்தச் சுருக்கத்தின் அடிப்படையில் சிகிச்சையை மாற்ற வேண்டாம்.",
            "ఈ నివేదికలో ఉపవాస గ్లూకోజ్ 96 mg/dL (ఇచ్చిన 70–99 mg/dL పరిధిలో), మొత్తం కొలెస్ట్రాల్ 214 mg/dL (నివేదికలోని 200 mg/dL కంటే తక్కువ మార్గదర్శక పరిమితికి మించి) ఉన్నట్లు ఉంది. పరిధికి బయట ఉన్న విలువ ఒక్కటే నిర్ధారణ కాదు. మీ ఆరోగ్య చరిత్ర ప్రకారం వైద్యుడిని అడగండి. ఈ సారాంశం ఆధారంగా చికిత్సను మార్చవద్దు.",
            0.96,
            [report, observation_chol, observation_glucose, visit],
        )
        add_doc(
            "doc-prescription-2025",
            "Clinic prescription",
            "Prescription",
            "2025-01-18",
            "The seeded demo prescription records Vitamin D3, 1,000 IU once daily. This is a transcription of the sample document, not a recommendation to start or continue it. Confirm the medicine and instructions with the prescribing clinician or pharmacist.",
            "डेमो पर्चे में Vitamin D3, 1,000 IU रोज़ एक बार लिखा है। यह नमूना दस्तावेज़ का लिप्यंतरण है, दवा शुरू या जारी रखने की सलाह नहीं। दवा और निर्देश लिखने वाले डॉक्टर या फार्मासिस्ट से सत्यापित करें।",
            "डेमो प्रिस्क्रिप्शनमध्ये Vitamin D3, 1,000 IU दिवसातून एकदा असे लिहिले आहे. हे नमुना दस्तऐवजाचे लिप्यंतरण आहे; औषध सुरू किंवा चालू ठेवण्याचा सल्ला नाही. औषध व सूचना लिहिणाऱ्या डॉक्टर किंवा फार्मासिस्टकडून खात्री करा.",
            "டெமோ மருந்துச் சீட்டில் Vitamin D3, 1,000 IU தினமும் ஒருமுறை என உள்ளது. இது மாதிரி ஆவணத்தின் உரைமாற்றம் மட்டுமே; மருந்தைத் தொடங்கவோ தொடரவோ பரிந்துரை அல்ல. மருந்தையும் வழிமுறைகளையும் எழுதிய மருத்துவர் அல்லது மருந்தாளரிடம் உறுதிப்படுத்துங்கள்.",
            "డెమో ప్రిస్క్రిప్షన్‌లో Vitamin D3, 1,000 IU రోజుకు ఒకసారి అని ఉంది. ఇది నమూనా పత్రంలోని వాక్యాన్ని మాత్రమే నమోదు చేస్తుంది; మందు ప్రారంభించమని లేదా కొనసాగించమని సూచన కాదు. మందు, సూచనలను రాసిన వైద్యుడు లేదా ఫార్మసిస్ట్‌తో నిర్ధారించుకోండి.",
            0.91,
            [medication],
        )
        add_doc(
            "doc-discharge-2024",
            "Discharge note — demo",
            "Discharge summary",
            "2024-10-04",
            "This sample discharge note records a visit and follow-up instructions from the demo clinic. Follow-up wording is shown as recorded and is not a new care plan. Please confirm any unclear instructions with your care team.",
            "इस नमूना डिस्चार्ज नोट में डेमो क्लिनिक की मुलाक़ात और अनुवर्ती निर्देश दर्ज हैं। निर्देश केवल दस्तावेज़ में लिखे अनुसार दिखाए गए हैं; यह नई उपचार योजना नहीं है। अस्पष्ट निर्देश अपनी देखभाल टीम से पूछें।",
            "या नमुना डिस्चार्ज नोंदीत डेमो क्लिनिकमधील भेट आणि पुढील तपासणीच्या सूचना नोंदल्या आहेत. सूचना दस्तऐवजात जशा आहेत तशाच दाखवल्या आहेत; ही नवीन उपचार योजना नाही. अस्पष्ट सूचना आपल्या आरोग्यसेवा पथकाकडून समजून घ्या.",
            "இந்த மாதிரி வெளியேற்றக் குறிப்பில் டெமோ கிளினிக் வருகையும் தொடர்ந்து கவனிப்பதற்கான வழிமுறைகளும் உள்ளன. ஆவணத்தில் உள்ளவாறே காட்டப்பட்டுள்ளன; இது புதிய சிகிச்சைத் திட்டம் அல்ல. தெளிவில்லாத வழிமுறைகளை உங்கள் சிகிச்சைக் குழுவிடம் கேளுங்கள்.",
            "ఈ నమూనా డిశ్చార్జ్ నోట్‌లో డెమో క్లినిక్ సందర్శన, తదుపరి సూచనలు ఉన్నాయి. పత్రంలో ఉన్న సూచనలనే చూపిస్తున్నాం; ఇది కొత్త చికిత్సా ప్రణాళిక కాదు. అస్పష్టమైన సూచనలను మీ వైద్య బృందాన్ని అడిగి తెలుసుకోండి.",
            0.88,
            [],
        )
        for resource in resources:
            persist_resource(connection, resource)


def get_extensions(resource: dict[str, Any]) -> dict[str, Any]:
    return {entry["url"].rsplit("/", 1)[-1]: entry.get("valueString", entry.get("valueDecimal", entry.get("valueCode", ""))) for entry in resource.get("extension", [])}


def set_extensions(resource: dict[str, Any], values: dict[str, Any]) -> None:
    resource["extension"] = [
        {"url": f"https://medlens.local/{key}", "valueString" if isinstance(value, str) else "valueDecimal": value}
        for key, value in values.items()
    ]


def extract_pdf_text(path: Path) -> tuple[str, str | None]:
    try:
        from pypdf import PdfReader  # type: ignore[import-not-found]
        text = "\n".join(page.extract_text() or "" for page in PdfReader(str(path)).pages)
        if text.strip():
            return text, None
    except ImportError:
        pass
    except Exception as exc:
        return "", f"PDF text extraction failed: {exc}"
    try:
        raw = path.read_bytes().decode("latin-1", errors="ignore")
        strings = re.findall(r"\(([^()]*(?:\\.[^()]*)*)\)\s*Tj", raw)
        text = "\n".join(item.replace(r"\(", "(").replace(r"\)", ")") for item in strings)
        if text.strip():
            return text, "Used basic PDF text fallback; verify extraction carefully."
    except OSError as exc:
        return "", f"Could not read PDF: {exc}"
    return "", "No embedded PDF text was found."


def render_pdf_pages(path: Path, max_pages: int = 8) -> tuple[list[bytes], str | None]:
    try:
        import pypdfium2 as pdfium  # type: ignore[import-not-found]
    except ImportError:
        return [], "Scanned PDF pages need pypdfium2 to enable OCR or vision extraction."
    document = None
    try:
        document = pdfium.PdfDocument(str(path))
        page_count = len(document)
        rendered = []
        for index in range(min(page_count, max_pages)):
            page = document[index]
            bitmap = page.render(scale=1.35)
            image = bitmap.to_pil()
            output = io.BytesIO()
            image.save(output, format="PNG")
            rendered.append(output.getvalue())
            image.close()
            bitmap.close()
            page.close()
        warning = f"Only the first {max_pages} pages were processed." if page_count > max_pages else None
        return rendered, warning
    except Exception as exc:
        return [], f"Could not render scanned PDF pages: {exc}"
    finally:
        if document is not None:
            document.close()


def find_tesseract() -> tuple[str | None, str | None]:
    configured = os.getenv("TESSERACT_CMD", "").strip()
    if configured:
        executable = shutil.which(configured)
        candidate = Path(configured)
        if executable:
            return executable, None
        if candidate.is_file():
            return str(candidate), None
        return None, f"TESSERACT_CMD does not point to an executable: {configured}"

    executable = shutil.which("tesseract")
    if executable:
        return executable, None
    if os.name == "nt":
        program_files = [
            Path(os.environ.get("ProgramFiles", r"C:\Program Files")),
            Path(os.environ.get("ProgramFiles(x86)", r"C:\Program Files (x86)")),
        ]
        for directory in program_files:
            candidate = directory / "Tesseract-OCR" / "tesseract.exe"
            if candidate.is_file():
                return str(candidate), None
    return None, "Tesseract is not installed; install it or configure TESSERACT_CMD."


def tesseract_languages(executable: str) -> tuple[str, str | None]:
    try:
        result = subprocess.run(
            [executable, "--list-langs"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as exc:
        return "eng", f"Could not inspect Tesseract language data: {exc}"
    if result.returncode != 0:
        return "eng", "Could not inspect Tesseract language data; using English OCR."
    available = {line.strip() for line in result.stdout.splitlines()[1:] if line.strip()}
    configured = os.getenv("TESSERACT_LANGS", "").strip()
    requested = [language.strip() for language in re.split(r"[+,]", configured) if language.strip()]
    if requested:
        selected = [language for language in requested if language in available]
        missing = [language for language in requested if language not in available]
        if selected:
            warning = f"Requested Tesseract language data is not installed: {', '.join(missing)}." if missing else None
            return "+".join(selected), warning
        fallback = "eng" if "eng" in available else next(iter(available - {"osd"}), "eng")
        return fallback, f"None of the requested Tesseract languages are installed; using {fallback}."
    if "eng" in available:
        return ("eng+hin" if "hin" in available else "eng"), None
    fallback = next(iter(available - {"osd"}), "eng")
    return fallback, f"Tesseract English data is missing; using {fallback} OCR."


def image_clarity_score(image_bytes: bytes) -> float | None:
    try:
        from PIL import Image, ImageFilter, ImageOps, ImageStat

        with Image.open(io.BytesIO(image_bytes)) as source:
            image = ImageOps.exif_transpose(source).convert("L")
            width, height = image.size
            if width < 2 or height < 2:
                return 0.0
            contrast = ImageStat.Stat(image).stddev[0]
            laplacian = image.filter(
                ImageFilter.Kernel(
                    (3, 3),
                    [0, 1, 0, 1, -4, 1, 0, 1, 0],
                    scale=1,
                    offset=128,
                )
            )
            sharpness = ImageStat.Stat(laplacian).stddev[0]
            resolution_score = min(1.0, math.sqrt(width * height) / 850)
            contrast_score = min(1.0, contrast / 55)
            sharpness_score = min(1.0, sharpness / 45)
            return (
                0.35 * resolution_score
                + 0.25 * contrast_score
                + 0.40 * sharpness_score
            )
    except (ImportError, OSError, ValueError):
        return None


def estimate_text_clarity(text: str) -> float:
    characters = [character for character in text if not character.isspace()]
    if not characters:
        return 0.0
    readable_ratio = sum(character.isalnum() or character in ".,:;()%+-/" for character in characters) / len(characters)
    tokens = text.split()
    word_ratio = sum(any(character.isalnum() for character in token) for token in tokens) / len(tokens) if tokens else 0.0
    return 0.65 * readable_ratio + 0.35 * word_ratio


def source_clarity_score(path: Path, content_type: str) -> float | None:
    if content_type != "application/pdf":
        try:
            return image_clarity_score(path.read_bytes())
        except OSError:
            return None
    pages, _ = render_pdf_pages(path, max_pages=5)
    scores = [score for page in pages if (score := image_clarity_score(page)) is not None]
    return sum(scores) / len(scores) if scores else None


def confidence_for_clarity(confidence: float, clarity: float) -> float:
    bounded_confidence = max(0.0, min(1.0, confidence))
    bounded_clarity = max(0.0, min(1.0, clarity))
    return bounded_confidence * (0.25 + 0.75 * bounded_clarity)


def prepare_ocr_image(image_bytes: bytes) -> tuple[bytes, str | None]:
    try:
        from PIL import Image, ImageFilter, ImageOps

        with Image.open(io.BytesIO(image_bytes)) as source:
            image = ImageOps.exif_transpose(source).convert("L")
            longest_edge = max(image.size)
            scale = min(3.0, max(1.0, 2000 / longest_edge))
            if scale > 1:
                image = image.resize(
                    (round(image.width * scale), round(image.height * scale)),
                    Image.Resampling.LANCZOS,
                )
            image = ImageOps.autocontrast(image, cutoff=1)
            image = image.filter(ImageFilter.UnsharpMask(radius=1.5, percent=125, threshold=3))
            output = io.BytesIO()
            image.save(output, format="PNG")
            image.close()
            return output.getvalue(), None
    except (ImportError, OSError, ValueError) as exc:
        return image_bytes, f"Image enhancement unavailable; OCR used the original image: {exc}"


def _run_tesseract_stdin(executable: str, image_bytes: bytes, languages: str, page_segmentation: int) -> str:
    result = subprocess.run(
        [executable, "stdin", "stdout", "-l", languages, "--psm", str(page_segmentation)],
        input=image_bytes,
        capture_output=True,
        timeout=40,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.decode(errors="replace").strip()[:300] or "Tesseract returned an error.")
    output = result.stdout
    return (output.decode(errors="replace") if isinstance(output, bytes) else str(output)).strip()


def _ocr_text_score(text: str) -> tuple[int, int, int]:
    words = re.findall(r"[A-Za-z]{3,}", text)
    medical_terms = re.findall(
        r"(?i)\b(?:date|diagnosis|medicine|dosage|mg|ml|iu|days?|morning|night|tablet|capsule|report|result)\b",
        text,
    )
    return len(medical_terms), len(words), len(text)


def tesseract_image_bytes(png_bytes: bytes, path: Path) -> tuple[str, str | None]:
    executable, executable_warning = find_tesseract()
    if not executable:
        return "", executable_warning
    languages, language_warning = tesseract_languages(executable)
    enhanced_bytes, enhancement_warning = prepare_ocr_image(png_bytes)
    try:
        candidates = []
        errors = []
        image_candidates = [(enhanced_bytes, True)]
        if enhanced_bytes != png_bytes:
            image_candidates.append((png_bytes, False))
        for candidate_bytes, is_enhanced in image_candidates:
            for page_segmentation in (6, 11):
                try:
                    text = _run_tesseract_stdin(executable, candidate_bytes, languages, page_segmentation)
                except (OSError, subprocess.TimeoutExpired, RuntimeError) as exc:
                    errors.append(str(exc))
                    continue
                if text:
                    candidates.append((text, is_enhanced, page_segmentation))
        if not candidates:
            detail = errors[-1] if errors else "OCR found no readable text."
            return "", detail
        text, enhanced, page_segmentation = max(candidates, key=lambda item: _ocr_text_score(item[0]))
        warnings = [
            warning for warning in (
                language_warning,
                enhancement_warning,
                "OCR used sparse-text layout; verify every extracted field against the original." if page_segmentation == 11 else None,
                "OCR image enhancement was applied; verify every extracted field against the original." if enhanced else None,
            ) if warning
        ]
        return text, "; ".join(warnings) or None
    except (OSError, subprocess.TimeoutExpired) as exc:
        return "", f"OCR could not complete for the PDF page: {exc}"


def run_tesseract(path: Path) -> tuple[str, str | None]:
    executable, executable_warning = find_tesseract()
    if not executable:
        return "", executable_warning
    try:
        return tesseract_image_bytes(path.read_bytes(), path)
    except OSError as exc:
        return "", f"OCR could not read the file: {exc}"


def ocr_file(path: Path, content_type: str) -> tuple[str, str | None]:
    if content_type == "application/pdf":
        text, warning = extract_pdf_text(path)
        if text:
            return text, warning
        pages, render_warning = render_pdf_pages(path)
        if not pages:
            return "", "; ".join(item for item in (warning, render_warning) if item)
        page_texts = []
        ocr_warnings = []
        for page in pages:
            page_text, page_warning = tesseract_image_bytes(page, path)
            if page_text:
                page_texts.append(page_text)
            if page_warning:
                ocr_warnings.append(page_warning)
        combined_warning = "; ".join(dict.fromkeys([item for item in (warning, render_warning, *ocr_warnings) if item]))
        return "\n\n".join(page_texts), combined_warning or None
    return run_tesseract(path)


def fallback_extract(text: str, source_clarity: float | None = None) -> dict[str, Any]:
    date_pattern = r"\b(20\d{2}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/](?:20)?\d{2}|\d{1,2}[- ](?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[-, ]+20\d{2})\b"
    labeled_date = re.search(rf"(?im)^\s*(?:date|dated)\s*[:\-]\s*({date_pattern})", text)
    date_match = labeled_date or re.search(date_pattern, text, re.IGNORECASE)
    normalized_date = ""
    if date_match:
        raw_date = date_match.group(1) if labeled_date else date_match.group()
        for date_format in (
            "%Y-%m-%d", "%Y/%m/%d", "%d-%m-%Y", "%d/%m/%Y", "%d-%m-%y", "%d/%m/%y",
            "%d-%b-%Y", "%d %b %Y", "%d-%B-%Y", "%d %B %Y",
        ):
            try:
                normalized_date = datetime.strptime(raw_date.replace(",", "").strip(), date_format).date().isoformat()
                break
            except ValueError:
                continue

    observations: list[dict[str, Any]] = []
    for line in text.splitlines():
        match = re.search(
            r"(?i)([A-Za-z][A-Za-z0-9 /().-]{2,40})\s*[:=]?\s*(-?\d+(?:\.\d+)?)\s*(mg/dL|mmol/L|g/dL|IU/L|U/L|%|mIU/L|ng/mL)\s*(?:\(?\s*(?:ref(?:erence)?\.?\s*)?(\d+(?:\.\d+)?)\s*[-–to]+\s*(\d+(?:\.\d+)?)\s*\)?)?",
            line,
        )
        if match:
            low = float(match.group(4)) if match.group(4) else None
            high = float(match.group(5)) if match.group(5) else None
            value = float(match.group(2))
            observations.append(
                {
                    "name": match.group(1).strip(" :-"),
                    "value": value,
                    "unit": match.group(3),
                    "low": low,
                    "high": high,
                    "reference_text": f"{low:g}–{high:g} {match.group(3)}" if low is not None and high is not None else "",
                }
            )

    medications: list[dict[str, str]] = []
    lines = text.splitlines()
    for original_line in lines:
        line = re.sub(r"(?i)\b[iIl]\s+(morning|night)\b", r"1 \1", original_line)
        row_match = re.match(
            r"(?i)^\s*\d{1,2}\s*[.)]\s*(?:(?:tab(?:let)?|cap(?:sule)?|syp)\.?\s+)?"
            r"(.+?)\s+(\d+\s+(?:morning|night|afternoon|evening|daily|once)(?:\s*,\s*\d+\s+(?:morning|night|afternoon|evening))?)"
            r"(?:\s+(\d+\s+days?))?\s*$",
            line,
        )
        if row_match:
            medications.append(
                {
                    "name": row_match.group(1).strip(" .:-"),
                    "dosage": row_match.group(2).strip(),
                    "instructions": row_match.group(3).strip() if row_match.group(3) else "",
                }
            )
    if not medications:
        for line in lines:
            match = re.search(r"(?i)\b([A-Za-z][A-Za-z0-9-]{2,30})\s+(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|IU|units?))\b(.*)", line)
            if match and not any(token in match.group(1).casefold() for token in ("glucose", "cholesterol", "hemoglobin")):
                medications.append({"name": match.group(1), "dosage": match.group(2).strip(), "instructions": match.group(3).strip()[:100]})

    diagnoses: list[str] = []
    diagnosis_pattern = r"(?im)^\s*(?:diagnosis|impression|assessment)\s*[:\-]\s*(.*)$"
    for match in re.finditer(diagnosis_pattern, text):
        candidates = [match.group(1).strip().lstrip("*•- ").strip()]
        for line in text[match.end():].splitlines():
            if not line.strip():
                continue
            if not re.match(r"^\s*[*•-]", line):
                break
            candidates.append(line.strip().lstrip("*•- ").strip())
        for candidate in candidates:
            if candidate and len(candidate) <= 100 and not re.match(
                r"(?i)^(?:medicine|medication|advice|follow.?up|date|dosage)\b", candidate
            ):
                diagnoses.extend(part.strip() for part in re.split(r"[,;]", candidate) if part.strip())

    lowered = text.casefold()
    record_type = "Medical record"
    for terms, label in (
        (("prescription", "rx", "tablet", "capsule"), "Prescription"),
        (("discharge summary", "discharge note"), "Discharge summary"),
        (("laboratory", "lab report", "blood test", "reference range"), "Laboratory report"),
        (("diagnostic report", "radiology", "imaging"), "Diagnostic report"),
    ):
        if any(term in lowered for term in terms):
            record_type = label
            break
    summaries = safe_local_summaries(observations, medications, diagnoses)
    extraction_signal = 0.05
    if text:
        extraction_signal = 0.28
        if len(re.findall(r"\b[\w-]{2,}\b", text)) >= 20:
            extraction_signal += 0.04
        if normalized_date:
            extraction_signal += 0.04
        if record_type != "Medical record":
            extraction_signal += 0.04
        extraction_signal += min(len(medications), 3) * 0.04
        extraction_signal += min(len(observations), 3) * 0.04
        extraction_signal += min(len(diagnoses), 2) * 0.04
    clarity = estimate_text_clarity(text) if source_clarity is None else source_clarity
    confidence = min(0.59, confidence_for_clarity(extraction_signal, clarity))
    return {
        "record_date": normalized_date,
        "record_type": record_type,
        "medications": medications[:12],
        "observations": observations[:20],
        "diagnoses": diagnoses[:12],
        **summaries,
        "confidence": confidence,
    }


def safe_local_summaries(
    observations: list[dict[str, Any]],
    medications: list[dict[str, str]],
    diagnoses: list[str],
) -> dict[str, str]:
    statements = {"en": [], "hi": [], "mr": [], "ta": [], "te": []}
    for item in observations:
        name = item["name"]
        value = item["value"]
        unit = item["unit"]
        low, high = item["low"], item["high"]
        if high is not None and value > high:
            meanings = {
                "en": "above the printed upper reference value",
                "hi": "दस्तावेज़ में दी गई ऊपरी संदर्भ सीमा से ऊपर",
                "mr": "दस्तऐवजात दिलेल्या वरच्या संदर्भ मर्यादेपेक्षा जास्त",
                "ta": "ஆவணத்தில் கொடுக்கப்பட்ட மேல் குறிப்பு வரம்பை விட அதிகம்",
                "te": "పత్రంలో ఇచ్చిన ఎగువ సూచన పరిమితికి మించి",
            }
        elif low is not None and value < low:
            meanings = {
                "en": "below the printed lower reference value",
                "hi": "दस्तावेज़ में दी गई निचली संदर्भ सीमा से नीचे",
                "mr": "दस्तऐवजात दिलेल्या खालच्या संदर्भ मर्यादेपेक्षा कमी",
                "ta": "ஆவணத்தில் கொடுக்கப்பட்ட கீழ் குறிப்பு வரம்பை விடக் குறைவு",
                "te": "పత్రంలో ఇచ్చిన దిగువ సూచన పరిమితి కంటే తక్కువ",
            }
        elif low is not None or high is not None:
            meanings = {
                "en": "within the printed reference values",
                "hi": "दस्तावेज़ में दी गई संदर्भ सीमा में",
                "mr": "दस्तऐवजात दिलेल्या संदर्भ मर्यादेत",
                "ta": "ஆவணத்தில் கொடுக்கப்பட்ட குறிப்பு வரம்பிற்குள்",
                "te": "పత్రంలో ఇచ్చిన సూచన పరిధిలో",
            }
        else:
            meanings = {
                "en": "the document does not show a clear reference range",
                "hi": "दस्तावेज़ में स्पष्ट संदर्भ सीमा नहीं दिखती",
                "mr": "दस्तऐवजात स्पष्ट संदर्भ मर्यादा दिलेली नाही",
                "ta": "ஆவணத்தில் தெளிவான குறிப்பு வரம்பு இல்லை",
                "te": "పత్రంలో స్పష్టమైన సూచన పరిధి లేదు",
            }
        shown_range = item.get("reference_text") or "no clear range printed"
        statements["en"].append(f"The document lists {name}: {value:g} {unit}; {meanings['en']} ({shown_range}).")
        statements["hi"].append(f"दस्तावेज़ में {name}: {value:g} {unit} दर्ज है; यह {meanings['hi']} है ({shown_range})।")
        statements["mr"].append(f"दस्तऐवजात {name}: {value:g} {unit} नोंदले आहे; हे {meanings['mr']} आहे ({shown_range}).")
        statements["ta"].append(f"ஆவணத்தில் {name}: {value:g} {unit} எனப் பதிவாகியுள்ளது; இது {meanings['ta']} ({shown_range}).")
        statements["te"].append(f"పత్రంలో {name}: {value:g} {unit}గా ఉంది; ఇది {meanings['te']} ({shown_range}).")
    for item in medications:
        dose = f", {item['dosage']}" if item.get("dosage") else ""
        statements["en"].append(f"The document lists {item['name']}{dose}; confirm the wording and directions with the prescriber or pharmacist.")
        statements["hi"].append(f"दस्तावेज़ में {item['name']}{dose} लिखा है; नाम और निर्देश डॉक्टर या फार्मासिस्ट से सत्यापित करें।")
        statements["mr"].append(f"दस्तऐवजात {item['name']}{dose} नमूद आहे; नाव व सूचना लिहिणाऱ्या डॉक्टर किंवा फार्मासिस्टकडून खात्री करा.")
        statements["ta"].append(f"ஆவணத்தில் {item['name']}{dose} என உள்ளது; பெயர் மற்றும் வழிமுறைகளை மருத்துவர் அல்லது மருந்தாளரிடம் உறுதிப்படுத்துங்கள்.")
        statements["te"].append(f"పత్రంలో {item['name']}{dose} అని ఉంది; పేరు, సూచనలను వైద్యుడు లేదా ఫార్మసిస్ట్‌తో నిర్ధారించుకోండి.")
    for diagnosis in diagnoses:
        statements["en"].append(f"The document records the wording “{diagnosis}”; this extraction is not a new diagnosis.")
        statements["hi"].append(f"दस्तावेज़ में “{diagnosis}” दर्ज है; यह निष्कर्ष कोई नया निदान नहीं है।")
        statements["mr"].append(f"दस्तऐवजात “{diagnosis}” असा मजकूर आहे; ही माहिती नवीन निदान नाही.")
        statements["ta"].append(f"ஆவணத்தில் “{diagnosis}” என்ற சொற்றொடர் உள்ளது; இது புதிய நோயறிதல் அல்ல.")
        statements["te"].append(f"పత్రంలో “{diagnosis}” అనే పదాలు ఉన్నాయి; ఇది కొత్త నిర్ధారణ కాదు.")
    if not statements["en"]:
        statements["en"].append("Text extraction is limited, so this summary may not cover the document. Please review each field against the source.")
        statements["hi"].append("पाठ निकालना सीमित रहा, इसलिए सारांश में दस्तावेज़ की सभी बातें शामिल न हों। हर फ़ील्ड को मूल से जाँचें।")
        statements["mr"].append("मजकूर ओळख मर्यादित आहे; त्यामुळे या सारांशात सर्व माहिती असेलच असे नाही. प्रत्येक नोंद मूळ दस्तऐवजाशी तपासा.")
        statements["ta"].append("உரைப் பிரித்தெடுத்தல் குறைவாக உள்ளது; சுருக்கத்தில் எல்லா விவரங்களும் இருக்காமல் இருக்கலாம். ஒவ்வொரு தகவலையும் மூல ஆவணத்துடன் சரிபாருங்கள்.")
        statements["te"].append("పాఠ్య గుర్తింపు పరిమితంగా ఉంది; ఈ సారాంశంలో అన్ని వివరాలు ఉండకపోవచ్చు. ప్రతి అంశాన్ని అసలు పత్రంతో తనిఖీ చేయండి.")
    if observations:
        safety = {
            "en": "A result outside a printed reference range is not itself a diagnosis and may have different explanations. Ask your clinician how this document applies to you. Do not start, stop, or change treatment based on this summary.",
            "hi": "दी गई संदर्भ सीमा से बाहर परिणाम अपने-आप में निदान नहीं है और इसके अलग-अलग कारण हो सकते हैं। यह दस्तावेज़ आपके लिए क्या मायने रखता है, डॉक्टर से पूछें। इस सारांश के आधार पर उपचार शुरू, बंद या न बदलें।",
            "mr": "दिलेल्या संदर्भ मर्यादेबाहेरील परिणाम म्हणजे स्वतःहून निदान नव्हे; त्याची इतर कारणेही असू शकतात. हा अहवाल आपल्यासाठी काय दर्शवतो ते डॉक्टरांना विचारा. या सारांशावरून उपचार सुरू, थांबवू किंवा बदलू नका.",
            "ta": "கொடுக்கப்பட்ட குறிப்பு வரம்புக்கு வெளியே உள்ள முடிவு மட்டும் நோயறிதல் அல்ல; அதற்கு வேறு காரணங்களும் இருக்கலாம். இந்த ஆவணம் உங்களுக்கு என்ன பொருள் தருகிறது என்பதை மருத்துவரிடம் கேளுங்கள். இந்தச் சுருக்கத்தின் அடிப்படையில் சிகிச்சையைத் தொடங்கவோ நிறுத்தவோ மாற்றவோ வேண்டாம்.",
            "te": "ఇచ్చిన సూచన పరిధికి బయట ఉన్న ఫలితం ఒక్కటే నిర్ధారణ కాదు; దానికి ఇతర కారణాలు ఉండవచ్చు. ఈ పత్రం మీకు ఏమి సూచిస్తుందో వైద్యుడిని అడగండి. ఈ సారాంశం ఆధారంగా చికిత్సను ప్రారంభించవద్దు, ఆపవద్దు లేదా మార్చవద్దు.",
        }
    else:
        safety = {
            "en": "This summary is not a diagnosis. Ask your clinician how this document applies to you. Do not start, stop, or change treatment based on this summary.",
            "hi": "यह सारांश निदान नहीं है। यह दस्तावेज़ आपके लिए क्या मायने रखता है, डॉक्टर से पूछें। इस सारांश के आधार पर उपचार शुरू, बंद या न बदलें।",
            "mr": "हा सारांश निदान नाही. हा दस्तऐवज आपल्यासाठी काय दर्शवतो ते डॉक्टरांना विचारा. या सारांशावरून उपचार सुरू, थांबवू किंवा बदलू नका.",
            "ta": "இந்தச் சுருக்கம் நோயறிதல் அல்ல. இந்த ஆவணம் உங்களுக்கு என்ன பொருள் தருகிறது என்பதை மருத்துவரிடம் கேளுங்கள். இதன் அடிப்படையில் சிகிச்சையைத் தொடங்கவோ நிறுத்தவோ மாற்றவோ வேண்டாம்.",
            "te": "ఈ సారాంశం నిర్ధారణ కాదు. ఈ పత్రం మీకు ఏమి సూచిస్తుందో వైద్యుడిని అడగండి. దీని ఆధారంగా చికిత్సను ప్రారంభించవద్దు, ఆపవద్దు లేదా మార్చవద్దు.",
        }
    for locale in statements:
        statements[locale].append(safety[locale])
    return {f"summary_{locale}": " ".join(parts) for locale, parts in statements.items()}


AI_SYSTEM_PROMPT = """You extract data from medical documents for a personal record organizer. You are NOT a clinician and must not diagnose, triage, recommend, prescribe, suggest stopping/changing treatment, or imply a result is dangerous. Use cautious plain-language wording ("the report lists", "may be", "ask your clinician"). Keep units and reference intervals exactly as printed; do not infer missing units/ranges or normalize ambiguous values. Do not invent. If uncertain, use null/empty fields and lower confidence. Return only valid JSON matching this shape:
{"record_date":"YYYY-MM-DD or empty","record_type":"short document type","medications":[{"name":"","dosage":"","instructions":""}],"observations":[{"name":"","value":0,"unit":"","low":null,"high":null,"reference_text":""}],"diagnoses":["exactly documented wording only"],"summary_en":"lay explanation in English","summary_hi":"Hindi equivalent","summary_mr":"Marathi equivalent","summary_ta":"Tamil equivalent","summary_te":"Telugu equivalent","confidence":0.0}
Write all five summaries in plain language and include the same source attribution, cautious uncertainty, ask-your-clinician reminder, and the instruction that the summary is not a diagnosis and must not be used to change treatment. Mention only readable text. Preserve medical names, doses, units, numbers, and printed ranges exactly; do not silently translate or alter them. For handwritten, bilingual, or unclear text, mark uncertainty and reduce confidence."""


def ask_ai(path: Path, content_type: str, ocr_text: str) -> dict[str, Any] | None:
    api_key = os.getenv("AI_API_KEY", "").strip()
    if not api_key:
        return None
    base_url = os.getenv(
        "AI_BASE_URL",
        "https://generativelanguage.googleapis.com/v1beta/openai/",
    ).rstrip("/")
    model = os.getenv("AI_MODEL", "gemini-3.5-flash")
    user_content: list[dict[str, Any]] = [
        {
            "type": "text",
            "text": f"Extract this medical record. OCR text (may be imperfect):\n{ocr_text[:24000] or '[No OCR text available; inspect the attached image if present.]'}",
        }
    ]
    if content_type.startswith("image/"):
        encoded = base64.b64encode(path.read_bytes()).decode("ascii")
        user_content.append({"type": "image_url", "image_url": {"url": f"data:{content_type};base64,{encoded}", "detail": "high"}})
    elif content_type == "application/pdf":
        pages, _ = render_pdf_pages(path, max_pages=5)
        for page in pages:
            encoded = base64.b64encode(page).decode("ascii")
            user_content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{encoded}", "detail": "high"}})

    body = json.dumps(
        {
            "model": model,
            "temperature": 0,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": AI_SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
        }
    ).encode("utf-8")
    request = urllib.request.Request(
        f"{base_url}/chat/completions",
        data=body,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            result = json.loads(response.read().decode("utf-8"))
        content = result["choices"][0]["message"]["content"]
        extracted = json.loads(content)
        result = validate_extraction(extracted)
        if not all(result[f"summary_{locale}"] for locale in ("en", "hi", "mr", "ta", "te")):
            fallback = fallback_extract(ocr_text)
            for locale in ("en", "hi", "mr", "ta", "te"):
                key = f"summary_{locale}"
                result[key] = result[key] or fallback[key]
        return result
    except urllib.error.HTTPError as exc:
        try:
            error_body = json.loads(exc.read().decode("utf-8", errors="replace"))
            provider_message = error_body[0]["error"]["message"] if isinstance(error_body, list) else error_body["error"]["message"]
        except (IndexError, KeyError, TypeError, ValueError, json.JSONDecodeError):
            provider_message = exc.reason
        raise RuntimeError(f"AI extraction failed: Gemini API HTTP {exc.code}: {provider_message}") from exc
    except (urllib.error.URLError, TimeoutError, KeyError, IndexError, TypeError, ValueError) as exc:
        raise RuntimeError(f"AI extraction failed: {exc}") from exc


def validate_extraction(value: Any) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ValueError("AI response must be a JSON object.")
    meds = value.get("medications", [])
    observations = value.get("observations", [])
    diagnoses = value.get("diagnoses", [])
    if not isinstance(meds, list) or not isinstance(observations, list) or not isinstance(diagnoses, list):
        raise ValueError("AI response has invalid medication, observation, or diagnosis fields.")
    clean_meds = [
        {
            "name": str(item.get("name", ""))[:120],
            "dosage": str(item.get("dosage", ""))[:120],
            "instructions": str(item.get("instructions", ""))[:250],
        }
        for item in meds[:30] if isinstance(item, dict)
    ]
    clean_obs = []
    for item in observations[:40]:
        if not isinstance(item, dict):
            continue
        raw_value = item.get("value")
        try:
            number = float(raw_value) if raw_value is not None and str(raw_value).strip() else None
        except (ValueError, TypeError):
            number = None
        if number is not None and not math.isfinite(number):
            number = None
        low = item.get("low")
        high = item.get("high")
        try:
            low = float(low) if low is not None and str(low).strip() else None
            high = float(high) if high is not None and str(high).strip() else None
        except (ValueError, TypeError):
            low, high = None, None
        if low is not None and not math.isfinite(low):
            low = None
        if high is not None and not math.isfinite(high):
            high = None
        clean_obs.append(
            {
                "name": str(item.get("name", ""))[:120],
                "value": number,
                "unit": str(item.get("unit", ""))[:40],
                "low": low,
                "high": high,
                "reference_text": str(item.get("reference_text", ""))[:120],
            }
        )
    try:
        confidence = max(0.0, min(1.0, float(value.get("confidence", 0.25))))
    except (ValueError, TypeError):
        confidence = 0.25
    if not math.isfinite(confidence):
        confidence = 0.25
    record_date = str(value.get("record_date", ""))[:10]
    if record_date:
        try:
            datetime.strptime(record_date, "%Y-%m-%d")
        except ValueError:
            record_date = ""
    return {
        "record_date": record_date,
        "record_type": str(value.get("record_type", "Medical record"))[:80],
        "medications": clean_meds,
        "observations": clean_obs,
        "diagnoses": [str(item)[:160] for item in diagnoses[:20] if str(item).strip()],
        "summary_en": str(value.get("summary_en", ""))[:2000],
        "summary_hi": str(value.get("summary_hi", ""))[:2000],
        "summary_mr": str(value.get("summary_mr", ""))[:2000],
        "summary_ta": str(value.get("summary_ta", ""))[:2000],
        "summary_te": str(value.get("summary_te", ""))[:2000],
        "confidence": confidence,
    }


def extension_value(resource: dict[str, Any], key: str, default: Any = "") -> Any:
    return get_extensions(resource).get(key, default)


def create_doc_resource(
    filename: str,
    content_type: str,
    relative_path: str,
    ocr_text: str,
    extraction: dict[str, Any],
    warnings: list[str],
) -> dict[str, Any]:
    resource = {
        "resourceType": "DocumentReference",
        "id": new_id("document"),
        "status": "current",
        "subject": {"reference": "Patient/demo-patient"},
        "date": f"{extraction.get('record_date') or date.today().isoformat()}T12:00:00+05:30",
        "type": codeable(extraction.get("record_type") or "Medical record"),
        "description": filename,
        "content": [{"attachment": {"contentType": content_type, "url": relative_path, "title": filename}, "format": {"code": "uploaded"}}],
        "context": {"related": []},
    }
    set_extensions(
        resource,
        {
            "summary-en": extraction["summary_en"],
            "summary-hi": extraction["summary_hi"],
            "summary-mr": extraction["summary_mr"],
            "summary-ta": extraction["summary_ta"],
            "summary-te": extraction["summary_te"],
            "confidence": extraction["confidence"],
            "review-status": "needs-review",
            "source-name": filename,
            "ocr-text": ocr_text[:24000],
            "extraction-json": json.dumps(extraction, ensure_ascii=False),
            "warnings-json": json.dumps(warnings, ensure_ascii=False),
            "saved-path": relative_path,
        },
    )
    return resource


def observation_resource(patient_id: str, doc_id: str, item: dict[str, Any], record_date: str) -> dict[str, Any]:
    value: dict[str, Any] = {
        "resourceType": "Observation",
        "id": new_id("observation"),
        "status": "final",
        "category": [{"text": "laboratory"}],
        "code": codeable(item["name"]),
        "subject": {"reference": f"Patient/{patient_id}"},
        "effectiveDateTime": record_date,
        "derivedFrom": [{"reference": f"DocumentReference/{doc_id}"}],
    }
    if item.get("value") is not None:
        value["valueQuantity"] = {
            "value": item["value"],
            "unit": item.get("unit", ""),
            "system": "http://unitsofmeasure.org",
            "code": item.get("unit", ""),
        }
    ranges = {}
    if item.get("low") is not None:
        ranges["low"] = {"value": item["low"], "unit": item.get("unit", "")}
    if item.get("high") is not None:
        ranges["high"] = {"value": item["high"], "unit": item.get("unit", "")}
    if ranges or item.get("reference_text"):
        ranges["text"] = item.get("reference_text", "")
        value["referenceRange"] = [ranges]
    quantity = value.get("valueQuantity", {}).get("value")
    if isinstance(quantity, (float, int)) and item.get("low") is not None and quantity < item["low"]:
        value["interpretation"] = [{"text": "low"}]
    elif isinstance(quantity, (float, int)) and item.get("high") is not None and quantity > item["high"]:
        value["interpretation"] = [{"text": "high"}]
    return value


def normalize_review(payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValueError("Review payload must be an object.")
    for collection in ("medications", "observations", "diagnoses"):
        if not isinstance(payload.get(collection, []), list):
            raise ValueError(f"{collection} must be a list.")
    required_text = ("title", "record_type", "record_date")
    result = {}
    for key in required_text:
        value = str(payload.get(key, "")).strip()
        if len(value) > 160:
            raise ValueError(f"{key} exceeds the allowed length.")
        result[key] = value
    for locale in ("en", "hi", "mr", "ta", "te"):
        result[f"summary_{locale}"] = str(payload.get(f"summary_{locale}", "")).strip()[:2000]
    try:
        datetime.strptime(result["record_date"], "%Y-%m-%d")
    except ValueError as exc:
        raise ValueError("Record date must use YYYY-MM-DD.") from exc

    result["medications"] = []
    for item in payload.get("medications", [])[:30]:
        if isinstance(item, dict) and str(item.get("name", "")).strip():
            result["medications"].append(
                {"name": str(item["name"]).strip()[:120], "dosage": str(item.get("dosage", "")).strip()[:120], "instructions": str(item.get("instructions", "")).strip()[:250]}
            )
    result["observations"] = []
    for item in payload.get("observations", [])[:40]:
        if not isinstance(item, dict) or not str(item.get("name", "")).strip():
            continue

        def optional_number(key: str) -> float | None:
            raw = item.get(key)
            if raw is None or str(raw).strip() == "":
                return None
            value = float(raw)
            if not math.isfinite(value):
                raise ValueError(f"{key} must be a finite number.")
            return value

        result["observations"].append(
            {
                "name": str(item["name"]).strip()[:120],
                "value": optional_number("value"),
                "unit": str(item.get("unit", "")).strip()[:40],
                "low": optional_number("low"),
                "high": optional_number("high"),
                "reference_text": str(item.get("reference_text", "")).strip()[:120],
            }
        )
    diagnoses = payload.get("diagnoses", [])
    result["diagnoses"] = [str(item).strip()[:160] for item in diagnoses[:20] if str(item).strip()]
    return result


def confirm_review(doc_id: str, payload: Any) -> dict[str, Any]:
    review = normalize_review(payload)
    with DB_LOCK, connect_db() as connection:
        row = connection.execute(
            "SELECT data FROM fhir_resources WHERE id=? AND resource_type='DocumentReference'", (doc_id,)
        ).fetchone()
        if not row:
            raise KeyError("Document not found.")
        doc = json.loads(row["data"])
        extensions = get_extensions(doc)
        for locale in ("en", "hi", "mr", "ta", "te"):
            summary_key = f"summary_{locale}"
            if not review[summary_key]:
                review[summary_key] = extensions.get(f"summary-{locale}", "")
        existing_links = [
            entry.get("reference", "").split("/", 1)[-1]
            for entry in doc.get("context", {}).get("related", [])
            if entry.get("reference", "").split("/", 1)[0] in {"Observation", "MedicationRequest", "Condition", "Encounter", "DiagnosticReport"}
        ]
        for resource_id in existing_links:
            connection.execute("DELETE FROM fhir_resources WHERE id=?", (resource_id,))

        patient_id = doc["subject"]["reference"].split("/")[-1]
        linked: list[dict[str, str]] = []
        observations = [observation_resource(patient_id, doc_id, item, review["record_date"]) for item in review["observations"]]
        for resource in observations:
            persist_resource(connection, resource)
            linked.append({"reference": f"Observation/{resource['id']}"})
        for item in review["medications"]:
            resource = {
                "resourceType": "MedicationRequest",
                "id": new_id("medication"),
                "status": "active",
                "intent": "order",
                "medicationCodeableConcept": codeable(item["name"]),
                "subject": {"reference": f"Patient/{patient_id}"},
                "authoredOn": review["record_date"],
                "dosageInstruction": [{"text": " ".join(part for part in [item["dosage"], item["instructions"]] if part)}],
                "requester": {"display": "As recorded in source document"},
            }
            persist_resource(connection, resource)
            linked.append({"reference": f"MedicationRequest/{resource['id']}"})
        for diagnosis in review["diagnoses"]:
            resource = {
                "resourceType": "Condition",
                "id": new_id("condition"),
                "clinicalStatus": codeable("active"),
                "verificationStatus": codeable("unconfirmed"),
                "code": codeable(diagnosis),
                "subject": {"reference": f"Patient/{patient_id}"},
                "recordedDate": review["record_date"],
                "note": [{"text": "Extracted from a user-reviewed document; verify with a clinician."}],
            }
            persist_resource(connection, resource)
            linked.append({"reference": f"Condition/{resource['id']}"})
        doc["description"] = review["title"]
        doc["date"] = f"{review['record_date']}T12:00:00+05:30"
        doc["type"] = codeable(review["record_type"])
        doc["context"] = {"related": linked}
        for content in doc.get("content", []):
            attachment = content.get("attachment", {})
            attachment["title"] = review["title"]
        extensions.update(
            {
                "summary-en": review["summary_en"],
                "summary-hi": review["summary_hi"],
                "summary-mr": review["summary_mr"],
                "summary-ta": review["summary_ta"],
                "summary-te": review["summary_te"],
                "review-status": "confirmed",
                "extraction-json": json.dumps(review, ensure_ascii=False),
            }
        )
        set_extensions(doc, extensions)
        persist_resource(connection, doc)

        if observations:
            report = {
                "resourceType": "DiagnosticReport",
                "id": new_id("report"),
                "status": "final",
                "code": codeable(review["record_type"]),
                "subject": {"reference": f"Patient/{patient_id}"},
                "effectiveDateTime": review["record_date"],
                "result": [{"reference": link["reference"]} for link in linked if link["reference"].startswith("Observation/")],
                "basedOn": [],
                "presentedForm": [{"contentType": "application/pdf", "title": review["title"]}],
            }
            persist_resource(connection, report)
            doc["context"]["related"].append({"reference": f"DiagnosticReport/{report['id']}"})
            persist_resource(connection, doc)
        return doc


def prepare_upload(filename: str, content_type: str, content: bytes) -> tuple[dict[str, Any], list[str]]:
    safe_name = Path(filename.replace("\\", "/")).name[:180] or "medical-record"
    suffix = Path(safe_name).suffix.casefold()
    allowed = {".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".tif": "image/tiff", ".tiff": "image/tiff"}
    if suffix not in allowed:
        raise ValueError("Upload a PDF or image file (PNG, JPG, WEBP, or TIFF).")
    if not content or len(content) > MAX_UPLOAD_BYTES:
        raise ValueError(f"File must be non-empty and no larger than {MAX_UPLOAD_BYTES // (1024 * 1024)} MB.")
    content_type = allowed[suffix]
    stored_name = f"{uuid.uuid4().hex}{suffix}"
    remote_storage = vercel_runtime()
    if remote_storage:
        destination = Path(tempfile.gettempdir()) / stored_name
    else:
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
        destination = UPLOAD_DIR / stored_name
    destination.write_bytes(content)
    relative_path = f"uploads/{stored_name}"
    uploaded_to_storage = False
    try:
        ocr_text, ocr_warning = ocr_file(destination, content_type)
        warnings = [ocr_warning] if ocr_warning else []
        clarity = source_clarity_score(destination, content_type)
        if clarity is None:
            clarity = estimate_text_clarity(ocr_text)
        if content_type == "application/pdf" and os.getenv("AI_API_KEY", "").strip():
            _, vision_warning = render_pdf_pages(destination, max_pages=5)
            if vision_warning:
                warnings.append(vision_warning)
        extraction = fallback_extract(ocr_text, clarity)
        ai_error = None
        try:
            ai_extraction = ask_ai(destination, content_type, ocr_text)
            if ai_extraction is not None:
                ai_extraction["confidence"] = confidence_for_clarity(ai_extraction["confidence"], clarity)
                extraction = ai_extraction
        except RuntimeError as exc:
            ai_error = str(exc)
            warnings.append(ai_error)
        if not ocr_text and content_type == "application/pdf":
            warnings.append("No readable text was detected. Enter details manually after review.")
        if extraction["confidence"] < 0.6:
            warnings.append("Low-confidence extraction: carefully compare every field with the original before confirming.")
        resource = create_doc_resource(safe_name, content_type, relative_path, ocr_text, extraction, warnings)
        if remote_storage:
            upload_storage_object(relative_path, content, content_type)
            uploaded_to_storage = True
        with DB_LOCK, connect_db() as connection:
            persist_resource(connection, resource)
        return {"document": resource, "extraction": extraction, "warnings": warnings, "ai_error": ai_error}, warnings
    except Exception:
        if uploaded_to_storage:
            try:
                delete_storage_object(relative_path)
            except Exception as cleanup_error:
                sys.stderr.write(f"Failed to clean up an unlinked Supabase Storage object: {cleanup_error}\n")
        raise
    finally:
        if remote_storage and destination.is_file():
            destination.unlink()


class MedLensHandler(BaseHTTPRequestHandler):
    server_version = "MedLensPrototype/1.0"

    def log_message(self, format_string: str, *args: Any) -> None:
        sys.stderr.write(f"[{self.log_date_time_string()}] {format_string % args}\n")

    def send_json(self, status: int, value: Any) -> None:
        body = json.dumps(value, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "strict-origin-when-cross-origin")
        self.end_headers()
        self.wfile.write(body)

    def read_json(self) -> Any:
        length = int(self.headers.get("Content-Length", "0"))
        if length > 1024 * 1024:
            raise ValueError("Request body is too large.")
        return json.loads(self.rfile.read(length).decode("utf-8"))

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            self.send_json(200, {"ok": True, "ai_configured": bool(os.getenv("AI_API_KEY", "").strip()), "max_upload_mb": MAX_UPLOAD_BYTES // (1024 * 1024)})
            return
        if parsed.path == "/api/profile":
            with DB_LOCK, connect_db() as connection:
                resources = read_resources(connection)
            patient = next((item for item in resources if item["resourceType"] == "Patient"), None)
            docs = [item for item in resources if item["resourceType"] == "DocumentReference"]
            patient_id = patient["id"] if patient else "demo-patient"
            entries = []
            for resource in resources:
                if resource["resourceType"] == "Patient":
                    continue
                when = resource.get("effectiveDateTime") or resource.get("authoredOn") or resource.get("recordedDate") or resource.get("period", {}).get("start") or resource.get("date", "")
                if resource["resourceType"] in {"DiagnosticReport", "Encounter", "Observation", "Condition", "MedicationRequest", "DocumentReference"}:
                    entries.append({"resource": resource, "date": when[:10], "document_id": next((ref.get("reference", "").split("/")[-1] for ref in resource.get("derivedFrom", []) if ref.get("reference", "").startswith("DocumentReference/")), "")})
            self.send_json(200, {"patient": patient, "documents": docs, "timeline": sorted(entries, key=lambda entry: (entry["date"], entry["resource"]["resourceType"]), reverse=True), "resources": resources, "demo": True, "ai_configured": bool(os.getenv("AI_API_KEY", "").strip()), "max_upload_mb": MAX_UPLOAD_MB})
            return
        if parsed.path == "/api/export/fhir":
            with DB_LOCK, connect_db() as connection:
                resources = read_resources(connection)
            self.send_json(
                200,
                {
                    "resourceType": "Bundle",
                    "id": new_id("bundle"),
                    "type": "collection",
                    "timestamp": now_iso(),
                    "entry": [
                        {
                            "fullUrl": f"urn:uuid:{uuid.uuid5(uuid.NAMESPACE_URL, 'medlens/' + resource['resourceType'] + '/' + resource['id'])}",
                            "resource": resource,
                        }
                        for resource in resources
                    ],
                },
            )
            return
        if parsed.path.startswith("/uploads/"):
            stored_name = Path(parsed.path).name
            if not stored_name or stored_name in {".", ".."}:
                self.send_error(404)
                return
            if vercel_runtime():
                try:
                    content, content_type = download_storage_object(f"uploads/{stored_name}")
                except FileNotFoundError:
                    self.send_error(404)
                    return
                except (RuntimeError, ValueError):
                    self.send_error(502)
                    return
            else:
                file_path = (UPLOAD_DIR / stored_name).resolve()
                if file_path.parent != UPLOAD_DIR.resolve() or not file_path.is_file():
                    self.send_error(404)
                    return
                content = file_path.read_bytes()
                content_type = mimetypes.guess_type(file_path.name)[0] or "application/octet-stream"
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.send_header("Cache-Control", "private, max-age=3600")
            self.end_headers()
            self.wfile.write(content)
            return
        if parsed.path.startswith("/api/"):
            self.send_json(404, {"error": "API route not found."})
            return
        relative = "index.html" if parsed.path in {"/", ""} else parsed.path.lstrip("/")
        requested = (STATIC_DIR / relative).resolve()
        if STATIC_DIR.resolve() not in requested.parents and requested != STATIC_DIR.resolve():
            self.send_error(404)
            return
        if not requested.is_file():
            self.send_error(404)
            return
        content = requested.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mimetypes.guess_type(requested.name)[0] or "application/octet-stream")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path == "/api/abha/simulate":
            try:
                payload = self.read_json()
                formatted_id = normalize_simulated_abha_id(payload.get("abha_id"))
                with DB_LOCK, connect_db() as connection:
                    patient_row = connection.execute(
                        "SELECT data FROM fhir_resources WHERE resource_type='Patient' LIMIT 1"
                    ).fetchone()
                    if not patient_row:
                        raise RuntimeError("Demo patient is not available.")
                    patient = json.loads(patient_row["data"])
                    patient["identifier"] = [
                        identifier
                        for identifier in patient.get("identifier", [])
                        if identifier.get("system") != SIMULATED_ABHA_IDENTIFIER_SYSTEM
                    ]
                    patient["identifier"].append(
                        {
                            "use": "usual",
                            "system": SIMULATED_ABHA_IDENTIFIER_SYSTEM,
                            "value": formatted_id,
                            "assigner": {"display": "Simulated ABHA link — not verified with ABDM"},
                        }
                    )
                    persist_resource(connection, patient)
                self.send_json(200, {"patient": patient, "simulation": True})
            except (ValueError, json.JSONDecodeError) as exc:
                self.send_json(400, {"error": str(exc)})
            except Exception as exc:
                self.send_json(500, {"error": f"ABHA simulation failed: {exc}"})
            return
        if parsed.path == "/api/upload":
            content_type = self.headers.get("Content-Type", "")
            match = re.search(r"boundary=(?:\"([^\"]+)\"|([^;]+))", content_type)
            if not content_type.startswith("multipart/form-data") or not match:
                self.send_json(400, {"error": "Upload must use multipart/form-data."})
                return
            boundary = (match.group(1) or match.group(2)).encode("ascii")
            length = int(self.headers.get("Content-Length", "0"))
            if length > MAX_UPLOAD_BYTES + 1024 * 1024:
                self.send_json(413, {"error": f"Upload exceeds {MAX_UPLOAD_BYTES // (1024 * 1024)} MB."})
                return
            body = self.rfile.read(length)
            parts = body.split(b"--" + boundary)
            uploaded = None
            for part in parts:
                header, separator, data = part.partition(b"\r\n\r\n")
                if not separator or b'filename="' not in header:
                    continue
                name_match = re.search(rb'filename="([^"]*)"', header)
                if not name_match:
                    continue
                uploaded = (name_match.group(1).decode("utf-8", errors="replace"), data.rstrip(b"\r\n-"))
                break
            if not uploaded:
                self.send_json(400, {"error": "No file was included in the upload."})
                return
            try:
                result, _ = prepare_upload(uploaded[0], "", uploaded[1])
                self.send_json(201, result)
            except ValueError as exc:
                self.send_json(400, {"error": str(exc)})
            except Exception as exc:
                self.send_json(500, {"error": f"Upload processing failed: {exc}"})
            return
        if parsed.path.startswith("/api/documents/") and parsed.path.endswith("/confirm"):
            doc_id = parsed.path.removeprefix("/api/documents/").removesuffix("/confirm").strip("/")
            try:
                resource = confirm_review(doc_id, self.read_json())
                self.send_json(200, {"document": resource})
            except KeyError as exc:
                self.send_json(404, {"error": str(exc)})
            except (ValueError, json.JSONDecodeError) as exc:
                self.send_json(400, {"error": str(exc)})
            except Exception as exc:
                self.send_json(500, {"error": f"Could not save reviewed record: {exc}"})
            return
        self.send_json(404, {"error": "API route not found."})

    def do_DELETE(self) -> None:
        doc_id = urlparse(self.path).path.removeprefix("/api/documents/")
        if not doc_id or "/" in doc_id:
            self.send_json(404, {"error": "Document not found."})
            return
        with DB_LOCK, connect_db() as connection:
            row = connection.execute(
                "SELECT data FROM fhir_resources WHERE id=? AND resource_type='DocumentReference'", (doc_id,)
            ).fetchone()
            if not row:
                self.send_json(404, {"error": "Document not found."})
                return
            resource = json.loads(row["data"])
            for entry in resource.get("context", {}).get("related", []):
                reference = entry.get("reference", "")
                if "/" in reference:
                    connection.execute("DELETE FROM fhir_resources WHERE id=?", (reference.split("/", 1)[1],))
            saved_path = get_extensions(resource).get("saved-path", "")
            if saved_path.startswith("uploads/"):
                if vercel_runtime():
                    delete_storage_object(saved_path)
                else:
                    upload_path = (ROOT / saved_path).resolve()
                    if upload_path.parent == UPLOAD_DIR.resolve() and upload_path.is_file():
                        upload_path.unlink()
            connection.execute("DELETE FROM fhir_resources WHERE id=?", (doc_id,))
        self.send_json(200, {"deleted": doc_id})


def main() -> None:
    global MAX_UPLOAD_BYTES, MAX_UPLOAD_MB
    load_dotenv()
    MAX_UPLOAD_MB = max(1, int(os.getenv("MAX_UPLOAD_MB", "12")))
    MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024
    try:
        seed_database()
    except RuntimeError as exc:
        print(f"Startup failed: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    http_server = ThreadingHTTPServer((host, port), MedLensHandler)
    print(f"AI-Powered Personal Health Copilot running at http://{host}:{port}")
    print("Structured health records are stored in the configured Supabase database.")
    try:
        http_server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
    finally:
        http_server.server_close()


if __name__ == "__main__":
    main()
