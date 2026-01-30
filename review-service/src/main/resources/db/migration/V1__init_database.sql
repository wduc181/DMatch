CREATE TABLE reviews (
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT NOT NULL,
	company_id BIGINT,
	job_id BIGINT,
	rating SMALLINT NOT NULL,
	comment TEXT,
	status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',

	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT ck_reviews_rating
		CHECK (rating BETWEEN 1 AND 5),

	CONSTRAINT ck_reviews_target
		CHECK (
			(company_id IS NOT NULL AND job_id IS NULL)
			OR (company_id IS NULL AND job_id IS NOT NULL)
		)
);

CREATE UNIQUE INDEX uq_reviews_user_company
	ON reviews (user_id, company_id)
	WHERE company_id IS NOT NULL;

CREATE UNIQUE INDEX uq_reviews_user_job
	ON reviews (user_id, job_id)
	WHERE job_id IS NOT NULL;

CREATE INDEX idx_reviews_company_id ON reviews(company_id);
CREATE INDEX idx_reviews_job_id ON reviews(job_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_status ON reviews(status);
