package com.dmatch.reviewservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanySummaryResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("name")
    private String name;
}
