package com.dmatch.jobservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JobApplicationStatusUpdateRequest {

    @NotBlank
    @JsonProperty("status")
    private String status;
}
