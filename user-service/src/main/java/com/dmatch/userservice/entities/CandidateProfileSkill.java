package com.dmatch.userservice.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_profile_skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfileSkill {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "candidate_profile_id", nullable = false)
     private CandidateProfile candidateProfile;

     @Column(name = "skill_name", nullable = false)
     private String skillName;

     @Column(name = "display_order", nullable = false)
     private Integer displayOrder;
}
