CREATE TABLE candidate_profile_skills (
    id BIGSERIAL PRIMARY KEY,
    candidate_profile_id BIGINT NOT NULL,
    skill_name VARCHAR(255) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_candidate_profile_skills_profile
        FOREIGN KEY (candidate_profile_id)
        REFERENCES candidate_profiles (id)
        ON DELETE CASCADE,

    CONSTRAINT uq_candidate_profile_skills_name
        UNIQUE (candidate_profile_id, skill_name)
);

CREATE TABLE candidate_profile_experiences (
    id BIGSERIAL PRIMARY KEY,
    candidate_profile_id BIGINT NOT NULL,
    experience_data TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_candidate_profile_experiences_profile
        FOREIGN KEY (candidate_profile_id)
        REFERENCES candidate_profiles (id)
        ON DELETE CASCADE
);

CREATE TABLE candidate_profile_educations (
    id BIGSERIAL PRIMARY KEY,
    candidate_profile_id BIGINT NOT NULL,
    education_data TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT fk_candidate_profile_educations_profile
        FOREIGN KEY (candidate_profile_id)
        REFERENCES candidate_profiles (id)
        ON DELETE CASCADE
);

CREATE INDEX idx_candidate_profile_skills_profile_id
    ON candidate_profile_skills(candidate_profile_id);

CREATE INDEX idx_candidate_profile_experiences_profile_id
    ON candidate_profile_experiences(candidate_profile_id);

CREATE INDEX idx_candidate_profile_educations_profile_id
    ON candidate_profile_educations(candidate_profile_id);
