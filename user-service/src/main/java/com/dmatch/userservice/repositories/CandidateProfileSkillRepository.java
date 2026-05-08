package com.dmatch.userservice.repositories;

import com.dmatch.userservice.entities.CandidateProfileSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CandidateProfileSkillRepository extends JpaRepository<CandidateProfileSkill, Long> {
     List<CandidateProfileSkill> findByCandidateProfileIdOrderByDisplayOrderAscIdAsc(Long candidateProfileId);

     @Modifying
     @Transactional
     @Query("DELETE FROM CandidateProfileSkill s WHERE s.candidateProfile.id = :candidateProfileId")
     void deleteByCandidateProfileId(@Param("candidateProfileId") Long candidateProfileId);
}
