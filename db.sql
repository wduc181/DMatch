-- ============================================================
-- DMatch database migrations summary
-- Each service owns its own database in the microservices setup.
-- This file aggregates SQL migrations for reference only.
-- ============================================================

-- ============================================================
-- Service: auth-service
-- Source: auth-service/src/main/resources/db/migration/V1__create_auth_credentials_table.sql
-- ============================================================
CREATE TABLE auth_credentials (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Service: company-service
-- Source: company-service/src/main/resources/db/migration/V1__init_database.sql
-- ============================================================
CREATE TABLE companies (
                           id BIGSERIAL PRIMARY KEY,
                           name VARCHAR(255) NOT NULL,
                           description TEXT,
                           address VARCHAR(255),
                           logo_url VARCHAR(255),
                           website VARCHAR(255),
                           employee_size INTEGER,

                           owner_id BIGINT NOT NULL UNIQUE,

                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_name ON companies(name);

-- ============================================================
-- Service: company-service
-- Source: company-service/src/main/resources/db/migration/V2__rename_logo_url_to_logo_key.sql
-- ============================================================
ALTER TABLE companies RENAME COLUMN logo_url TO logo_key;

-- ============================================================
-- Service: company-service
-- Source: company-service/src/main/resources/db/migration/V3__add_industry_and_cover_key.sql
-- ============================================================
-- Thêm field industry và cover_key cho Company entity (hỗ trợ Company Listing Page)
ALTER TABLE companies ADD COLUMN industry VARCHAR(255);
ALTER TABLE companies ADD COLUMN cover_key VARCHAR(255);

-- ============================================================
-- Service: job-service
-- Source: job-service/src/main/resources/db/migration/V1__init_database.sql
-- ============================================================
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

-- ============================================================
-- Service: job-service
-- Source: job-service/src/main/resources/db/migration/V2__.sql
-- ============================================================
INSERT INTO job_levels (code, name) VALUES
	('INTERN', 'Internship'),
	('FRESHER', 'Fresher'),
	('JUNIOR', 'Junior'),
	('MID', 'Mid-level'),
	('SENIOR', 'Senior'),
	('LEAD', 'Lead'),
	('MANAGER', 'Manager'),
	('DIRECTOR', 'Director');

INSERT INTO job_categories (code, name) VALUES
	('IT_SOFTWARE', 'IT - Software Development'),
	('IT_QA', 'IT - QA/Testing'),
	('IT_DEVOPS', 'IT - DevOps/Infrastructure'),
	('IT_DATA', 'IT - Data/AI'),
	('PRODUCT', 'Product Management'),
	('PROJECT_PM', 'Project Management'),
	('DESIGN_UI_UX', 'Design - UI/UX'),
	('SALES', 'Sales'),
	('MARKETING', 'Marketing'),
	('HR', 'Human Resources'),
	('FINANCE', 'Finance/Accounting'),
	('CUSTOMER_SERVICE', 'Customer Service'),
	('OPERATIONS', 'Operations'),
	('LEGAL', 'Legal/Compliance'),
	('EDUCATION', 'Education/Training'),
	('HEALTHCARE', 'Healthcare'),
	('LOGISTICS', 'Logistics/Supply Chain'),
	('MANUFACTURING', 'Manufacturing/Production'),
	('HOSPITALITY', 'Hospitality/Tourism'),
	('RETAIL', 'Retail');

-- ============================================================
-- Service: review-service
-- Source: review-service/src/main/resources/db/migration/V1__init_database.sql
-- ============================================================
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

-- ============================================================
-- Service: user-service
-- Source: user-service/src/main/resources/db/migration/V1__create_user_table.sql
-- ============================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,

    PRIMARY KEY (user_id, role_id),

    CONSTRAINT fk_user_roles_user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_user_roles_role
        FOREIGN KEY (role_id)
        REFERENCES roles (id)
        ON DELETE CASCADE
);

-- ============================================================
-- Service: user-service
-- Source: user-service/src/main/resources/db/migration/V2__insert_default_roles.sql
-- ============================================================
INSERT INTO roles (name, description) VALUES
                                          ('USER', 'Normal user'),
                                          ('COMPANY', 'Company account'),
                                          ('ADMIN', 'System administrator');

-- ============================================================
-- Service: user-service
-- Source: user-service/src/main/resources/db/migration/V3__add_candidate_profile.sql
-- ============================================================
CREATE TABLE candidate_profiles (
     id BIGSERIAL PRIMARY KEY,
     user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
     phone_number VARCHAR(20),
     date_of_birth DATE,
     gender VARCHAR(10),
     address VARCHAR(500),
     bio TEXT,
     skills TEXT,
     experience TEXT,
     education TEXT,
     github_url VARCHAR(500),
     linkedin_url VARCHAR(500),
     portfolio_url VARCHAR(500),
     cv_file_url VARCHAR(500),
     created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Service: user-service
-- Source: user-service/src/main/resources/db/migration/V4__drop_password_from_users.sql
-- ============================================================
ALTER TABLE users
    DROP COLUMN IF EXISTS password;
