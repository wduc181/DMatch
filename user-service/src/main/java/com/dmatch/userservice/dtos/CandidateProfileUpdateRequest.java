package com.dmatch.userservice.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class CandidateProfileUpdateRequest {

     @JsonProperty("full_name")
     @Size(max = 255, message = "Full name must not exceed 255 characters")
     private String fullName;

     @JsonProperty("phone_number")
     @Pattern(regexp = "^(\\+?\\d{9,15})?$", message = "Invalid phone number format")
     private String phoneNumber;

     @JsonProperty("date_of_birth")
     private LocalDate dateOfBirth;

     @Pattern(regexp = "^(MALE|FEMALE|OTHER)?$", message = "Gender must be MALE, FEMALE, or OTHER")
     private String gender;

     @Size(max = 500, message = "Address must not exceed 500 characters")
     private String address;

     @Size(max = 5000, message = "Bio must not exceed 5000 characters")
     private String bio;

     /** JSON array string, ví dụ: ["Java","React"] */
     private String skills;

     /** JSON array of objects string */
     private String experience;

     /** JSON array of objects string */
     private String education;

     @JsonProperty("github_url")
     @URL(message = "GitHub URL is not valid")
     @Size(max = 500)
     private String githubUrl;

     @JsonProperty("linkedin_url")
     @URL(message = "LinkedIn URL is not valid")
     @Size(max = 500)
     private String linkedinUrl;

     @JsonProperty("portfolio_url")
     @URL(message = "Portfolio URL is not valid")
     @Size(max = 500)
     private String portfolioUrl;

     @JsonProperty("cv_file_url")
     @URL(message = "CV file URL is not valid")
     @Size(max = 500)
     private String cvFileUrl;
}
