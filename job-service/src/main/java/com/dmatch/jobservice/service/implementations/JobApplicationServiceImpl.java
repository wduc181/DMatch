package com.dmatch.jobservice.service.implementations;

import com.dmatch.jobservice.clients.CompanyClient;
import com.dmatch.jobservice.clients.UserClient;
import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.commons.JobApplicationStatus;
import com.dmatch.jobservice.commons.JobStatus;
import com.dmatch.jobservice.dtos.*;
import com.dmatch.jobservice.entities.Job;
import com.dmatch.jobservice.entities.JobApplication;
import com.dmatch.jobservice.exceptions.DataNotFoundException;
import com.dmatch.jobservice.exceptions.InvalidBodyException;
import com.dmatch.jobservice.exceptions.InvalidParamException;
import com.dmatch.jobservice.exceptions.PermissionDeniedException;
import com.dmatch.jobservice.repositories.JobApplicationRepository;
import com.dmatch.jobservice.repositories.JobRepository;
import com.dmatch.jobservice.service.interfaces.JobApplicationService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class JobApplicationServiceImpl implements JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobRepository jobRepository;
    private final CompanyClient companyClient;
    private final UserClient userClient;

    @Override
    @Transactional
    public JobApplicationResponse applyToJob(Long jobId, JobApplicationCreateRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new DataNotFoundException("Job not found with id: " + jobId));

        validateJobCanReceiveApplications(job);

        InternalUserResponse currentUser = getCurrentUser();
        if (jobApplicationRepository.existsByJobIdAndCandidateUserId(jobId, currentUser.getId())) {
            throw new InvalidBodyException("You have already applied to this job");
        }

        CompanyResponse company = getCompanyByIdOrThrow(job.getCompanyId());
        String candidateName = normalizeBlankToNull(request.getCandidateName());
        if (candidateName == null) {
            candidateName = currentUser.getEmail();
        }

        JobApplication application = JobApplication.builder()
                .job(job)
                .jobTitle(job.getTitle())
                .companyId(job.getCompanyId())
                .companyName(company.getName())
                .candidateUserId(currentUser.getId())
                .candidateName(candidateName)
                .candidateEmail(currentUser.getEmail())
                .cvFileUrl(request.getCvFileUrl().trim())
                .coverLetter(normalizeBlankToNull(request.getCoverLetter()))
                .status(JobApplicationStatus.PENDING.name())
                .build();

        return JobApplicationResponse.fromEntity(jobApplicationRepository.save(application));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getMyApplications(int page, int limit) {
        InternalUserResponse currentUser = getCurrentUser();
        Pageable pageable = buildPageable(page, limit);
        return jobApplicationRepository.findByCandidateUserId(currentUser.getId(), pageable)
                .map(JobApplicationResponse::fromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public JobApplicationResponse getMyApplicationForJob(Long jobId) {
        InternalUserResponse currentUser = getCurrentUser();
        JobApplication application = jobApplicationRepository
                .findByJobIdAndCandidateUserId(jobId, currentUser.getId())
                .orElseThrow(() -> new DataNotFoundException("Application not found for this job"));
        return JobApplicationResponse.fromEntity(application);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getCompanyApplications(
            Long companyId,
            Long jobId,
            String status,
            String keyword,
            int page,
            int limit
    ) {
        validateCompanyOwnership(companyId);
        String normalizedStatus = status == null || status.isBlank() ? null : normalizeApplicationStatus(status);
        String normalizedKeyword = normalizeBlankToNull(keyword);
        Pageable pageable = buildPageable(page, limit);
        return jobApplicationRepository
                .findByCompanyFilters(companyId, jobId, normalizedStatus, normalizedKeyword, pageable)
                .map(JobApplicationResponse::fromEntity);
    }

    @Override
    @Transactional
    public JobApplicationResponse updateApplicationStatus(Long applicationId, JobApplicationStatusUpdateRequest request) {
        JobApplication application = jobApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new DataNotFoundException("Application not found with id: " + applicationId));
        validateCompanyOwnership(application.getCompanyId());

        String status = normalizeApplicationStatus(request.getStatus());
        if (JobApplicationStatus.WITHDRAWN.name().equals(status)) {
            throw new InvalidParamException("Recruiters cannot set application status to WITHDRAWN");
        }

        application.setStatus(status);
        return JobApplicationResponse.fromEntity(jobApplicationRepository.save(application));
    }

    @Override
    @Transactional
    public JobApplicationResponse withdrawApplication(Long applicationId) {
        InternalUserResponse currentUser = getCurrentUser();
        JobApplication application = jobApplicationRepository
                .findByIdAndCandidateUserId(applicationId, currentUser.getId())
                .orElseThrow(() -> new DataNotFoundException("Application not found with id: " + applicationId));

        if (JobApplicationStatus.ACCEPTED.name().equals(application.getStatus())) {
            throw new InvalidBodyException("Accepted applications cannot be withdrawn");
        }

        application.setStatus(JobApplicationStatus.WITHDRAWN.name());
        return JobApplicationResponse.fromEntity(jobApplicationRepository.save(application));
    }

    private void validateJobCanReceiveApplications(Job job) {
        if (!JobStatus.ACTIVE.name().equals(job.getStatus())) {
            throw new InvalidBodyException("Job is not open for applications");
        }
        if (job.getApplicationDeadline() != null && job.getApplicationDeadline().isBefore(LocalDateTime.now())) {
            throw new InvalidBodyException("Job application deadline has passed");
        }
    }

    private Pageable buildPageable(int page, int limit) {
        int pageNo = page < 1 ? 0 : page - 1;
        int pageSize = limit < 1 ? 10 : Math.min(limit, 100);
        return PageRequest.of(pageNo, pageSize, Sort.by("appliedAt").descending());
    }

    private String normalizeApplicationStatus(String status) {
        if (status == null || status.isBlank()) {
            throw new InvalidParamException("status is required");
        }
        String normalized = status.trim().toUpperCase(Locale.ROOT);
        try {
            return JobApplicationStatus.valueOf(normalized).name();
        } catch (IllegalArgumentException e) {
            throw new InvalidParamException("Unsupported application status: " + status);
        }
    }

    private String normalizeBlankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private InternalUserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new PermissionDeniedException("Unauthenticated");
        }
        String email = authentication.getName();
        if (email == null || email.isBlank()) {
            throw new PermissionDeniedException("Invalid authentication subject");
        }
        return getUserByEmailOrThrow(email);
    }

    private void validateCompanyOwnership(Long companyId) {
        if (companyId == null) {
            throw new InvalidParamException("company_id is required");
        }

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
}
