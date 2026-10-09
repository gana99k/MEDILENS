CREATE TABLE IF NOT EXISTS fhir_resources (
    id TEXT PRIMARY KEY,
    resource_type TEXT NOT NULL,
    patient_id TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.fhir_resources ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_resources_patient_type
    ON fhir_resources(patient_id, resource_type);

CREATE INDEX IF NOT EXISTS idx_resources_type
    ON fhir_resources(resource_type);

CREATE TABLE IF NOT EXISTS app_metadata (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

ALTER TABLE public.app_metadata ENABLE ROW LEVEL SECURITY;
