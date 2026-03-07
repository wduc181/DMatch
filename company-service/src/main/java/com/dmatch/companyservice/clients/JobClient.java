package com.dmatch.companyservice.clients;

import com.dmatch.companyservice.commons.ApiResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@FeignClient(name = "job-service", path = "/internal/jobs", fallback = JobClientFallback.class)
public interface JobClient {

    /**
     * Lấy số lượng job ACTIVE theo danh sách companyId.
     * Response: Map<companyId, count>
     */
    @GetMapping("/count-by-companies")
    ResponseEntity<ApiResponse<Map<Long, Integer>>> countActiveJobsByCompanyIds(
            @RequestParam("company_ids") java.util.List<Long> companyIds
    );
}
