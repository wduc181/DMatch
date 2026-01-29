package com.dmatch.jobservice.dtos;

import com.dmatch.jobservice.entities.JobCategory;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobCategoryResponse {
    private Long id;
    private String code;
    private String name;

    public static JobCategoryResponse fromJobCategory(JobCategory category) {
        return JobCategoryResponse.builder()
                .id(category.getId())
                .code(category.getCode())
                .name(category.getName())
                .build();
    }
}
