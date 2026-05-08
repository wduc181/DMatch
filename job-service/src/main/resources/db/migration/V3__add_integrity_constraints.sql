ALTER TABLE jobs
    ADD CONSTRAINT ck_jobs_status
    CHECK (status IN ('DRAFT', 'ACTIVE', 'CLOSED'));

ALTER TABLE jobs
    ADD CONSTRAINT ck_jobs_job_type
    CHECK (job_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE'));

ALTER TABLE jobs
    ADD CONSTRAINT ck_jobs_currency
    CHECK (currency IN ('VND', 'USD'));

ALTER TABLE jobs
    ADD CONSTRAINT ck_jobs_salary_min_non_negative
    CHECK (salary_min IS NULL OR salary_min >= 0);

ALTER TABLE jobs
    ADD CONSTRAINT ck_jobs_salary_max_non_negative
    CHECK (salary_max IS NULL OR salary_max >= 0);

ALTER TABLE jobs
    ADD CONSTRAINT ck_jobs_salary_range
    CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max);

CREATE OR REPLACE FUNCTION job_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION job_set_updated_at();
