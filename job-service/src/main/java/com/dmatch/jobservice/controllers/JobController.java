package com.dmatch.jobservice.controllers;

import com.dmatch.jobservice.commons.ApiResponse;
import com.dmatch.jobservice.dtos.*;
import com.dmatch.jobservice.service.interfaces.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${app.api-prefix}")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping("/jobs")
	@PreAuthorize("hasAnyRole('USER','COMPANY','ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
	    @RequestParam("company_id") Long companyId,
	    @Valid @RequestBody JobCreateRequest request
    ) {
		JobResponse job = jobService.createJob(request, companyId);
		return ResponseEntity.ok(ApiResponse.<JobResponse>builder()
				.message("Created job")
				.data(job)
				.build()
		);
    }

    @PutMapping("/jobs/{id}")
	@PreAuthorize("hasAnyRole('USER','COMPANY','ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
	    @PathVariable Long id,
	    @RequestParam("company_id") Long companyId,
	    @Valid @RequestBody JobUpdateRequest request
    ) {
		JobResponse job = jobService.updateJob(id, request, companyId);
		return ResponseEntity.ok(ApiResponse.<JobResponse>builder()
				.message("Updated job")
				.data(job)
				.build()
		);
    }

    @GetMapping("/jobs/{id}")
	@PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(
	    @PathVariable Long id
    ) {
		JobResponse job = jobService.getJobById(id);
		return ResponseEntity.ok(ApiResponse.<JobResponse>builder()
					.message("Got job")
					.data(job)
					.build()
		);
    }

    @GetMapping("/jobs")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getJobs(
	    @RequestParam(value = "keyword", required = false) String keyword,
	    @RequestParam(value = "location", required = false) String location,
	    @RequestParam(value = "job_type", required = false) String jobType,
	    @RequestParam(value = "status", required = false) String status,
	    @RequestParam(value = "job_level_id", required = false) Long jobLevelId,
	    @RequestParam(value = "category_ids", required = false) List<Long> categoryIds,
	    @RequestParam(value = "salary_min", required = false) Long salaryMin,
	    @RequestParam(value = "salary_max", required = false) Long salaryMax,
	    @RequestParam(value = "company_id", required = false) Long companyId,
	    @RequestParam(value = "sort", required = false) String sort,
	    @RequestParam(value = "page", defaultValue = "1") int page,
	    @RequestParam(value = "limit", defaultValue = "10") int limit
    ) {
		JobSearchRequest request = new JobSearchRequest();
		request.setKeyword(keyword);
		request.setLocation(location);
		request.setJobType(jobType);
		request.setStatus(status);
		request.setJobLevelId(jobLevelId);
		request.setCategoryIds(categoryIds);
		request.setSalaryMin(salaryMin);
		request.setSalaryMax(salaryMax);
		request.setCompanyId(companyId);
		request.setSort(sort);

		Page<JobResponse> jobs = jobService.getJobs(request, page, limit);
		return ResponseEntity.ok(ApiResponse.<Page<JobResponse>>builder()
				.message("Got jobs")
				.data(jobs)
				.build()
		);
    }

	@GetMapping("/jobs/by-company/{companyId}")
	@PreAuthorize("permitAll()")
	public ResponseEntity<ApiResponse<Page<JobResponse>>> getJobsByCompany(
			@PathVariable Long companyId,
			@RequestParam(value = "page", defaultValue = "1") int page,
			@RequestParam(value = "limit", defaultValue = "10") int limit
	) {
		Page<JobResponse> jobs = jobService.getJobsByCompany(companyId, page, limit);
		return ResponseEntity.ok(ApiResponse.<Page<JobResponse>>builder()
				.message("Got jobs by company")
				.data(jobs)
				.build());
	}

    @PutMapping("/jobs/{id}/status")
	@PreAuthorize("hasAnyRole('USER','COMPANY','ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> changeJobStatus(
	    @PathVariable Long id,
	    @RequestParam("company_id") Long companyId,
	    @RequestParam("status") String status
    ) {
		JobResponse job = jobService.changeJobStatus(id, status, companyId);
		return ResponseEntity.ok(ApiResponse.<JobResponse>builder()
				.message("Updated job status")
				.data(job)
				.build()
		);
    }

    @PutMapping("/jobs/{id}/level")
	@PreAuthorize("hasAnyRole('USER','COMPANY','ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> setJobLevel(
	    @PathVariable Long id,
	    @RequestParam("company_id") Long companyId,
	    @RequestParam("job_level_id") Long jobLevelId
    ) {
		JobResponse job = jobService.setJobLevel(id, jobLevelId, companyId);
		return ResponseEntity.ok(ApiResponse.<JobResponse>builder()
				.message("Updated job level")
				.data(job)
				.build()
		);
    }

    @PutMapping("/jobs/{id}/categories")
	@PreAuthorize("hasAnyRole('USER','COMPANY','ADMIN')")
    public ResponseEntity<ApiResponse<JobResponse>> setJobCategories(
	    @PathVariable Long id,
	    @RequestParam("company_id") Long companyId,
	    @Valid @RequestBody JobSetCategoriesRequest request
    ) {
		JobResponse job = jobService.setJobCategories(id, request.getCategoryIds(), companyId);
		return ResponseEntity.ok(ApiResponse.<JobResponse>builder()
				.message("Updated job categories")
				.data(job)
				.build()
		);
    }

    @DeleteMapping("/jobs/{id}")
	@PreAuthorize("hasAnyRole('USER','COMPANY','ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
	    @PathVariable Long id,
	    @RequestParam("company_id") Long companyId
    ) {
		jobService.deleteJob(id, companyId);
		return ResponseEntity.ok(ApiResponse.<Void>builder()
				.message("Deleted job")
				.data(null)
				.build()
		);
    }

    @GetMapping("/jobs/levels")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<List<JobLevelResponse>>> getJobLevels() {
		return ResponseEntity.ok(ApiResponse.<List<JobLevelResponse>>builder()
				.message("Got job levels")
				.data(jobService.getJobLevels())
				.build()
		);
    }

    @GetMapping("/jobs/categories")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ApiResponse<List<JobCategoryResponse>>> getJobCategories() {
		return ResponseEntity.ok(ApiResponse.<List<JobCategoryResponse>>builder()
				.message("Got job categories")
				.data(jobService.getJobCategories())
				.build()
		);
    }
}
