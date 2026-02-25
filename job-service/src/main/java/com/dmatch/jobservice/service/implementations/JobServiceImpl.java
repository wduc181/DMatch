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
import com.dmatch.jobservice.repositories.JobCategoryRepository;
import com.dmatch.jobservice.repositories.JobLevelRepository;
import com.dmatch.jobservice.repositories.JobRepository;
import com.dmatch.jobservice.service.interfaces.JobService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

        if (jobRepository.existsByCompanyIdAndTitleIgnoreCase(companyId, request.getTitle())) {
            throw new InvalidBodyException("Job title already exists for this company");
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .requirements(request.getRequirements())
                .location(request.getLocation())
                .jobType(request.getJobType())
                .status("DRAFT")
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .currency(request.getCurrency() == null ? "VND" : request.getCurrency())
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
            job.setJobType(request.getJobType());
        }
        if (request.getSalaryMin() != null) {
            job.setSalaryMin(request.getSalaryMin());
        }
        if (request.getSalaryMax() != null) {
            job.setSalaryMax(request.getSalaryMax());
        }
        if (request.getCurrency() != null) {
            job.setCurrency(request.getCurrency());
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
        return JobResponse.fromJob(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponse> getJobs(JobSearchRequest request, int page, int limit) {
        int pageNo = page < 1 ? 0 : page - 1;
        Pageable pageable = PageRequest.of(pageNo, limit, Sort.by("createdAt").descending());

        if (request == null) {
            return jobRepository.findAll(pageable).map(JobResponse::fromJob);
        }

        if (request.getSalaryMin() != null || request.getSalaryMax() != null) {
            throw new InvalidParamException("Filters salary_min/salary_max are not supported yet");
        }

        if (request.getCompanyId() != null && request.getStatus() != null) {
            return jobRepository.findByCompanyIdAndStatus(request.getCompanyId(), request.getStatus(), pageable)
                    .map(JobResponse::fromJob);
        }

        if (request.getCompanyId() != null) {
            return jobRepository.findByCompanyId(request.getCompanyId(), pageable)
                    .map(JobResponse::fromJob);
        }

        if (request.getStatus() != null) {
            return jobRepository.findByStatus(request.getStatus(), pageable)
                    .map(JobResponse::fromJob);
        }

        if (request.getJobLevelId() != null) {
            return jobRepository.findByJobLevel_Id(request.getJobLevelId(), pageable)
                    .map(JobResponse::fromJob);
        }

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            return jobRepository.findDistinctByCategories_IdIn(request.getCategoryIds(), pageable)
                    .map(JobResponse::fromJob);
        }

        if (request.getJobType() != null && request.getLocation() != null) {
            return jobRepository.findByJobTypeAndLocationContainingIgnoreCase(
                    request.getJobType(),
                    request.getLocation(),
                    pageable)
                    .map(JobResponse::fromJob);
        }

        if (request.getJobType() != null) {
            return jobRepository.findByJobType(request.getJobType(), pageable)
                    .map(JobResponse::fromJob);
        }

        if (request.getLocation() != null) {
            return jobRepository.findByLocationContainingIgnoreCase(request.getLocation(), pageable)
                    .map(JobResponse::fromJob);
        }

        if (request.getKeyword() != null && !request.getKeyword().isBlank()) {
            return jobRepository.findByTitleContainingIgnoreCase(request.getKeyword(), pageable)
                    .map(JobResponse::fromJob);
        }

        return jobRepository.findAll(pageable).map(JobResponse::fromJob);
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
        job.setStatus(status);
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
}
