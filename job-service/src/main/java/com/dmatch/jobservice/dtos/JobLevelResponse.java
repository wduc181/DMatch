package com.dmatch.jobservice.dtos;

import com.dmatch.jobservice.entities.JobLevel;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobLevelResponse {
    private Long id;
    private String code;
    private String name;

    public static JobLevelResponse fromJobLevel(JobLevel jobLevel) {
        return JobLevelResponse.builder()
                .id(jobLevel.getId())
                .code(jobLevel.getCode())
                .name(jobLevel.getName())
                .build();
    }
}
