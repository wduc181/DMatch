package com.dmatch.userservice.services.implementations;

import com.dmatch.userservice.commons.RoleName;
import com.dmatch.userservice.commons.UserStatus;
import com.dmatch.userservice.dtos.CandidateProfileResponse;
import com.dmatch.userservice.dtos.CandidateProfileUpdateRequest;
import com.dmatch.userservice.dtos.UserCreateRequest;
import com.dmatch.userservice.entities.CandidateProfile;
import com.dmatch.userservice.entities.CandidateProfileEducation;
import com.dmatch.userservice.entities.CandidateProfileExperience;
import com.dmatch.userservice.entities.CandidateProfileSkill;
import com.dmatch.userservice.entities.Role;
import com.dmatch.userservice.entities.User;
import com.dmatch.userservice.exceptions.DataNotFoundException;
import com.dmatch.userservice.exceptions.InvalidBodyException;
import com.dmatch.userservice.exceptions.PermissionDeniedException;
import com.dmatch.userservice.dtos.InternalUserResponse;
import com.dmatch.userservice.dtos.UserResponse;
import com.dmatch.userservice.repositories.CandidateProfileEducationRepository;
import com.dmatch.userservice.repositories.CandidateProfileExperienceRepository;
import com.dmatch.userservice.repositories.CandidateProfileRepository;
import com.dmatch.userservice.repositories.CandidateProfileSkillRepository;
import com.dmatch.userservice.repositories.RoleRepository;
import com.dmatch.userservice.repositories.UserRepository;
import com.dmatch.userservice.services.interfaces.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final CandidateProfileSkillRepository candidateProfileSkillRepository;
    private final CandidateProfileExperienceRepository candidateProfileExperienceRepository;
    private final CandidateProfileEducationRepository candidateProfileEducationRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest userCreateRequest) {
        String email = normalizeEmail(userCreateRequest.getEmail());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new InvalidBodyException("Email already exists");
        }
        Role role = roleRepository.findByName(RoleName.USER.name())
                .orElseThrow(() -> new DataNotFoundException("Default role USER not found in Database"));
        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
        .email(email)
                .fullName(userCreateRequest.getFullName())
                .status(UserStatus.ACTIVE)
                .roles(roles)
                .build();

        userRepository.save(user);
        return UserResponse.fromUser(user);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User not found with id: " + id));
        return UserResponse.fromUser(user);
    }

    @Override
    public InternalUserResponse getUserByEmail(String email) {
        String normalizedEmail = normalizeEmail(email);
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new DataNotFoundException("User not found with email: " + email));
        return InternalUserResponse.fromUser(user);
    }

    @Override
    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new PermissionDeniedException("User is not logged in");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new DataNotFoundException("Current user not found"));

        if (!UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new PermissionDeniedException("User account is not active");
        }

        return UserResponse.fromUser(user);

    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserResponse::fromUser).toList();
    }

    @Transactional
    @Override
    public UserResponse changeUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User not found with id: " + id));

        if (UserStatus.ACTIVE.equals(user.getStatus())) {
            user.setStatus(UserStatus.BANNED);
        } else {
            user.setStatus(UserStatus.ACTIVE);
        }
        User updatedUser = userRepository.save(user);
        return UserResponse.fromUser(updatedUser);
    }

    @Override
    public UserResponse addCompanyRoleToUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User not found with id: " + id));
        if (!UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new PermissionDeniedException("User is not active");
        }
        Set<Role> roles = user.getRoles();
        Role companyRole = roleRepository.findByName(RoleName.COMPANY.name())
                .orElseThrow(() -> new DataNotFoundException("Default role COMPANY not found in Database"));
        roles.add(companyRole);
        user.setRoles(roles);
        userRepository.save(user);
        return UserResponse.fromUser(user);
    }

    @Override
    public UserResponse deleteCompanyRoleToUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User not found with id: " + id));
        if (!UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new PermissionDeniedException("User is not active");
        }
        Set<Role> roles = user.getRoles();
        Role companyRole = roleRepository.findByName(RoleName.COMPANY.name())
                .orElseThrow(() -> new DataNotFoundException("Default role COMPANY not found in Database"));
        roles.remove(companyRole);
        user.setRoles(roles);
        userRepository.save(user);
        return UserResponse.fromUser(user);
    }

    @Override
    @Transactional
    public CandidateProfileResponse getMyProfile() {
        User user = getAuthenticatedUser();
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    CandidateProfile newProfile = CandidateProfile.builder()
                            .user(user)
                            .build();
                    return candidateProfileRepository.save(newProfile);
                });
        return buildCandidateProfileResponse(profile);
    }

    @Override
    @Transactional
    public CandidateProfileResponse updateMyProfile(CandidateProfileUpdateRequest request) {
        User user = getAuthenticatedUser();
        CandidateProfile profile = candidateProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> CandidateProfile.builder().user(user).build());

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
            userRepository.save(user);
        }
        if (request.getPhoneNumber() != null)
            profile.setPhoneNumber(request.getPhoneNumber());
        if (request.getDateOfBirth() != null)
            profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) {
            String gender = request.getGender().trim();
            profile.setGender(gender.isEmpty() ? null : gender);
        }
        if (request.getAddress() != null)
            profile.setAddress(request.getAddress());
        if (request.getBio() != null)
            profile.setBio(request.getBio());
        if (request.getSkills() != null)
            profile.setSkills(request.getSkills());
        if (request.getExperience() != null)
            profile.setExperience(request.getExperience());
        if (request.getEducation() != null)
            profile.setEducation(request.getEducation());
        if (request.getGithubUrl() != null)
            profile.setGithubUrl(request.getGithubUrl());
        if (request.getLinkedinUrl() != null)
            profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getPortfolioUrl() != null)
            profile.setPortfolioUrl(request.getPortfolioUrl());
        if (request.getCvFileUrl() != null)
            profile.setCvFileUrl(request.getCvFileUrl());

        CandidateProfile saved = candidateProfileRepository.save(profile);
        if (request.getSkills() != null) {
            syncSkills(saved, request.getSkills());
        }
        if (request.getExperience() != null) {
            syncExperiences(saved, request.getExperience());
        }
        if (request.getEducation() != null) {
            syncEducations(saved, request.getEducation());
        }
        return buildCandidateProfileResponse(saved);
    }

    private CandidateProfileResponse buildCandidateProfileResponse(CandidateProfile profile) {
        String skills = serializeSkills(profile);
        String experience = serializeExperiences(profile);
        String education = serializeEducations(profile);
        return CandidateProfileResponse.fromEntity(profile, skills, experience, education);
    }

    private void syncSkills(CandidateProfile profile, String rawSkills) {
        List<String> skillNames = parseStringArray(rawSkills, "skills");
        candidateProfileSkillRepository.deleteByCandidateProfileId(profile.getId());

        List<CandidateProfileSkill> skills = new ArrayList<>();
        for (int i = 0; i < skillNames.size(); i++) {
            skills.add(CandidateProfileSkill.builder()
                    .candidateProfile(profile)
                    .skillName(skillNames.get(i))
                    .displayOrder(i)
                    .build());
        }
        candidateProfileSkillRepository.saveAll(skills);
    }

    private void syncExperiences(CandidateProfile profile, String rawExperience) {
        List<String> experienceItems = parseObjectArray(rawExperience, "experience");
        candidateProfileExperienceRepository.deleteByCandidateProfileId(profile.getId());

        List<CandidateProfileExperience> experiences = new ArrayList<>();
        for (int i = 0; i < experienceItems.size(); i++) {
            experiences.add(CandidateProfileExperience.builder()
                    .candidateProfile(profile)
                    .experienceData(experienceItems.get(i))
                    .displayOrder(i)
                    .build());
        }
        candidateProfileExperienceRepository.saveAll(experiences);
    }

    private void syncEducations(CandidateProfile profile, String rawEducation) {
        List<String> educationItems = parseObjectArray(rawEducation, "education");
        candidateProfileEducationRepository.deleteByCandidateProfileId(profile.getId());

        List<CandidateProfileEducation> educations = new ArrayList<>();
        for (int i = 0; i < educationItems.size(); i++) {
            educations.add(CandidateProfileEducation.builder()
                    .candidateProfile(profile)
                    .educationData(educationItems.get(i))
                    .displayOrder(i)
                    .build());
        }
        candidateProfileEducationRepository.saveAll(educations);
    }

    private List<String> parseStringArray(String rawValue, String fieldName) {
        JsonNode root = parseArrayNode(rawValue, fieldName);
        Set<String> deduplicated = new LinkedHashSet<>();
        for (JsonNode item : root) {
            if (!item.isTextual() || item.asText().isBlank()) {
                throw new InvalidBodyException(fieldName + " must be a JSON array of non-blank strings");
            }
            deduplicated.add(item.asText().trim());
        }
        return new ArrayList<>(deduplicated);
    }

    private List<String> parseObjectArray(String rawValue, String fieldName) {
        JsonNode root = parseArrayNode(rawValue, fieldName);
        List<String> values = new ArrayList<>();
        for (JsonNode item : root) {
            if (!item.isObject()) {
                throw new InvalidBodyException(fieldName + " must be a JSON array of objects");
            }
            values.add(writeJson(item, fieldName));
        }
        return values;
    }

    private JsonNode parseArrayNode(String rawValue, String fieldName) {
        if (rawValue == null || rawValue.isBlank()) {
            try {
                return objectMapper.readTree("[]");
            } catch (JsonProcessingException e) {
                throw new InvalidBodyException("Invalid " + fieldName + " JSON");
            }
        }
        try {
            JsonNode root = objectMapper.readTree(rawValue);
            if (!root.isArray()) {
                throw new InvalidBodyException(fieldName + " must be a JSON array");
            }
            return root;
        } catch (JsonProcessingException e) {
            throw new InvalidBodyException("Invalid " + fieldName + " JSON");
        }
    }

    private String serializeSkills(CandidateProfile profile) {
        List<CandidateProfileSkill> skills = candidateProfileSkillRepository
                .findByCandidateProfileIdOrderByDisplayOrderAscIdAsc(profile.getId());
        if (skills.isEmpty()) {
            return profile.getSkills();
        }
        List<String> names = skills.stream()
                .map(CandidateProfileSkill::getSkillName)
                .toList();
        return writeJson(names, "skills");
    }

    private String serializeExperiences(CandidateProfile profile) {
        List<CandidateProfileExperience> experiences = candidateProfileExperienceRepository
                .findByCandidateProfileIdOrderByDisplayOrderAscIdAsc(profile.getId());
        if (experiences.isEmpty()) {
            return profile.getExperience();
        }
        List<JsonNode> values = experiences.stream()
                .map(item -> readStoredJson(item.getExperienceData(), "experience"))
                .toList();
        return writeJson(values, "experience");
    }

    private String serializeEducations(CandidateProfile profile) {
        List<CandidateProfileEducation> educations = candidateProfileEducationRepository
                .findByCandidateProfileIdOrderByDisplayOrderAscIdAsc(profile.getId());
        if (educations.isEmpty()) {
            return profile.getEducation();
        }
        List<JsonNode> values = educations.stream()
                .map(item -> readStoredJson(item.getEducationData(), "education"))
                .toList();
        return writeJson(values, "education");
    }

    private JsonNode readStoredJson(String rawValue, String fieldName) {
        try {
            return objectMapper.readTree(rawValue);
        } catch (JsonProcessingException e) {
            throw new InvalidBodyException("Invalid stored " + fieldName + " JSON");
        }
    }

    private String writeJson(Object value, String fieldName) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new InvalidBodyException("Invalid " + fieldName + " JSON");
        }
    }


    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new PermissionDeniedException("User is not logged in");
        }
        String email = authentication.getName();
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new DataNotFoundException("Current user not found"));

        if (!UserStatus.ACTIVE.equals(user.getStatus())) {
            throw new PermissionDeniedException("User account is not active");
        }
        return user;
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
