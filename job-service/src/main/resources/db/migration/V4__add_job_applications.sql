ALTER TABLE jobs
    ADD COLUMN application_deadline TIMESTAMP NULL,
    ADD COLUMN closed_at TIMESTAMP NULL;

CREATE TABLE job_applications (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    company_id BIGINT NOT NULL,
    company_name VARCHAR(255),
    candidate_user_id BIGINT NOT NULL,
    candidate_name VARCHAR(255),
    candidate_email VARCHAR(255) NOT NULL,
    cv_file_url VARCHAR(500) NOT NULL,
    cover_letter TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_job_applications_job
        FOREIGN KEY (job_id)
        REFERENCES jobs (id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_job_applications_job_candidate
        UNIQUE (job_id, candidate_user_id),

    CONSTRAINT ck_job_applications_status
        CHECK (status IN ('PENDING', 'REVIEWING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'))
);

CREATE INDEX idx_job_applications_candidate_user_id
    ON job_applications(candidate_user_id);

CREATE INDEX idx_job_applications_company_job_status
    ON job_applications(company_id, job_id, status);

CREATE INDEX idx_job_applications_status
    ON job_applications(status);

CREATE INDEX idx_job_applications_applied_at
    ON job_applications(applied_at);

CREATE TRIGGER trg_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION job_set_updated_at();
