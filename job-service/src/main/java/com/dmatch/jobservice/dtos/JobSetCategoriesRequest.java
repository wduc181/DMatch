package com.dmatch.jobservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class JobSetCategoriesRequest {

    @NotNull
    @JsonProperty("category_ids")
    private List<Long> categoryIds;
}
