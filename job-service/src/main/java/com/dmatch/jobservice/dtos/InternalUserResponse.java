package com.dmatch.jobservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class InternalUserResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("email")
    private String email;
}
