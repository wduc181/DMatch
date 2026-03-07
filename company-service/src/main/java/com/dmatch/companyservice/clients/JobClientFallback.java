package com.dmatch.companyservice.clients;

import com.dmatch.companyservice.commons.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class JobClientFallback implements JobClient {

    @Override
    public ResponseEntity<ApiResponse<Map<Long, Integer>>> countActiveJobsByCompanyIds(List<Long> companyIds) {
        log.warn("Fallback: Job Service unavailable - countActiveJobsByCompanyIds({})", companyIds);
        ApiResponse<Map<Long, Integer>> response = ApiResponse.<Map<Long, Integer>>builder()
                .message("Job Service unavailable")
                .data(Collections.emptyMap())
                .build();
        return ResponseEntity.ok(response);
    }
}
