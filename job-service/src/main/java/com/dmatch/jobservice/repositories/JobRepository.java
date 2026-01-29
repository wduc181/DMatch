package com.dmatch.jobservice.repositories;

import com.dmatch.jobservice.entities.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
	Page<Job> findByCompanyId(Long companyId, Pageable pageable);
	boolean existsByCompanyIdAndTitleIgnoreCase(Long companyId, String title);
	Page<Job> findByStatus(String status, Pageable pageable);
	Page<Job> findByTitleContainingIgnoreCase(String title, Pageable pageable);
	Page<Job> findByJobType(String jobType, Pageable pageable);
	Page<Job> findByLocationContainingIgnoreCase(String location, Pageable pageable);
	Page<Job> findByJobTypeAndLocationContainingIgnoreCase(String jobType, String location, Pageable pageable);
	Page<Job> findByCompanyIdAndStatus(Long companyId, String status, Pageable pageable);
	Page<Job> findByJobLevel_Id(Long jobLevelId, Pageable pageable);
	Page<Job> findDistinctByCategories_Id(Long categoryId, Pageable pageable);
	Page<Job> findDistinctByCategories_IdIn(List<Long> categoryIds, Pageable pageable);
}
