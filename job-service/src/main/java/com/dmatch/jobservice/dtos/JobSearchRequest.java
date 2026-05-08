package com.dmatch.jobservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class JobSearchRequest {

    @JsonProperty("keyword")
    private String keyword;

    @JsonProperty("location")
    private String location;

    @JsonProperty("job_type")
    private String jobType;

    @JsonProperty("status")
    private String status;

    @JsonProperty("job_level_id")
    private Long jobLevelId;

    @JsonProperty("category_ids")
    private List<Long> categoryIds;

    @JsonProperty("salary_min")
    private Long salaryMin;

    @JsonProperty("salary_max")
    private Long salaryMax;

    @JsonProperty("company_id")
    private Long companyId;

    @JsonProperty("sort")
    private String sort;
}
