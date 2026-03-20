package com.dmatch.jobservice.service.interfaces;

import com.dmatch.jobservice.dtos.JobCategoryResponse;
import com.dmatch.jobservice.dtos.JobCreateRequest;
import com.dmatch.jobservice.dtos.JobLevelResponse;
import com.dmatch.jobservice.dtos.JobResponse;
import com.dmatch.jobservice.dtos.JobSearchRequest;
import com.dmatch.jobservice.dtos.JobUpdateRequest;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface JobService {
	JobResponse createJob(JobCreateRequest request, Long companyId);
	JobResponse updateJob(Long jobId, JobUpdateRequest request, Long companyId);
	JobResponse getJobById(Long id);
	Page<JobResponse> getJobs(JobSearchRequest request, int page, int limit);
	Page<JobResponse> getJobsByCompany(Long companyId, int page, int limit);
	JobResponse changeJobStatus(Long jobId, String status, Long companyId);
	JobResponse setJobLevel(Long jobId, Long jobLevelId, Long companyId);
	JobResponse setJobCategories(Long jobId, List<Long> categoryIds, Long companyId);
	void deleteJob(Long jobId, Long companyId);

	List<JobLevelResponse> getJobLevels();
	List<JobCategoryResponse> getJobCategories();

	Map<Long, Integer> countActiveJobsByCompanyIds(List<Long> companyIds);
}
