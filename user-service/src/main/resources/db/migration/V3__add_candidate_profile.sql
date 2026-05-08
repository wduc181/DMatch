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