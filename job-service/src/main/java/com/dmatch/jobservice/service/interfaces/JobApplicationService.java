package com.dmatch.jobservice.service.interfaces;

import com.dmatch.jobservice.dtos.JobApplicationCreateRequest;
import com.dmatch.jobservice.dtos.JobApplicationResponse;
import com.dmatch.jobservice.dtos.JobApplicationStatusUpdateRequest;
import org.springframework.data.domain.Page;

public interface JobApplicationService {

    JobApplicationResponse applyToJob(Long jobId, JobApplicationCreateRequest request);

    Page<JobApplicationResponse> getMyApplications(int page, int limit);

    JobApplicationResponse getMyApplicationForJob(Long jobId);

    Page<JobApplicationResponse> getCompanyApplications(
            Long companyId,
            Long jobId,
            String status,
            String keyword,
            int page,
            int limit
    );

    JobApplicationResponse updateApplicationStatus(Long applicationId, JobApplicationStatusUpdateRequest request);

    JobApplicationResponse withdrawApplication(Long applicationId);
}
