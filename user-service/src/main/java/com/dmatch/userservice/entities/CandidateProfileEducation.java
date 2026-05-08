package com.dmatch.userservice.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidate_profile_educations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfileEducation {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @ManyToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "candidate_profile_id", nullable = false)
     private CandidateProfile candidateProfile;

     @Column(name = "education_data", nullable = false, columnDefinition = "TEXT")
     private String educationData;

     @Column(name = "display_order", nullable = false)
     private Integer displayOrder;
}
