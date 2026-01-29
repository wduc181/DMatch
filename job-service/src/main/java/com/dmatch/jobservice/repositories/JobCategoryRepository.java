package com.dmatch.jobservice.repositories;

import com.dmatch.jobservice.entities.JobCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobCategoryRepository extends JpaRepository<JobCategory, Long> {
    Optional<JobCategory> findByCode(String code);
    List<JobCategory> findByIdIn(List<Long> ids);
}
