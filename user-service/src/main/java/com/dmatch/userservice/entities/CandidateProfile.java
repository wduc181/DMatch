package com.dmatch.userservice.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @OneToOne(fetch = FetchType.LAZY)
     @JoinColumn(name = "user_id", nullable = false, unique = true)
     private User user;

     @Column(name = "phone_number", length = 20)
     private String phoneNumber;

     @Column(name = "date_of_birth")
     private LocalDate dateOfBirth;

     @Column(length = 10)
     private String gender;

     @Column(length = 500)
     private String address;

     @Column(columnDefinition = "TEXT")
     private String bio;

     /** JSON array, ví dụ: ["Java","React","SQL"] */
     @Column(columnDefinition = "TEXT")
     private String skills;

     /** JSON array of objects */
     @Column(columnDefinition = "TEXT")
     private String experience;

     /** JSON array of objects */
     @Column(columnDefinition = "TEXT")
     private String education;

     @Column(name = "github_url", length = 500)
     private String githubUrl;

     @Column(name = "linkedin_url", length = 500)
     private String linkedinUrl;

     @Column(name = "portfolio_url", length = 500)
     private String portfolioUrl;

     @Column(name = "cv_file_url", length = 500)
     private String cvFileUrl;

     @CreationTimestamp
     @Column(name = "created_at", updatable = false)
     private LocalDateTime createdAt;

     @UpdateTimestamp
     @Column(name = "updated_at")
     private LocalDateTime updatedAt;
}
