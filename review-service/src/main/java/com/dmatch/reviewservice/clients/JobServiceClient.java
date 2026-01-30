package com.dmatch.reviewservice.clients;

import com.dmatch.reviewservice.commons.ApiResponse;
import com.dmatch.reviewservice.dtos.JobSummaryResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "JOB-SERVICE")
public interface JobServiceClient {

    @GetMapping("${app.api-prefix}/jobs/{id}")
    ApiResponse<JobSummaryResponse> getJobById(@PathVariable("id") Long id);
}
