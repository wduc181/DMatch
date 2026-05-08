CREATE UNIQUE INDEX uq_users_email_lower
    ON users (lower(email));

ALTER TABLE users
    ADD CONSTRAINT ck_users_status
    CHECK (status IN ('ACTIVE', 'INACTIVE', 'BANNED', 'PENDING_VERIFICATION'));

ALTER TABLE candidate_profiles
    ADD CONSTRAINT ck_candidate_profiles_gender
    CHECK (gender IS NULL OR gender IN ('MALE', 'FEMALE', 'OTHER'));

CREATE OR REPLACE FUNCTION user_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION user_set_updated_at();

CREATE TRIGGER trg_candidate_profiles_updated_at
    BEFORE UPDATE ON candidate_profiles
    FOR EACH ROW
    EXECUTE FUNCTION user_set_updated_at();
