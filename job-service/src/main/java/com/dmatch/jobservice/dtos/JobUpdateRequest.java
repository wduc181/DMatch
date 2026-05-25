package com.dmatch.jobservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class JobUpdateRequest {

    @JsonProperty("title")
    private String title;

    @JsonProperty("description")
    private String description;

    @JsonProperty("requirements")
    private String requirements;

    @JsonProperty("location")
    private String location;

    @JsonProperty("job_type")
    private String jobType;

    @JsonProperty("salary_min")
    private Long salaryMin;

    @JsonProperty("salary_max")
    private Long salaryMax;

    @JsonProperty("currency")
    private String currency;

    @JsonProperty("application_deadline")
    private LocalDateTime applicationDeadline;

    @JsonProperty("job_level_id")
    private Long jobLevelId;

    @JsonProperty("category_ids")
    private List<Long> categoryIds;
}
