package com.dmatch.reviewservice.clients;

import com.dmatch.reviewservice.commons.ApiResponse;
import com.dmatch.reviewservice.dtos.JobSummaryResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JobServiceClientFallback implements JobServiceClient {

     @Override
     public ApiResponse<JobSummaryResponse> getJobById(Long id) {
          log.warn("Fallback: Job Service không khả dụng - getJobById({})", id);
          return ApiResponse.<JobSummaryResponse>builder()
                    .message("Job Service không khả dụng")
                    .data(JobSummaryResponse.builder()
                              .id(id)
                              .title("Job Info Unavailable")
                              .companyId(null)
                              .build())
                    .build();
     }
}
