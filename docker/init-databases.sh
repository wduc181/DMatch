#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE user_service_db;
    CREATE DATABASE company_service_db;
    CREATE DATABASE job_service_db;
    CREATE DATABASE review_service_db;
EOSQL
