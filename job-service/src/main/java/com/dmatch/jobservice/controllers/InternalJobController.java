package com.dmatch.jobservice.controllers;

import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.dtos.JobResponse;
import com.dmatch.jobservice.service.interfaces.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("${app.internal-prefix}/jobs")
@RequiredArgsConstructor
public class InternalJobController {

     private final JobService jobService;

     @GetMapping("/{id}")
     public ResponseEntity<ApiResponse<JobResponse>> getJobById(@PathVariable Long id) {
          JobResponse job = jobService.getJobById(id);
          return ResponseEntity.ok(ApiResponse.<JobResponse>builder()
                    .message("Got job by id")
                    .data(job)
                    .build());
     }

     /**
      * Batch endpoint: đếm số job ACTIVE theo danh sách company IDs.
      * Dùng bởi company-service để enrich open_jobs cho listing page.
      * Response: Map<companyId, count>
      */
     @GetMapping("/count-by-companies")
     public ResponseEntity<ApiResponse<Map<Long, Integer>>> countActiveJobsByCompanyIds(
             @RequestParam("company_ids") List<Long> companyIds
     ) {
          Map<Long, Integer> counts = jobService.countActiveJobsByCompanyIds(companyIds);
          return ResponseEntity.ok(ApiResponse.<Map<Long, Integer>>builder()
                    .message("Got active job counts by company")
                    .data(counts)
                    .build());
     }
}
