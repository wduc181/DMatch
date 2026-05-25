package com.dmatch.jobservice.controllers;

import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.dtos.JobApplicationCreateRequest;
import com.dmatch.jobservice.dtos.JobApplicationResponse;
import com.dmatch.jobservice.dtos.JobApplicationStatusUpdateRequest;
import com.dmatch.jobservice.service.interfaces.JobApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${app.api-prefix}/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping("/jobs/{jobId}")
    @PreAuthorize("hasRole('USER') and !hasRole('COMPANY') and !hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> applyToJob(
            @PathVariable Long jobId,
            @Valid @RequestBody JobApplicationCreateRequest request
    ) {
        JobApplicationResponse application = jobApplicationService.applyToJob(jobId, request);
        return ResponseEntity.ok(ApiResponse.<JobApplicationResponse>builder()
                .message("Applied to job")
                .data(application)
                .build());
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') and !hasRole('COMPANY') and !hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<JobApplicationResponse>>> getMyApplications(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "limit", defaultValue = "10") int limit
    ) {
        Page<JobApplicationResponse> applications = jobApplicationService.getMyApplications(page, limit);
        return ResponseEntity.ok(ApiResponse.<Page<JobApplicationResponse>>builder()
                .message("Got my applications")
                .data(applications)
                .build());
    }

    @GetMapping("/me/jobs/{jobId}")
    @PreAuthorize("hasRole('USER') and !hasRole('COMPANY') and !hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> getMyApplicationForJob(@PathVariable Long jobId) {
        JobApplicationResponse application = jobApplicationService.getMyApplicationForJob(jobId);
        return ResponseEntity.ok(ApiResponse.<JobApplicationResponse>builder()
                .message("Got my application for job")
                .data(application)
                .build());
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('COMPANY','ADMIN')")
    public ResponseEntity<ApiResponse<Page<JobApplicationResponse>>> getCompanyApplications(
            @PathVariable Long companyId,
            @RequestParam(value = "job_id", required = false) Long jobId,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "limit", defaultValue = "10") int limit
    ) {
        Page<JobApplicationResponse> applications = jobApplicationService.getCompanyApplications(
                companyId, jobId, status, keyword, page, limit);
        return ResponseEntity.ok(ApiResponse.<Page<JobApplicationResponse>>builder()
                .message("Got company applications")
                .data(applications)
                .build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('COMPANY','ADMIN')")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody JobApplicationStatusUpdateRequest request
    ) {
        JobApplicationResponse application = jobApplicationService.updateApplicationStatus(id, request);
        return ResponseEntity.ok(ApiResponse.<JobApplicationResponse>builder()
                .message("Updated application status")
                .data(application)
                .build());
    }

    @PutMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('USER') and !hasRole('COMPANY') and !hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> withdrawApplication(@PathVariable Long id) {
        JobApplicationResponse application = jobApplicationService.withdrawApplication(id);
        return ResponseEntity.ok(ApiResponse.<JobApplicationResponse>builder()
                .message("Withdrew application")
                .data(application)
                .build());
    }
}
