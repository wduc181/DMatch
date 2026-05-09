package com.dmatch.jobservice.service.implementations;

import com.dmatch.jobservice.dtos.*;
import com.dmatch.jobservice.entities.Job;
import com.dmatch.jobservice.entities.JobCategory;
import com.dmatch.jobservice.entities.JobLevel;
import com.dmatch.jobservice.exceptions.DataNotFoundException;
import com.dmatch.jobservice.exceptions.InvalidBodyException;
import com.dmatch.jobservice.exceptions.InvalidParamException;
import com.dmatch.jobservice.exceptions.PermissionDeniedException;
import com.dmatch.jobservice.clients.UserClient;
import com.dmatch.jobservice.clients.CompanyClient;
import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.commons.CurrencyCode;
import com.dmatch.jobservice.commons.JobStatus;
import com.dmatch.jobservice.commons.JobType;
import com.dmatch.jobservice.repositories.JobCategoryRepository;
import com.dmatch.jobservice.repositories.JobLevelRepository;
import com.dmatch.jobservice.repositories.JobRepository;
import com.dmatch.jobservice.repositories.JobSpecification;
import com.dmatch.jobservice.service.interfaces.JobService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobServiceImpl implements JobService {
    private final JobRepository jobRepository;
    private final JobLevelRepository jobLevelRepository;
    private final JobCategoryRepository jobCategoryRepository;
    private final CompanyClient companyClient;
    private final UserClient userClient;
    private final JobEventPublisher jobEventPublisher;

    @Override
    @Transactional
    public JobResponse createJob(JobCreateRequest request, Long companyId) {
        if (companyId == null) {
            throw new InvalidParamException("company_id is required");
        }

        validateCompanyOwnership(companyId);
        String jobType = normalizeJobType(request.getJobType());
        String currency = normalizeCurrency(request.getCurrency());
        validateSalaryRange(request.getSalaryMin(), request.getSalaryMax());

        if (jobRepository.existsByCompanyIdAndTitleIgnoreCase(companyId, request.getTitle())) {
            throw new InvalidBodyException("Job title already exists for this company");
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .location(request.getLocation())
                .jobType(jobType)
                .status(JobStatus.DRAFT.name())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .currency(currency)
                .companyId(companyId)
                .build();

        if (request.getJobLevelId() != null) {
            JobLevel jobLevel = jobLevelRepository.findById(request.getJobLevelId())
                    .orElseThrow(() -> new DataNotFoundException("Job level not found"));
            job.setJobLevel(jobLevel);
        }

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            List<JobCategory> categories = jobCategoryRepository.findByIdIn(request.getCategoryIds());
            if (categories.size() != request.getCategoryIds().size()) {
                throw new InvalidBodyException("One or more categories not found");
            }
            job.setCategories(new HashSet<>(categories));
        }

        Job saved = jobRepository.save(job);

        try {
            jobEventPublisher.publishJobCreated(saved.getId(), companyId, saved.getTitle());
        } catch (Exception e) {
            log.warn("Failed to publish job-created event for jobId={}: {}", saved.getId(), e.getMessage());
        }

        return JobResponse.fromJob(saved);
    }

    @Override
    @Transactional
    public JobResponse updateJob(Long jobId, JobUpdateRequest request, Long companyId) {
        if (companyId == null) {
            throw new InvalidParamException("company_id is required");
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new DataNotFoundException("Job not found with id: " + jobId));

        validateJobOwnership(job, companyId);

        Long nextSalaryMin = request.getSalaryMin() != null ? request.getSalaryMin() : job.getSalaryMin();
        Long nextSalaryMax = request.getSalaryMax() != null ? request.getSalaryMax() : job.getSalaryMax();
        validateSalaryRange(nextSalaryMin, nextSalaryMax);

        if (request.getTitle() != null) {
            job.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            job.setDescription(request.getDescription());
        }
        if (request.getRequirements() != null) {
            job.setRequirements(request.getRequirements());
        }
        if (request.getLocation() != null) {
            job.setLocation(request.getLocation());
        }
        if (request.getJobType() != null) {
            job.setJobType(normalizeJobType(request.getJobType()));
        }
        if (request.getSalaryMin() != null) {
            job.setSalaryMin(request.getSalaryMin());
        }
        if (request.getSalaryMax() != null) {
            job.setSalaryMax(request.getSalaryMax());
        }
        if (request.getCurrency() != null) {
            job.setCurrency(normalizeCurrency(request.getCurrency()));
        }

        if (request.getJobLevelId() != null) {
            JobLevel jobLevel = jobLevelRepository.findById(request.getJobLevelId())
                    .orElseThrow(() -> new DataNotFoundException("Job level not found"));
            job.setJobLevel(jobLevel);
        }

        if (request.getCategoryIds() != null) {
            if (request.getCategoryIds().isEmpty()) {
                job.setCategories(new HashSet<>());
            } else {
                List<JobCategory> categories = jobCategoryRepository.findByIdIn(request.getCategoryIds());
                if (categories.size() != request.getCategoryIds().size()) {
                    throw new InvalidBodyException("One or more categories not found");
                }
                job.setCategories(new HashSet<>(categories));
            }
        }

        Job saved = jobRepository.save(job);
        return JobResponse.fromJob(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Job not found with id: " + id));

        // Enrich with company info
        CompanyResponse company = fetchCompanyQuietly(job.getCompanyId());
        if (company != null) {
            return JobResponse.fromJob(job, company.getName(), company.getLogoUrl());
        }
        return JobResponse.fromJob(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> getJobs(JobSearchRequest request, int page, int limit) {
        int pageNo = page < 1 ? 0 : page - 1;
        Sort sort = buildSort(request != null ? request.getSort() : null);
        Pageable pageable = PageRequest.of(pageNo, limit, sort);

        // Build specification từ request
        Specification<Job> spec = (request != null)
                ? JobSpecification.fromSearchRequest(request)
                : Specification.where(null);

        Page<Job> jobPage = jobRepository.findAll(spec, pageable);

        // Batch fetch company info cho tất cả jobs trên page này
        Map<Long, CompanyResponse> companyMap = batchFetchCompanies(jobPage.getContent());

        return jobPage.map(job -> {
            CompanyResponse company = companyMap.get(job.getCompanyId());
            if (company != null) {
                return JobResponse.fromJob(job, company.getName(), company.getLogoUrl());
            }
            return JobResponse.fromJob(job);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> getJobsByCompany(Long companyId, int page, int limit) {
        int pageNo = page < 1 ? 0 : page - 1;
        Pageable pageable = PageRequest.of(pageNo, limit, Sort.by("createdAt").descending());
        return jobRepository.findByCompanyId(companyId, pageable)
                .map(JobResponse::fromJob);
    }

    @Override
    @Transactional
    public JobResponse changeJobStatus(Long jobId, String status, Long companyId) {
        if (status == null || status.isBlank()) {
            throw new InvalidParamException("status is required");
        }
        if (companyId == null) {
            throw new InvalidParamException("company_id is required");
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new DataNotFoundException("Job not found with id: " + jobId));
        validateJobOwnership(job, companyId);
        job.setStatus(normalizeJobStatus(status));
        Job saved = jobRepository.save(job);
        return JobResponse.fromJob(saved);
    }

    @Override
    @Transactional
    public JobResponse setJobLevel(Long jobId, Long jobLevelId, Long companyId) {
        if (companyId == null) {
            throw new InvalidParamException("company_id is required");
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new DataNotFoundException("Job not found with id: " + jobId));
        validateJobOwnership(job, companyId);
        JobLevel jobLevel = jobLevelRepository.findById(jobLevelId)
                .orElseThrow(() -> new DataNotFoundException("Job level not found"));
        job.setJobLevel(jobLevel);
        Job saved = jobRepository.save(job);
        return JobResponse.fromJob(saved);
    }

    @Override
    @Transactional
    public JobResponse setJobCategories(Long jobId, List<Long> categoryIds, Long companyId) {
        if (companyId == null) {
            throw new InvalidParamException("company_id is required");
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new DataNotFoundException("Job not found with id: " + jobId));
        validateJobOwnership(job, companyId);

        if (categoryIds == null || categoryIds.isEmpty()) {
            job.setCategories(Set.of());
            Job saved = jobRepository.save(job);
            return JobResponse.fromJob(saved);
        }

        List<JobCategory> categories = jobCategoryRepository.findByIdIn(categoryIds);
        if (categories.size() != categoryIds.size()) {
            throw new InvalidBodyException("One or more categories not found");
        }
        job.setCategories(new HashSet<>(categories));
        Job saved = jobRepository.save(job);
        return JobResponse.fromJob(saved);
    }

    @Override
    @Transactional
    public void deleteJob(Long jobId, Long companyId) {
        if (companyId == null) {
            throw new InvalidParamException("company_id is required");
        }
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new DataNotFoundException("Job not found with id: " + jobId));
        validateJobOwnership(job, companyId);
        jobRepository.delete(job);
    }

    // ===================== Helper methods =====================

    /**
     * Build Sort object từ sort param string.
     * - "salary_desc" → salaryMax DESC
     * - "salary_asc" → salaryMin ASC
     * - default (null, "newest") → createdAt DESC
     */
    private Sort buildSort(String sortParam) {
        if (sortParam == null || sortParam.isBlank()) {
            return Sort.by("createdAt").descending();
        }
        return switch (sortParam) {
            case "salary_desc" -> Sort.by("salaryMax").descending();
            case "salary_asc" -> Sort.by("salaryMin").ascending();
            default -> Sort.by("createdAt").descending();
        };
    }

    private String normalizeJobStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new InvalidParamException("status is required");
        }
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        try {
            return JobStatus.valueOf(normalized).name();
        } catch (IllegalArgumentException e) {
            throw new InvalidParamException("Unsupported job status: " + status);
        }
    }

    private String normalizeJobType(String jobType) {
        if (jobType == null || jobType.isBlank()) {
            throw new InvalidParamException("job_type is required");
        }
        String normalized = jobType.trim().toUpperCase(Locale.ROOT);
        try {
            return JobType.valueOf(normalized).name();
        } catch (IllegalArgumentException e) {
            throw new InvalidParamException("Unsupported job_type: " + jobType);
        }
    }

    private String normalizeCurrency(String currency) {
        if (currency == null || currency.isBlank()) {
            // Currency has a product default; job_type intentionally does not.
            return CurrencyCode.VND.name();
        }
        String normalized = currency.trim().toUpperCase(Locale.ROOT);
        try {
            return CurrencyCode.valueOf(normalized).name();
        } catch (IllegalArgumentException e) {
            throw new InvalidParamException("Unsupported currency: " + currency);
        }
    }

    private void validateSalaryRange(Long salaryMin, Long salaryMax) {
        if (salaryMin != null && salaryMin < 0) {
            throw new InvalidParamException("salary_min must be non-negative");
        }
        if (salaryMax != null && salaryMax < 0) {
            throw new InvalidParamException("salary_max must be non-negative");
        }
        if (salaryMin != null && salaryMax != null && salaryMin > salaryMax) {
            throw new InvalidParamException("salary_min must be less than or equal to salary_max");
        }
    }

    /**
     * Batch fetch company info cho danh sách jobs.
     * Collect unique companyIds → 1 lần gọi Feign → map thành id → CompanyResponse.
     */
    private Map<Long, CompanyResponse> batchFetchCompanies(List<Job> jobs) {
        Set<Long> companyIds = jobs.stream()
                .map(Job::getCompanyId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (companyIds.isEmpty()) {
            return Collections.emptyMap();
        }

        try {
            ApiResponse<List<CompanyResponse>> response = companyClient
                    .getCompaniesByIds(new ArrayList<>(companyIds))
                    .getBody();

            if (response != null && response.getData() != null) {
                return response.getData().stream()
                        .collect(Collectors.toMap(CompanyResponse::getId, Function.identity()));
            }
        } catch (Exception e) {
            log.warn("Failed to batch fetch companies: {}", e.getMessage());
        }

        return Collections.emptyMap();
    }

    /**
     * Fetch single company info — dùng cho getJobById().
     * Trả về null nếu company-service unavailable.
     */
    private CompanyResponse fetchCompanyQuietly(Long companyId) {
        if (companyId == null)
            return null;
        try {
            ApiResponse<CompanyResponse> response = companyClient.getCompanyById(companyId).getBody();
            if (response != null) {
                return response.getData();
            }
        } catch (Exception e) {
            log.warn("Failed to fetch company id={}: {}", companyId, e.getMessage());
        }
        return null;
    }

    private void validateJobOwnership(Job job, Long companyId) {
        if (job.getCompanyId() == null || !job.getCompanyId().equals(companyId)) {
            throw new InvalidParamException("company_id does not match job owner");
        }
        validateCompanyOwnership(companyId);
    }

    private void validateCompanyOwnership(Long companyId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new PermissionDeniedException("Unauthenticated");
        }

        CompanyResponse company = getCompanyByIdOrThrow(companyId);

        if (isAdmin(authentication)) {
            return;
        }

        String email = authentication.getName();
        if (email == null || email.isBlank()) {
            throw new PermissionDeniedException("Invalid authentication subject");
        }

        InternalUserResponse user = getUserByEmailOrThrow(email);
        if (company.getOwnerId() == null || user.getId() == null || !company.getOwnerId().equals(user.getId())) {
            throw new PermissionDeniedException("You are not the owner of this company");
        }
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));
    }

    private CompanyResponse getCompanyByIdOrThrow(Long companyId) {
        try {
            ApiResponse<CompanyResponse> companyResponse = companyClient.getCompanyById(companyId).getBody();
            if (companyResponse == null || companyResponse.getData() == null) {
                throw new DataNotFoundException("Company not found with id: " + companyId);
            }
            return companyResponse.getData();
        } catch (FeignException e) {
            throw new DataNotFoundException("Company not found with id: " + companyId);
        }
    }

    private InternalUserResponse getUserByEmailOrThrow(String email) {
        try {
            ApiResponse<InternalUserResponse> userResponse = userClient.getUserByEmail(email).getBody();
            if (userResponse == null || userResponse.getData() == null) {
                throw new DataNotFoundException("User not found with email: " + email);
            }
            return userResponse.getData();
        } catch (FeignException e) {
            throw new DataNotFoundException("User not found with email: " + email);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobLevelResponse> getJobLevels() {
        return jobLevelRepository.findAll()
                .stream()
                .map(JobLevelResponse::fromJobLevel)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobCategoryResponse> getJobCategories() {
        return jobCategoryRepository.findAll()
                .stream()
                .map(JobCategoryResponse::fromJobCategory)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<Long, Integer> countActiveJobsByCompanyIds(List<Long> companyIds) {
        if (companyIds == null || companyIds.isEmpty()) {
            return Collections.emptyMap();
        }

        List<Object[]> results = jobRepository.countByCompanyIdInAndStatus(companyIds, JobStatus.ACTIVE.name());

        return results.stream().collect(Collectors.toMap(
                row -> (Long) row[0],
                row -> ((Long) row[1]).intValue()
        ));
    }
}
