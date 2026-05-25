package com.dmatch.jobservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JobApplicationCreateRequest {

    @JsonProperty("candidate_name")
    private String candidateName;

    @NotBlank
    @JsonProperty("cv_file_url")
    private String cvFileUrl;

    @JsonProperty("cover_letter")
    private String coverLetter;
}
