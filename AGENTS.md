# AGENTS.md – DMatch Job Recruitment Platform

> File này dành riêng cho AI coding agents (Codex, Claude Code, Copilot, Cursor, v.v.).
> Đọc kỹ trước khi thực hiện bất kỳ task nào.

---

## Project Overview

**DMatch** là một nền tảng tuyển dụng việc làm (learning project) xây dựng theo kiến trúc **Microservices**.

| Layer | Stack |
|---|---|
| Backend | Java 17, Spring Boot 3.2.12, Spring Cloud 2023.0.4 |
| Frontend | ReactJS (Vite), Tailwind CSS |
| Database | PostgreSQL (mỗi service 1 DB riêng), Flyway migration |
| Messaging | Apache Kafka |
| Config | Spring Cloud Config Server (native, port 8888) |
| Discovery | Eureka Server (port 8111) |
| Gateway | Spring Cloud Gateway (port 8081) |
| Auth | JWT (jjwt 0.12.6) |
| Storage | AWS S3 (via file-storage-service) |

**Nguyên tắc cốt lõi:** Clarity over complexity. Không join database chéo giữa các service.

---

## Key Commands

```bash
# Chạy toàn bộ hệ thống (khuyến nghị)
docker compose up

# Xem log một service cụ thể
docker compose logs -f <service-name>

# Eureka Dashboard (xem port khi chạy thủ công)
open http://localhost:8111

# API Gateway entry point
open http://localhost:8081

# Swagger UI của từng service
open http://localhost:{port}/swagger-ui/index.html
```

> Khi chạy thủ công (không dùng Docker), service dùng `server.port=0` (random port). Kiểm tra trên Eureka.

---

## Service Ports (Docker Compose)

| Service | Port |
|---|---|
| discovery-service | 8111 |
| config-server | 8888 |
| api-gateway | 8081 |
| user-service | 8082 |
| auth-service | 8083 |
| company-service | 8084 |
| job-service | 8085 |
| review-service | 8086 |
| file-storage-service | 8087 |
| kafka | 9094 (host), 9092 (docker network) |

---

## Project Structure

### Backend (mỗi service)

```text
<service-name>/
├── src/main/java/com/dmatch/<service>/
│   ├── configurations/      # SecurityConfig (@EnableMethodSecurity), Feign, etc.
│   ├── controllers/         # REST controllers (chỉ nhận/trả DTO)
│   ├── services/            # Business logic, @Transactional cho write ops
│   |   ├──interfaces/
|   |   └──implementaions/
│   ├── repositories/        # Spring Data JPA interfaces
│   ├── entities/            # JPA @Entity (KHÔNG expose ra API)
│   ├── dtos/
│   │   ├── request/         # VD: UserCreateRequest, JobUpdateRequest
│   │   └── response/        # VD: UserResponse, JobResponse
│   ├── exceptions/          # Custom RuntimeException + @ControllerAdvice
│   ├── utils/               # JwtUtils, ownership/admin check helpers
│   └── constants/           # RoleConstants (copy vào mỗi service)
└── src/main/resources/
    └── db/migration/        # Flyway scripts (V1__init.sql, ...)

# Không có application.yml config DB/port ở đây — lấy từ Config Server
```

> **Config DB và port** đặt tại Config Server (`classpath:/config/<service-name>.yml`), KHÔNG hardcode trong từng service.

### Frontend

```text
src/
├── pages/                   # Views ánh xạ với route (HomePage.jsx, LoginPage.jsx)
├── routes/                  # AppRouter.jsx hoặc routes.jsx
├── components/
│   ├── ui/                  # Button, Input, Card (shadcn/ui patterns + Tailwind)
│   └── layout/              # Header, Sidebar, Footer
├── features/                # Logic theo tính năng (features/auth, features/jobs)
├── hooks/                   # Custom React hooks
└── services/                # axiosClient.js + *.service.js (auth, job, company...)
```

---

## Non-Obvious Patterns (Quan trọng – Đọc kỹ)

### Backend

**1. Constructor Injection bắt buộc — KHÔNG dùng `@Autowired` field**

```java
// ✅ ĐÚNG
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
}

// ❌ SAI
@Autowired
private UserRepository userRepository;
```

**2. DTO naming convention**

- Format: `{ServiceName}{Action}{Request|Response}`
- Ví dụ: `UserCreateRequest`, `JobUpdateRequest`, `CompanyResponse`
- Tuyệt đối không trả về `@Entity` trực tiếp trong API response.

**3. ApiResponse wrapper – BẮT BUỘC cho mọi response**

```json
{
  "message": "Mô tả ngắn gọn",
  "data": { ... }
}
```

`data` là `null` khi lỗi hoặc không có dữ liệu.

**4. JSON Property dùng snake_case**

Config Jackson hoặc `@JsonProperty("user_name")` trong DTO.
Ví dụ: `user_name`, `job_id`, `company_name`.

**5. Exception Handling – Global via @ControllerAdvice**

- Đặt trong package `exceptions/`
- Dùng custom RuntimeException: `DataNotFoundException`, `InvalidParamException`, `InvalidBodyException`, `PermissionDeniedException`, v.v.
- Tất cả lỗi bọc trong `ApiResponse` trước khi trả về.

**6. Giao tiếp inter-service – CHỈ dùng OpenFeign**

- KHÔNG query trực tiếp database của service khác
- KHÔNG dùng RestTemplate
- Internal endpoints: `/internal/...` (không đi qua Gateway auth filter)

