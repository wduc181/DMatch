package com.dmatch.userservice.dtos;

import com.dmatch.userservice.entities.CandidateProfile;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class CandidateProfileResponse {
     private Long id;

     @JsonProperty("user_id")
     private Long userId;

     /** Lấy từ User entity — tiện cho frontend hiển thị */
     @JsonProperty("full_name")
     private String fullName;

     private String email;

     @JsonProperty("phone_number")
     private String phoneNumber;

     @JsonProperty("date_of_birth")
     private LocalDate dateOfBirth;

     private String gender;
     private String address;
     private String bio;

     /** JSON string — frontend sẽ parse thành array */
     private String skills;
     private String experience;
     private String education;

     @JsonProperty("github_url")
     private String githubUrl;

     @JsonProperty("linkedin_url")
     private String linkedinUrl;

     @JsonProperty("portfolio_url")
     private String portfolioUrl;

     @JsonProperty("cv_file_url")
     private String cvFileUrl;

     public static CandidateProfileResponse fromEntity(CandidateProfile profile) {
          return fromEntity(profile, profile.getSkills(), profile.getExperience(), profile.getEducation());
     }

     public static CandidateProfileResponse fromEntity(
               CandidateProfile profile,
               String skills,
               String experience,
               String education
     ) {
          return CandidateProfileResponse.builder()
                    .id(profile.getId())
                    .userId(profile.getUser().getId())
                    .fullName(profile.getUser().getFullName())
                    .email(profile.getUser().getEmail())
                    .phoneNumber(profile.getPhoneNumber())
                    .dateOfBirth(profile.getDateOfBirth())
                    .gender(profile.getGender())
                    .address(profile.getAddress())
                    .bio(profile.getBio())
                    .skills(skills)
                    .experience(experience)
                    .education(education)
                    .githubUrl(profile.getGithubUrl())
                    .linkedinUrl(profile.getLinkedinUrl())
                    .portfolioUrl(profile.getPortfolioUrl())
                    .cvFileUrl(profile.getCvFileUrl())
                    .build();
     }
}
