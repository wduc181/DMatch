package com.dmatch.jobservice.controllers;

import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.dtos.JobResponse;
import com.dmatch.jobservice.service.interfaces.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
