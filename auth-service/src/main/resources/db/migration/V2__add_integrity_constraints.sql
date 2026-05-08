CREATE UNIQUE INDEX uq_auth_credentials_email_lower
    ON auth_credentials (lower(email));

CREATE OR REPLACE FUNCTION auth_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auth_credentials_updated_at
    BEFORE UPDATE ON auth_credentials
    FOR EACH ROW
    EXECUTE FUNCTION auth_set_updated_at();
