package com.dmatch.userservice.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_profile_experiences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfileExperience {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "candidate_profile_id", nullable = false)
     private CandidateProfile candidateProfile;

     @Column(name = "experience_data", nullable = false, columnDefinition = "TEXT")
     private String experienceData;

     @Column(name = "display_order", nullable = false)
     private Integer displayOrder;
}
