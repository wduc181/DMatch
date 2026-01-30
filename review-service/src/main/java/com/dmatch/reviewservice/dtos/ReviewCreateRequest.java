package com.dmatch.reviewservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewCreateRequest {
    @NotNull(message = "User id is required")
    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("company_id")
    private Long companyId;

    @JsonProperty("job_id")
    private Long jobId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    @JsonProperty("rating")
    private Integer rating;

    @Size(max = 2000, message = "Comment must not exceed 2000 characters")
    @JsonProperty("comment")
    private String comment;

    @AssertTrue(message = "Exactly one of company_id or job_id must be provided")
    public boolean isTargetValid() {
        boolean hasCompany = companyId != null;
        boolean hasJob = jobId != null;
        return (hasCompany && !hasJob) || (!hasCompany && hasJob);
    }
}
