package com.dmatch.jobservice.entities;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications", indexes = {
        @Index(name = "idx_job_applications_candidate_user_id", columnList = "candidate_user_id"),
        @Index(name = "idx_job_applications_company_job_status", columnList = "company_id, job_id, status"),
        @Index(name = "idx_job_applications_status", columnList = "status"),
        @Index(name = "idx_job_applications_applied_at", columnList = "applied_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "candidate_user_id", nullable = false)
    private Long candidateUserId;

    @Column(name = "candidate_name")
    private String candidateName;

    @Column(name = "candidate_email", nullable = false)
    private String candidateEmail;

    @Column(name = "cv_file_url", nullable = false, length = 500)
    private String cvFileUrl;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(nullable = false)
    private String status;

    @CreationTimestamp
    @Column(name = "applied_at", updatable = false)
    private LocalDateTime appliedAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
