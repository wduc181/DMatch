ALTER TABLE reviews
    ADD CONSTRAINT ck_reviews_status
    CHECK (status IN ('ACTIVE', 'CHANGED', 'HIDDEN'));

CREATE OR REPLACE FUNCTION review_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION review_set_updated_at();
