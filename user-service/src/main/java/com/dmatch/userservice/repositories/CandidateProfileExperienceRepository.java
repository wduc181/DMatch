package com.dmatch.userservice.repositories;

import com.dmatch.userservice.entities.CandidateProfileExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CandidateProfileExperienceRepository extends JpaRepository<CandidateProfileExperience, Long> {
     List<CandidateProfileExperience> findByCandidateProfileIdOrderByDisplayOrderAscIdAsc(Long candidateProfileId);

     @Modifying
     @Transactional
     @Query("DELETE FROM CandidateProfileExperience e WHERE e.candidateProfile.id = :candidateProfileId")
     void deleteByCandidateProfileId(@Param("candidateProfileId") Long candidateProfileId);
}
