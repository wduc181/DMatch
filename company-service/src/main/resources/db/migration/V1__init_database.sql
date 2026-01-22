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