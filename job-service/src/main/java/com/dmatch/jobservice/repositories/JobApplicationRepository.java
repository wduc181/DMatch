package com.dmatch.jobservice.repositories;

import com.dmatch.jobservice.entities.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    boolean existsByJobId(Long jobId);

    boolean existsByJobIdAndCandidateUserId(Long jobId, Long candidateUserId);

    Page<JobApplication> findByCandidateUserId(Long candidateUserId, Pageable pageable);

    Optional<JobApplication> findByJobIdAndCandidateUserId(Long jobId, Long candidateUserId);

    Optional<JobApplication> findByIdAndCandidateUserId(Long id, Long candidateUserId);

    @Query("""
            SELECT application FROM JobApplication application
            WHERE application.companyId = :companyId
              AND (:jobId IS NULL OR application.job.id = :jobId)
              AND (:status IS NULL OR application.status = :status)
              AND (
                    :keyword IS NULL
                    OR LOWER(application.candidateName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(application.candidateEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(application.jobTitle) LIKE LOWER(CONCAT('%', :keyword, '%'))
              )
            """)
    Page<JobApplication> findByCompanyFilters(
            @Param("companyId") Long companyId,
            @Param("jobId") Long jobId,
            @Param("status") String status,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
