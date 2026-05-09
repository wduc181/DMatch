# DMatch – Job Recruitment Platform

**DMatch** is a learning project for building a job recruitment platform using a microservice-oriented architecture. The project focuses on backend service separation, centralized configuration, API gateway routing, asynchronous communication, and containerized local development.

The system can be started locally with Docker Compose:

```bash
docker compose up
```

---

## Overview

DMatch is designed around multiple independent services. Each service owns its own responsibility and communicates with other services through API calls or asynchronous events.

Main services:

- **API Gateway** – single entry point for client requests
- **Discovery Service** – service registration and discovery with Eureka
- **Config Server** – centralized configuration for backend services
- **Auth Service** – authentication and JWT-based authorization
- **User Service** – user profile and account-related APIs
- **Company Service** – company profile and company-related APIs
- **Job Service** – job posting and job-related APIs
- **Review Service** – company/job review features
- **File Storage Service** – file upload and storage integration

---

## Tech Stack

### Backend

- Java 17
- Spring Boot 3.2.x
- Spring Cloud 2023.x
- Spring Security
- Spring Data JPA
- Spring Cloud Gateway
- Spring Cloud Config
- Netflix Eureka
- OpenFeign
- Resilience4j
- Flyway

### Database & Messaging

- PostgreSQL
- Apache Kafka

### Storage

- AWS S3 integration through `file-storage-service`

### DevOps / Runtime

- Docker
- Docker Compose

---

## Architecture

```text
Client
  ↓
API Gateway
  ↓
Backend Services
  ├── Auth Service
  ├── User Service
  ├── Company Service
  ├── Job Service
  ├── Review Service
  └── File Storage Service

Supporting Infrastructure
  ├── Discovery Service
  ├── Config Server
  ├── PostgreSQL
  └── Kafka
```

Key architectural principles:

- Each backend service is a separate bounded context.
- Each service owns its own database schema/database.
- Services do not perform cross-service database joins.
- Inter-service communication is handled through OpenFeign or Kafka.
- API responses follow a consistent wrapper format.
- Configuration is managed centrally through Config Server.

---

## API Gateway

The API Gateway runs on port `8081` and routes client requests to the corresponding backend services.

Common route groups:

| Route | Target Service |
|---|---|
| `/api/v1/auth/**` | Auth Service |
| `/api/v1/users/**` | User Service |
| `/api/v1/admin/users/**` | User Service |
| `/api/v1/companies/**` | Company Service |
| `/api/v1/jobs/**` | Job Service |
| `/api/v1/reviews/**` | Review Service |
| `/api/v1/files/**` | File Storage Service |
| `/internal/**` | Internal service-to-service APIs |

---

## Running Locally

### Prerequisites

Make sure the following tools are installed:

```bash
docker --version
docker compose version
```

### Environment Variables

Create a `.env` file in the project root:

```env
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret
INTERNAL_SERVICE_KEY=your_internal_service_key
```

Do not commit real secrets to the repository.

### Start the System

```bash
docker compose up
```

To run in detached mode:

```bash
docker compose up -d
```

To view logs of a specific service:

```bash
docker compose logs -f <service-name>
```

---

## Service Ports

| Service | Port |
|---|---:|
| discovery-service | 8111 |
| config-server | 8888 |
| api-gateway | 8081 |
| user-service | 8082 |
| auth-service | 8083 |
| company-service | 8084 |
| job-service | 8085 |
| review-service | 8086 |
| file-storage-service | 8087 |
| kafka | 9094 |

Useful URLs:

```text
API Gateway:       http://localhost:8081
Eureka Dashboard:  http://localhost:8111
Config Server:     http://localhost:8888
Kafka:             localhost:9094
```

Swagger UI is available per service when the system is running:

```text
http://localhost:{service-port}/swagger-ui/index.html
```

---

## Backend Conventions

### Response Format

All API responses are wrapped in a common response structure:

```json
{
  "message": "Short response message",
  "data": {}
}
```

When an error occurs or no data is available, `data` may be `null`.

### DTO Usage

Controllers should receive and return DTOs only. JPA entities should not be exposed directly through API responses.

Example naming convention:

```text
UserCreateRequest
UserResponse
JobUpdateRequest
CompanyResponse
```

### Exception Handling

Each service should handle errors through a global exception handler using `@ControllerAdvice`. Custom runtime exceptions are used for application-specific errors such as invalid input, missing data, or permission issues.

### Inter-service Communication

Synchronous service-to-service calls should use OpenFeign.

Asynchronous communication should use Kafka for event-driven workflows such as file deletion or job/review-related events.

---

## Security

- Authentication is handled by the Auth Service.
- JWT is used for stateless authorization.
- Protected endpoints require valid access tokens.
- Role-based access control is applied through Spring Security.
- Internal endpoints are separated under `/internal/**`.

Common roles:

```text
ROLE_USER
ROLE_COMPANY
ROLE_ADMIN
```

---

## Current Project Status

The project currently includes the core backend microservices, API Gateway, Eureka Discovery Service, Config Server, PostgreSQL databases, Kafka-based asynchronous communication, file storage integration, Swagger documentation, and Docker Compose support.

The current focus is to keep the application stable as a microservice-based learning project while gradually improving deployment and operations practices.

---

## DevOps Direction

The project is currently runnable with Docker Compose. Future infrastructure improvements may include:

- Kubernetes deployment manifests
- Kubernetes-native service discovery for production-like environments
- ConfigMap and Secret management
- Ingress-based API Gateway exposure
- Helm charts
- CI/CD pipeline with GitHub Actions
- Monitoring with Prometheus and Grafana
- Centralized logging
- Infrastructure as Code with Terraform

For local development, Docker Compose remains the recommended way to run the full system.

---

## Notes

- This is a learning project, not a production system.
- The architecture prioritizes clarity and separation of responsibilities.
- Each service should remain independently maintainable.
- Avoid hardcoding secrets, database passwords, or cloud credentials.
- Avoid direct database access across service boundaries.

---

**Author:** Võ Viết Đức  
**Project:** DMatch
