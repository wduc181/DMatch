package com.dmatch.jobservice.repositories;

import com.dmatch.jobservice.entities.JobLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobLevelRepository extends JpaRepository<JobLevel, Long> {
    Optional<JobLevel> findByCode(String code);
}
