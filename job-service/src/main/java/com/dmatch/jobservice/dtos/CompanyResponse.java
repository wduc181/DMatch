package com.dmatch.jobservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CompanyResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("name")
    private String name;
}
