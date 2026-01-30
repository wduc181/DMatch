package com.dmatch.reviewservice.repositories;

import com.dmatch.reviewservice.entities.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends JpaRepository<Review, Long>, JpaSpecificationExecutor<Review> {

	Page<Review> findByCompanyId(Long companyId, Pageable pageable);

	Page<Review> findByJobId(Long jobId, Pageable pageable);

	Page<Review> findByUserId(Long userId, Pageable pageable);

	Page<Review> findByCompanyIdAndStatus(Long companyId, String status, Pageable pageable);

	Page<Review> findByJobIdAndStatus(Long jobId, String status, Pageable pageable);

	boolean existsByUserIdAndCompanyId(Long userId, Long companyId);

	boolean existsByUserIdAndJobId(Long userId, Long jobId);

	long countByCompanyIdAndStatus(Long companyId, String status);

	long countByJobIdAndStatus(Long jobId, String status);

	@Query("SELECT AVG(r.rating) FROM Review r WHERE r.companyId = :companyId AND r.status = :status")
	Double getAverageRatingByCompanyIdAndStatus(@Param("companyId") Long companyId,
												@Param("status") String status);

	@Query("SELECT AVG(r.rating) FROM Review r WHERE r.jobId = :jobId AND r.status = :status")
	Double getAverageRatingByJobIdAndStatus(@Param("jobId") Long jobId,
											@Param("status") String status);
}
