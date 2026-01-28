CREATE TABLE job_levels (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE job_categories (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL
);

CREATE TABLE jobs (
	id BIGSERIAL PRIMARY KEY,
	title VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	requirements TEXT,
	location VARCHAR(255),
	job_type VARCHAR(50) NOT NULL,
	status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',

	salary_min BIGINT,
	salary_max BIGINT,
	currency VARCHAR(10) DEFAULT 'VND',

	company_id BIGINT NOT NULL,
	job_level_id BIGINT,

	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_category_jobs (
	job_id BIGINT NOT NULL,
	category_id BIGINT NOT NULL,

	PRIMARY KEY (job_id, category_id),

	CONSTRAINT fk_job_category_jobs_job
		FOREIGN KEY (job_id)
		REFERENCES jobs (id)
		ON DELETE CASCADE,

	CONSTRAINT fk_job_category_jobs_category
		FOREIGN KEY (category_id)
		REFERENCES job_categories (id)
		ON DELETE CASCADE
);

CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_title ON jobs(title);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_job_level_id ON jobs(job_level_id);
CREATE INDEX idx_job_category_jobs_category_id ON job_category_jobs(category_id);

ALTER TABLE jobs
	ADD CONSTRAINT fk_jobs_job_level
		FOREIGN KEY (job_level_id)
		REFERENCES job_levels (id);
