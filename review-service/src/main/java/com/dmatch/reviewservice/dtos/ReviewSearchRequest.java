package com.dmatch.reviewservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSearchRequest {
    @JsonProperty("company_id")
    private Long companyId;

    @JsonProperty("job_id")
    private Long jobId;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("rating")
    private Integer rating;

    @JsonProperty("status")
    private String status;

    @JsonProperty("page")
    private Integer page = 1;

    @JsonProperty("limit")
    private Integer limit = 10;

    @JsonProperty("sort_by")
    private String sortBy = "created_at";

    @JsonProperty("sort_dir")
    private String sortDir = "desc";
}