**7. Phân quyền**

- Role constants: `ROLE_USER`, `ROLE_COMPANY`, `ROLE_ADMIN` (luôn viết hoa, prefix `ROLE_`)
- Tất cả endpoint non-public dùng `@PreAuthorize`
- `@EnableMethodSecurity(prePostEnabled = true)` trong mọi SecurityConfig
- Logic ownership check đặt trong `utils/JwtUtils` hoặc utils tương đương

**8. Kafka topics (hiện tại)**

- Async file deletion: `company-service` → Kafka → `file-storage-service`
- Job/review creation events

### Frontend

**1. Navigation – KHÔNG dùng thẻ `<a>`**

```jsx
// ✅ ĐÚNG
<Link to="/jobs">Xem việc làm</Link>
const navigate = useNavigate();
navigate('/dashboard');

// ❌ SAI (reload toàn trang)
<a href="/jobs">Xem việc làm</a>
```

**2. Protected Routes**

`ProtectedRoute` component bọc các route cần login. Kiểm tra token + role (`USER`/`COMPANY`/`ADMIN`). Redirect về Login hoặc 403 nếu không thỏa.

**3. Data fetching – React Query, KHÔNG dùng useEffect**

```jsx
// ✅ ĐÚNG
const { data, isLoading } = useQuery(['jobs'], jobService.getAll);
```

**4. Tailwind class management**

- Dùng `clsx` hoặc `tailwind-merge` khi class dài hoặc có điều kiện
- Màu sắc theo nguyên tắc 60-30-10: trắng (nền) – đen (text) – tím (accent)
- Dùng semantic color variables, KHÔNG hardcode hex

**5. Axios interceptor**

`axiosClient.js` tự động đính kèm JWT token vào header mọi request.

---

## API Conventions

- Resource URI: danh từ số nhiều, `/api/v1/jobs`, `/api/v1/users`
- HTTP Methods: GET (read), POST/PUT/DELETE (write, yêu cầu role cụ thể)
- Status codes: 200, 201, 400, 401, 403, 404, 500

---

## Boundaries

### ✅ Tự làm được

- Đọc và phân tích code, cấu trúc thư mục
- Chạy `docker compose up` để khởi động hệ thống
- Viết code theo pattern Controller → Service → Repository
- Tạo DTO, Entity, Repository, Service, Controller mới
- Viết Flyway migration scripts

### ⚠️ Hỏi trước khi làm

- Thêm dependency mới vào `pom.xml`
- Tạo Kafka topic mới hoặc thay đổi topic schema
- Thay đổi cấu hình Config Server ảnh hưởng nhiều service
- Refactor inter-service contract (Feign client interface)
- Migration script xóa/đổi tên cột (destructive migration)

### 🚫 Không bao giờ

- Hardcode credentials, JWT secret, DB password vào code hay `.yml`
- Commit file `.env` lên repository
- Query trực tiếp database của service khác (vi phạm Microservices boundary)
- Dùng `@Autowired` field injection
- Trả về `@Entity` trực tiếp trong API response
- Dùng `<a href>` để điều hướng trong React
- Force push lên `main`/`master`
- Sửa Flyway script đã chạy (tạo script mới thay thế)

---

## Current Status (v3 – Event-driven)

Đã hoàn thành: Eureka, Config Server, API Gateway, Auth Service (JWT), User/Company/Job/Review Service, File Storage Service, Kafka, Swagger.

## Roadmap đề xuất theo hướng DevOps

### Version 4 – Production-grade Docker

- Dockerfile riêng cho từng service
- Multi-stage build
- Non-root container
- `.dockerignore`
- Docker Compose profiles: `infra`, `app`, `full`
- Image tagging theo version/commit SHA

### Version 5 – CI/CD

- GitHub Actions hoặc Jenkins
- Maven test/build cho từng service
- Build Docker images
- Push image lên Docker Hub/GHCR/ECR
- Thêm security scan cơ bản: Trivy, dependency scan, secret scan

### Version 6 – Kubernetes Migration

- Tạo Kubernetes Deployment/Service cho từng microservice
- Dùng ConfigMap/Secret thay `.env` trong môi trường Kubernetes
- Thêm readiness/liveness probes
- Thêm resource requests/limits
- Chỉ expose `api-gateway` qua Ingress
- Bỏ Eureka trong Kubernetes profile, dùng Kubernetes Service DNS

### Version 7 – Helm

- Đóng gói Kubernetes manifests thành Helm chart
- Tách `values-dev.yaml`, `values-prod.yaml`
- Cho phép deploy toàn hệ thống bằng một lệnh Helm

### Version 8 – Observability

- Spring Boot Actuator
- Prometheus + Grafana dashboards
- Loki/Promtail hoặc ELK/OpenSearch cho centralized logging
- OpenTelemetry + Tempo/Zipkin cho distributed tracing

### Version 9 – Infrastructure as Code

- Terraform cho AWS EKS/ECR/RDS/S3/VPC/IAM hoặc local kind/minikube demo
- Document rõ cách `plan`, `apply`, `destroy`
- Không commit state file nhạy cảm

### Version 10 – GitOps

- Argo CD quản lý deployment từ Git
- CI build/push image, CD sync image tag qua Helm values
- Môi trường dev/staging tách biệt

### Version 11 – Search & Recommendation

- Elasticsearch/OpenSearch: index job data, search by keyword/skill, sync via Kafka
- Python ML service: TF-IDF, cosine similarity, job ↔ user matching

---
