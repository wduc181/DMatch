package com.dmatch.jobservice.dtos;

import com.dmatch.jobservice.entities.Job;
import com.dmatch.jobservice.entities.JobApplication;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class JobApplicationResponse {
    private Long id;

    @JsonProperty("job_id")
    private Long jobId;

    @JsonProperty("job_title")
    private String jobTitle;

    @JsonProperty("company_id")
    private Long companyId;

    @JsonProperty("company_name")
    private String companyName;

    @JsonProperty("candidate_user_id")
    private Long candidateUserId;

    @JsonProperty("candidate_name")
    private String candidateName;

    @JsonProperty("candidate_email")
    private String candidateEmail;

    @JsonProperty("cv_file_url")
    private String cvFileUrl;

    @JsonProperty("cover_letter")
    private String coverLetter;

    private String status;
    private String location;

    @JsonProperty("job_type")
    private String jobType;

    @JsonProperty("salary_min")
    private Long salaryMin;

    @JsonProperty("salary_max")
    private Long salaryMax;

    private String currency;

    @JsonProperty("applied_at")
    private LocalDateTime appliedAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    public static JobApplicationResponse fromEntity(JobApplication application) {
        Job job = application.getJob();
        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(job == null ? null : job.getId())
                .jobTitle(application.getJobTitle())
                .companyId(application.getCompanyId())
                .companyName(application.getCompanyName())
                .candidateUserId(application.getCandidateUserId())
                .candidateName(application.getCandidateName())
                .candidateEmail(application.getCandidateEmail())
                .cvFileUrl(application.getCvFileUrl())
                .coverLetter(application.getCoverLetter())
                .status(application.getStatus())
                .location(job == null ? null : job.getLocation())
                .jobType(job == null ? null : job.getJobType())
                .salaryMin(job == null ? null : job.getSalaryMin())
                .salaryMax(job == null ? null : job.getSalaryMax())
                .currency(job == null ? null : job.getCurrency())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
