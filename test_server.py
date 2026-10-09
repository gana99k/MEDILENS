import unittest
import asyncio
import json
from unittest.mock import patch

import server


class ExtractionTests(unittest.TestCase):
    def test_vercel_supabase_storage_url_uses_private_project_credentials(self):
        with patch.dict(
            server.os.environ,
            {
                "SUPABASE_URL": "https://sample.supabase.co/",
                "SUPABASE_SERVICE_ROLE_KEY": "server-only-key",
                "SUPABASE_STORAGE_BUCKET": "medlens-private",
            },
        ):
            url, key = server.supabase_storage_url("uploads/sample file.png", authenticated=True)
        self.assertEqual(
            url,
            "https://sample.supabase.co/storage/v1/object/authenticated/medlens-private/uploads/sample%20file.png",
        )
        self.assertEqual(key, "server-only-key")

    def test_vercel_asgi_adapter_serves_health_route(self):
        from api.index import MedLensASGI

        async def run_request():
            incoming = [{"type": "http.request", "body": b"", "more_body": False}]
            outgoing = []

            async def receive():
                return incoming.pop(0)

            async def send(message):
                outgoing.append(message)

            await MedLensASGI()(
                {
                    "type": "http",
                    "method": "GET",
                    "path": "/api/index",
                    "query_string": b"__path=%2Fapi%2Fhealth",
                    "headers": [],
                    "client": ("127.0.0.1", 1234),
                },
                receive,
                send,
            )
            return outgoing

        response = asyncio.run(run_request())
        self.assertEqual(response[0]["status"], 200)
        payload = json.loads(response[1]["body"])
        self.assertTrue(payload["ok"])

    def test_vercel_upload_uses_supabase_storage_and_removes_temporary_file(self):
        document_bytes = b"fake image bytes"
        captured_path = []

        def fake_ocr(path, content_type):
            captured_path.append(path)
            self.assertTrue(path.is_file())
            return "", "OCR unavailable"

        class FakeConnection:
            def __enter__(self):
                return self

            def __exit__(self, exc_type, exc, traceback):
                return None

        with (
            patch.dict(server.os.environ, {"VERCEL": "1"}),
            patch.object(server, "MAX_UPLOAD_BYTES", 4 * 1024 * 1024),
            patch.object(server, "ocr_file", side_effect=fake_ocr),
            patch.object(server, "source_clarity_score", return_value=0.5),
            patch.object(server, "ask_ai", return_value=None),
            patch.object(server, "upload_storage_object") as upload_object,
            patch.object(server, "persist_resource"),
            patch.object(server, "connect_db", return_value=FakeConnection()),
        ):
            result, _ = server.prepare_upload("sample.png", "image/png", document_bytes)
        self.assertTrue(result["document"]["content"][0]["attachment"]["url"].startswith("uploads/"))
        upload_object.assert_called_once()
        self.assertEqual(upload_object.call_args.args[1:], (document_bytes, "image/png"))
        self.assertFalse(captured_path[0].exists())

    def test_postgres_connection_adapter_converts_placeholders_and_commits(self):
        class FakeConnection:
            def __init__(self):
                self.calls = []
                self.committed = False
                self.closed = False

            def execute(self, query, parameters):
                self.calls.append((query, parameters))
                return "cursor"

            def commit(self):
                self.committed = True

            def rollback(self):
                self.fail("Unexpected rollback")

            def close(self):
                self.closed = True

        raw = FakeConnection()
        with server.PostgresConnection(raw) as connection:
            result = connection.execute("SELECT * FROM fhir_resources WHERE id=?", ("doc-1",))
        self.assertEqual(result, "cursor")
        self.assertEqual(raw.calls, [("SELECT * FROM fhir_resources WHERE id=%s", ("doc-1",))])
        self.assertTrue(raw.committed)
        self.assertTrue(raw.closed)

    def test_database_requires_supabase_connection_string(self):
        with patch.dict(server.os.environ, {"SUPABASE_DB_URL": ""}):
            with self.assertRaisesRegex(RuntimeError, "Set SUPABASE_DB_URL"):
                server.connect_db()

    def test_database_rejects_supabase_project_api_url_as_database_url(self):
        with patch.dict(
            server.os.environ,
            {"SUPABASE_DB_URL": "https://example.supabase.co"},
        ):
            with self.assertRaisesRegex(RuntimeError, "project HTTPS URL"):
                server.connect_db()

    def test_simulated_abha_id_accepts_only_demo_formats(self):
        self.assertEqual(
            server.normalize_simulated_abha_id("12345678901234"),
            "12-3456-7890-1234",
        )
        self.assertEqual(
            server.normalize_simulated_abha_id("12-3456-7890-1234"),
            "12-3456-7890-1234",
        )
        with self.assertRaisesRegex(ValueError, "fictional demo ID"):
            server.normalize_simulated_abha_id("ab12345678901234")

    def test_simulated_abha_migration_does_not_claim_official_identifier_namespace(self):
        patient = {
            "resourceType": "Patient",
            "id": "demo-patient",
            "identifier": [
                {
                    "system": server.LEGACY_ABHA_IDENTIFIER_SYSTEM,
                    "value": "12-3456-7890-1234",
                    "assigner": {"display": "Simulated ABHA link — not verified with ABDM"},
                },
                {
                    "system": server.LEGACY_ABHA_IDENTIFIER_SYSTEM,
                    "value": "98-7654-3210-9876",
                    "assigner": {"display": "ABDM"},
                },
            ],
        }
        self.assertTrue(server.migrate_simulated_abha_identifier(patient))
        self.assertEqual(
            patient["identifier"][0]["system"],
            server.SIMULATED_ABHA_IDENTIFIER_SYSTEM,
        )
        self.assertEqual(
            patient["identifier"][1]["system"],
            server.LEGACY_ABHA_IDENTIFIER_SYSTEM,
        )
        self.assertFalse(server.migrate_simulated_abha_identifier(patient))

    def test_numeric_observation_keeps_unit_and_printed_range(self):
        result = server.fallback_extract(
            "Laboratory report\n2025-01-18\nTotal cholesterol: 214 mg/dL (ref 0-200)"
        )
        self.assertEqual(result["record_date"], "2025-01-18")
        self.assertEqual(result["record_type"], "Laboratory report")
        self.assertEqual(len(result["observations"]), 1)
        observation = result["observations"][0]
        self.assertEqual(observation["value"], 214)
        self.assertEqual(observation["unit"], "mg/dL")
        self.assertEqual((observation["low"], observation["high"]), (0, 200))
        self.assertIn("above the printed upper reference value", result["summary_en"])
        self.assertIn("not itself a diagnosis", result["summary_en"])
        self.assertIn("उपचार शुरू, बंद या न बदलें", result["summary_hi"])
        self.assertIn("सारांशावरून उपचार", result["summary_mr"])
        self.assertIn("சிகிச்சையைத்", result["summary_ta"])
        self.assertIn("చికిత్సను ప్రారంభించవద్దు", result["summary_te"])

    def test_localized_summaries_keep_exact_observation_and_safety_caveat(self):
        result = server.fallback_extract("Lab report\nTotal cholesterol: 214 mg/dL (ref 0-200)")
        for locale in ("en", "hi", "mr", "ta", "te"):
            summary = result[f"summary_{locale}"]
            self.assertIn("214 mg/dL", summary)
            self.assertIn("0–200 mg/dL", summary)
            self.assertTrue(summary.strip())

    def test_prescription_extracts_written_dose_without_advice(self):
        result = server.fallback_extract("Prescription\nVitaminD3 1000 IU once daily")
        self.assertEqual(result["record_type"], "Prescription")
        self.assertEqual(result["medications"][0]["dosage"], "1000 IU")
        self.assertIn("confirm the wording", result["summary_en"])
        self.assertNotIn("should take", result["summary_en"].lower())

    def test_unreadable_document_has_low_confidence_and_cautious_summary(self):
        result = server.fallback_extract("")
        self.assertLess(result["confidence"], 0.6)
        self.assertFalse(result["observations"])
        self.assertIn("Do not start, stop, or change treatment", result["summary_en"])

    def test_fallback_confidence_reflects_extracted_fields_and_stays_below_review_threshold(self):
        text = (
            "Prescription report\n"
            "Date: 30-Aug-2023\n"
            "Diagnosis:\n"
            "* MALARIA\n"
            "Medicine Name Dosage Duration\n"
            "1) TAB. SAMPLEMED 1 Morning 8 Days\n"
            "2) TAB. SECOND 1 Morning, 1 Night 4 Days\n"
            "Please review the information with your doctor and verify it against the original."
        )
        clear = server.fallback_extract(text, source_clarity=0.95)
        unclear = server.fallback_extract(text, source_clarity=0.2)
        self.assertGreater(clear["confidence"], unclear["confidence"])
        self.assertGreater(clear["confidence"], 0.28)
        self.assertLess(clear["confidence"], 0.6)
        self.assertEqual(clear["medications"], unclear["medications"])
        self.assertEqual(clear["diagnoses"], unclear["diagnoses"])

    def test_image_clarity_score_responds_to_blur(self):
        import io
        from PIL import Image, ImageDraw, ImageFilter

        image = Image.new("RGB", (900, 900), "white")
        draw = ImageDraw.Draw(image)
        for line, text in enumerate(
            ("MEDICAL REPORT", "Date: 2025-01-18", "Test result: 214 mg/dL", "Reference: 0-200 mg/dL")
        ):
            draw.text((40, 40 + line * 100), text, fill="black")
        clear_bytes = io.BytesIO()
        image.save(clear_bytes, format="PNG")
        blurred_bytes = io.BytesIO()
        image.filter(ImageFilter.GaussianBlur(radius=5)).save(blurred_bytes, format="PNG")
        self.assertGreater(
            server.image_clarity_score(clear_bytes.getvalue()),
            server.image_clarity_score(blurred_bytes.getvalue()),
        )

    def test_ai_extraction_validation_bounds_and_preserves_values(self):
        result = server.validate_extraction(
            {
                "record_date": "2025-02-03",
                "record_type": "Blood test",
                "medications": [{"name": "Example", "dosage": "5 mg", "instructions": "once daily"}],
                "observations": [{"name": "Marker", "value": "2.5", "unit": "mg/L", "low": "1", "high": "2"}],
                "diagnoses": ["As written"],
                "confidence": 1.5,
            }
        )
        self.assertEqual(result["observations"][0]["value"], 2.5)
        self.assertEqual(result["observations"][0]["unit"], "mg/L")
        self.assertEqual(result["confidence"], 1)
        self.assertEqual(result["record_date"], "2025-02-03")

    def test_ask_ai_uses_gemini_compatible_endpoint_and_configured_model(self):
        from unittest.mock import MagicMock
        import json
        import tempfile

        response_content = json.dumps(
            {
                "record_date": "",
                "record_type": "Medical record",
                "medications": [],
                "observations": [],
                "diagnoses": [],
                "summary_en": "The document contains no readable health details.",
                "summary_hi": "दस्तावेज़ में पढ़ने योग्य स्वास्थ्य विवरण नहीं हैं।",
                "summary_mr": "दस्तऐवजात वाचण्याजोगे आरोग्य तपशील नाहीत.",
                "summary_ta": "ஆவணத்தில் படிக்கக்கூடிய சுகாதார விவரங்கள் இல்லை.",
                "summary_te": "పత్రంలో చదవగలిగే ఆరోగ్య వివరాలు లేవు.",
                "confidence": 0.2,
            }
        )
        response = MagicMock()
        response.__enter__.return_value.read.return_value = json.dumps(
            {"choices": [{"message": {"content": response_content}}]}
        ).encode()
        with tempfile.TemporaryDirectory() as directory:
            image_path = server.Path(directory) / "record.png"
            image_path.write_bytes(b"test image bytes")
            with (
                patch.dict(
                    server.os.environ,
                    {
                        "AI_API_KEY": "test-gemini-key",
                        "AI_BASE_URL": "https://generativelanguage.googleapis.com/v1beta/openai/",
                        "AI_MODEL": "gemini-3.5-flash",
                    },
                ),
                patch.object(server.urllib.request, "urlopen", return_value=response) as urlopen,
            ):
                extracted = server.ask_ai(image_path, "image/png", "printed record text")
        request = urlopen.call_args.args[0]
        self.assertEqual(
            request.full_url,
            "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        )
        self.assertEqual(request.get_header("Authorization"), "Bearer test-gemini-key")
        payload = json.loads(request.data)
        self.assertEqual(payload["model"], "gemini-3.5-flash")
        self.assertEqual(extracted["record_type"], "Medical record")

    def test_review_requires_iso_date_and_builds_fhir_observation(self):
        with self.assertRaises(ValueError):
            server.normalize_review({"record_date": "03/02/2025"})
        observation = server.observation_resource(
            "demo-patient",
            "doc-example",
            {"name": "Marker", "value": 8, "unit": "mg/L", "low": 1, "high": 5, "reference_text": "1–5 mg/L"},
            "2025-02-03",
        )
        self.assertEqual(observation["resourceType"], "Observation")
        self.assertEqual(observation["valueQuantity"]["unit"], "mg/L")
        self.assertEqual(observation["interpretation"][0]["text"], "high")

    def test_review_rejects_non_finite_measurements_and_bad_collections(self):
        with self.assertRaises(ValueError):
            server.normalize_review({"record_date": "2025-02-03", "observations": [{"name": "Marker", "value": "NaN"}]})
        with self.assertRaises(ValueError):
            server.normalize_review({"record_date": "2025-02-03", "medications": "not a list"})
        self.assertEqual(server.validate_extraction({"record_date": "2025-99-40"})["record_date"], "")

    def test_review_summary_fields_are_optional(self):
        result = server.normalize_review(
            {"title": "Lab report", "record_type": "Laboratory report", "record_date": "2025-02-03"}
        )
        self.assertEqual(result["summary_en"], "")
        self.assertEqual(result["summary_te"], "")

    def test_tesseract_language_selection_uses_installed_data(self):
        completed = server.subprocess.CompletedProcess(
            args=["tesseract", "--list-langs"],
            returncode=0,
            stdout="List of available languages (2):\neng\nosd\n",
            stderr="",
        )
        with patch.object(server.subprocess, "run", return_value=completed):
            self.assertEqual(server.tesseract_languages("tesseract"), ("eng", None))

    def test_tesseract_language_selection_honors_installed_configured_languages(self):
        completed = server.subprocess.CompletedProcess(
            args=["tesseract", "--list-langs"],
            returncode=0,
            stdout="List of available languages (3):\neng\nhin\nmal\n",
            stderr="",
        )
        with (
            patch.object(server.subprocess, "run", return_value=completed),
            patch.dict(server.os.environ, {"TESSERACT_LANGS": "eng+mal"}),
        ):
            self.assertEqual(server.tesseract_languages("tesseract"), ("eng+mal", None))

    def test_tesseract_retries_sparse_layout_when_default_finds_no_text(self):
        empty = server.subprocess.CompletedProcess(args=[], returncode=0, stdout="", stderr="")
        recognized = server.subprocess.CompletedProcess(args=[], returncode=0, stdout="CALPOL 4 ML", stderr="")
        with (
            patch.object(server, "find_tesseract", return_value=("tesseract", None)),
            patch.object(server, "tesseract_languages", return_value=("eng", None)),
            patch.object(server, "prepare_ocr_image", return_value=(b"same-image", None)),
            patch.object(server.subprocess, "run", side_effect=[empty, recognized]) as run,
        ):
            text, warning = server.tesseract_image_bytes(b"same-image", server.Path("record.jpg"))
        self.assertEqual(text, "CALPOL 4 ML")
        self.assertIn("sparse-text layout", warning)
        self.assertEqual(run.call_args_list[1].args[0][-2:], ["--psm", "11"])

    def test_prepare_ocr_image_upscales_and_enhances_small_images(self):
        from PIL import Image
        import io

        source = io.BytesIO()
        Image.new("RGB", (200, 100), "white").save(source, format="PNG")
        prepared, warning = server.prepare_ocr_image(source.getvalue())
        with Image.open(io.BytesIO(prepared)) as result:
            self.assertGreater(result.width, 200)
            self.assertGreater(result.height, 100)
        self.assertIsNone(warning)

    def test_fallback_extracts_labeled_month_date_and_table_prescription_fields(self):
        extracted = server.fallback_extract(
            "Date: 30-Aug-2023\n"
            "Diagnosis:\n"
            "* MALARIA\n"
            "Medicine Name Dosage Duration\n"
            "1) TAB. SAMPLEMED 1 Morning 8 Days\n"
            "2) TAB. SECOND 1 Morning, 1 Night 4 Days\n"
            "SAMPLEMED 10 MG + OTHER INGREDIENT 5 MG\n"
            "Advice:\n"
            "* TAKE BED REST\n"
        )
        self.assertEqual(extracted["record_date"], "2023-08-30")
        self.assertEqual(extracted["diagnoses"], ["MALARIA"])
        self.assertEqual(len(extracted["medications"]), 2)
        self.assertEqual(extracted["medications"][0], {
            "name": "SAMPLEMED",
            "dosage": "1 Morning",
            "instructions": "8 Days",
        })
        self.assertEqual(extracted["medications"][1], {
            "name": "SECOND",
            "dosage": "1 Morning, 1 Night",
            "instructions": "4 Days",
        })

    def test_configured_missing_tesseract_reports_configuration_error(self):
        with (
            patch.dict(server.os.environ, {"TESSERACT_CMD": "missing-tesseract"}),
            patch.object(server.shutil, "which", return_value=None),
            patch.object(server.Path, "is_file", return_value=False),
        ):
            executable, warning = server.find_tesseract()
        self.assertIsNone(executable)
        self.assertIn("TESSERACT_CMD does not point to an executable", warning)

    def test_ai_safety_prompt_forbids_diagnosis_and_treatment_changes(self):
        self.assertIn("must not diagnose", server.AI_SYSTEM_PROMPT)
        self.assertIn("Do not invent", server.AI_SYSTEM_PROMPT)
        self.assertIn("must not be used to change treatment", server.AI_SYSTEM_PROMPT)
        for field in ("summary_mr", "summary_ta", "summary_te"):
            self.assertIn(field, server.AI_SYSTEM_PROMPT)


if __name__ == "__main__":
    unittest.main()
