# DMatch – Job Recruitment Platform (Microservice Architecture)

**DMatch** is a **LEARNING PROJECT** for a job recruitment platform designed with a **microservice-first** architecture. The initial scope is intentionally small but domain‑focused, allowing incremental expansion without architectural refactors.
For run project, use command: docker compose up

---

## 1. Architecture Overview

Designed services (including planned modules):
- **API Gateway** (Spring Cloud Gateway)
- **Service Discovery** (Eureka Server)
- **Config Server** (Spring Cloud Config)
- **Auth Service**
- **User Service**
- **Company Service**
- **Job Service** 
- **Review Service** 
- **Search Service** 
- **File Storage Service**

### How to Run the Project

To run the project, follow these steps:

1. **Install Docker and Docker Compose**:
   - Ensure Docker and Docker Compose are installed on your system. You can verify the installation by running:
     ```bash
     docker --version
     docker compose version
     ```

2. **Prepare the `.env` File**:
   - Create a `.env` file in the root directory with the following variables:
     ```env
     JWT_SECRET=your_jwt_secret
     DB_PASSWORD=your_database_password
     ```
     Replace `your_jwt_secret` and `your_database_password` with your actual values.

3. **Start the Services**:
   - Run the following command to start all services:
     ```bash
     docker compose up
     ```

4. **Verify the Services**:
   - Check the logs to ensure all services are running correctly.
   - Access the API Gateway at `http://localhost:8081`.

---

## 2. Tech Stack & Versions

**Language & Runtime**
- Java 17

**Spring Boot**
- Spring Boot 3.2.12

**Spring Cloud**
- Spring Cloud 2023.0.4

**Core Dependencies**
- Spring Web, Spring Data JPA, Spring Validation
- Spring Security + JWT (jjwt 0.12.6)
- Spring Cloud: Config, Eureka, Gateway, OpenFeign, LoadBalancer
- Flyway
- PostgreSQL
- AWS S3

---

## 3. Centralized Configuration (config-server)

Config Server runs on **port 8888** using **native config** at `classpath:/config`.

### Common Settings
- `app.api-prefix`: `/api/v1`
- `app.internal-prefix`: `/internal`

### Eureka
- `defaultZone`: `http://localhost:8111/eureka`

### Auth Service
- PostgreSQL: `jdbc:postgresql://localhost:5432/auth_service_db`
- JWT config:
  - `jwt.secret`: `${JWT_SECRET}`
  - `jwt.expiration`: `3600000`
  - `jwt.refresh-expiration`: `86400000`

### User Service (PostgreSQL)
- `jdbc:postgresql://localhost:5432/user_service_db`
- Flyway enabled

### Company Service (PostgreSQL)
- `jdbc:postgresql://localhost:5432/company_service_db`
- Flyway enabled

---

## 4. API Gateway Routes

Gateway runs on **port 8081**. Current routes:

- `/api/v1/reviews/**`, `/internal/reviews/**` → REVIEW-SERVICE
  - Example: `GET /api/v1/reviews` to fetch all reviews.
- `/api/v1/jobs/**`, `/internal/jobs/**` → JOB-SERVICE
  - Example: `POST /api/v1/jobs` to create a new job.
- `/api/v1/companies/**`, `/internal/companies/**` → COMPANY-SERVICE
  - Example: `GET /api/v1/companies` to fetch all companies.
- `/api/v1/auth/**` → AUTH-SERVICE
  - Example: `POST /api/v1/auth/login` to authenticate a user.
- `/internal/users/**`, `/api/v1/users/**`, `/api/v1/admin/users/**` → USER-SERVICE
  - Example: `GET /api/v1/users` to fetch all users.
- `/api/v1/files/**` → FILE-STORAGE-SERVICE
---

## 5. Service Ports

### Docker Compose (khuyến nghị)

| Service | Host Port | URL |
|---|---|---|
| discovery-service | `8111` | http://localhost:8111 |
| config-server | `8888` | http://localhost:8888 |
| api-gateway | `8081` | http://localhost:8081 |
| user-service | `8082` | http://localhost:8082 |
| auth-service | `8083` | http://localhost:8083 |
| company-service | `8084` | http://localhost:8084 |
| job-service | `8085` | http://localhost:8085 |
| review-service | `8086` | http://localhost:8086 |
| file-storage-service | `8087` | http://localhost:8087 |
| kafka | `9094` | localhost:9094 |

> **Lưu ý:** Nếu chạy thủ công từng service (không dùng Docker Compose), các service sẽ dùng **random port** (cấu hình `server.port=0`). Kiểm tra port thực tế trên Eureka Dashboard: http://localhost:8111

### Swagger UI

Khi hệ thống đang chạy, truy cập Swagger UI của từng service tại:
`http://localhost:{port}/swagger-ui/index.html`

---

## 6. Roadmap

### 🔹 Version 1 – Core Microservices (Foundation) *(CURRENT)*

**Checklist**
- [x] Setup Eureka Server
- [x] Setup Config Server (centralized config)
- [x] Setup API Gateway
- [x] Implement User Service CRUD
- [x] Implement Auth Service with JWT authentication and authorization (auth-service)
- [x] Implement Company Service (CRUD)
- [x] Implement Job Service (CRUD, companyId)
- [x] Implement Review Service (Rating, Comment)
- [x] Add Auth: JWT filter
- [x] Dockerize all services
- [x] Run full system with docker-compose

### 🔹 Version 2 – File storage and Inter-service Communication & Resilience

**Tech Additions**
- Resilience4j
- OpenAPI / Swagger

**Checklist**
- [x] Implement file-storage service 
- [x] Timeout & fallback for API calls
- [x] Swagger for each service

### 🔹 Version 3 – Event-driven (Async Communication)

**Tech Additions**
- Apache Kafka

**Checklist**
- [x] Setup Kafka (Docker)
- [x] Async file deletion event (`company-service` -> Kafka -> `file-storage-service`)
- [x] Produce events on job/review creation
- [x] Consumers for async processing
- [x] No database joins across services

**Kafka bootstrap server (local):** `localhost:9094`

**Kafka bootstrap server (inside docker network):** `kafka:9092`

### 🔹 Version 4 – Search & Indexing

**Tech Additions**
- Elasticsearch
- Apache Tika (optional)

**Checklist**
- [ ] Index job data
- [ ] Search by keyword, skill
- [ ] Sync data via Kafka
- [ ] Basic relevance scoring

### 🔹 Version 5 – Recommendation

**Tech Additions**
- Python (ML service)
- TF‑IDF, Cosine similarity

**Checklist**
- [ ] Extract keywords from CV/user profile
- [ ] Job ↔ user matching
- [ ] REST integration between Java and Python services

---
## Notes

- No cross-service database joins
- Each service is a bounded context
- Architecture prioritizes clarity over complexity

---

**Author:** Võ Viết Đức  
**Project Name:** DMatch

