ALTER TABLE companies
    ADD CONSTRAINT ck_companies_employee_size_positive
    CHECK (employee_size IS NULL OR employee_size > 0);

CREATE OR REPLACE FUNCTION company_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION company_set_updated_at();
