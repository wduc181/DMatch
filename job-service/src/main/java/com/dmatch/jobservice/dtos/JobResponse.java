package com.dmatch.jobservice.dtos;

import com.dmatch.jobservice.entities.Job;
import com.dmatch.jobservice.entities.JobCategory;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String location;

    @JsonProperty("job_type")
    private String jobType;

    private String status;

    @JsonProperty("salary_min")
    private Long salaryMin;

    @JsonProperty("salary_max")
    private Long salaryMax;

    private String currency;

    @JsonProperty("company_id")
    private Long companyId;

    @JsonProperty("company_name")
    private String companyName;

    @JsonProperty("company_logo_url")
    private String companyLogoUrl;

    @JsonProperty("application_deadline")
    private LocalDateTime applicationDeadline;

    @JsonProperty("closed_at")
    private LocalDateTime closedAt;

    @JsonProperty("job_level")
    private JobLevelResponse jobLevel;

    private List<JobCategoryResponse> categories;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    private static List<JobCategoryResponse> mapCategories(Set<JobCategory> categories) {
        if (categories == null || categories.isEmpty()) {
            return Collections.emptyList();
        }
        return categories.stream()
                .map(JobCategoryResponse::fromJobCategory)
                .collect(Collectors.toList());
    }

    public static JobResponse fromJob(Job job) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .status(job.getStatus())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .currency(job.getCurrency())
                .companyId(job.getCompanyId())
                .applicationDeadline(job.getApplicationDeadline())
                .closedAt(job.getClosedAt())
                .jobLevel(job.getJobLevel() == null ? null : JobLevelResponse.fromJobLevel(job.getJobLevel()))
                .categories(mapCategories(job.getCategories()))
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    /**
     * Overload: build JobResponse với company info đã enriched.
     */
    public static JobResponse fromJob(Job job, String companyName, String companyLogoUrl) {
        return JobResponse.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .requirements(job.getRequirements())
                .location(job.getLocation())
                .jobType(job.getJobType())
                .status(job.getStatus())
                .salaryMin(job.getSalaryMin())
                .salaryMax(job.getSalaryMax())
                .currency(job.getCurrency())
                .companyId(job.getCompanyId())
                .companyName(companyName)
                .companyLogoUrl(companyLogoUrl)
                .applicationDeadline(job.getApplicationDeadline())
                .closedAt(job.getClosedAt())
                .jobLevel(job.getJobLevel() == null ? null : JobLevelResponse.fromJobLevel(job.getJobLevel()))
                .categories(mapCategories(job.getCategories()))
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
