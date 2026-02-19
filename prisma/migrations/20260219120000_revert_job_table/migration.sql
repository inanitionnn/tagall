-- Revert Job table and JobStatus enum (undoes 20250816120000_add_job_table and 20250919000000_add_parsing_to_job_status)
DROP TABLE IF EXISTS "Job";
DROP TYPE IF EXISTS "JobStatus";
