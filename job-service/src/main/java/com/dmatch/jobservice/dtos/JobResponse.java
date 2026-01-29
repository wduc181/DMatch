package com.dmatch.jobservice.dtos;

import com.dmatch.jobservice.entities.Job;
import com.dmatch.jobservice.entities.JobCategory;
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
    private String jobType;
    private String status;
    private Long salaryMin;
    private Long salaryMax;
    private String currency;
    private Long companyId;
    private JobLevelResponse jobLevel;
    private List<JobCategoryResponse> categories;
    private LocalDateTime createdAt;
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
                .jobLevel(job.getJobLevel() == null ? null : JobLevelResponse.fromJobLevel(job.getJobLevel()))
                .categories(mapCategories(job.getCategories()))
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }
}
