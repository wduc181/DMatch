package com.dmatch.userservice.repositories;

import com.dmatch.userservice.entities.CandidateProfileEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CandidateProfileEducationRepository extends JpaRepository<CandidateProfileEducation, Long> {
     List<CandidateProfileEducation> findByCandidateProfileIdOrderByDisplayOrderAscIdAsc(Long candidateProfileId);

     @Modifying
     @Transactional
     @Query("DELETE FROM CandidateProfileEducation e WHERE e.candidateProfile.id = :candidateProfileId")
     void deleteByCandidateProfileId(@Param("candidateProfileId") Long candidateProfileId);
}
