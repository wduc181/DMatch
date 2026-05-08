package com.dmatch.userservice.repositories;

import com.dmatch.userservice.entities.CandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CandidateProfileRepository extends JpaRepository<CandidateProfile, Long> {
     Optional<CandidateProfile> findByUserId(Long userId);
}
