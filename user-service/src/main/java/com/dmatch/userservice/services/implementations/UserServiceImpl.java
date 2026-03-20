package com.dmatch.userservice.services.implementations;

import com.dmatch.userservice.commons.RoleName;
import com.dmatch.userservice.commons.UserStatus;
import com.dmatch.userservice.dtos.CandidateProfileResponse;
import com.dmatch.userservice.dtos.CandidateProfileUpdateRequest;
import com.dmatch.userservice.dtos.UserCreateRequest;
import com.dmatch.userservice.entities.CandidateProfile;
import com.dmatch.userservice.entities.Role;
import com.dmatch.userservice.entities.User;
import com.dmatch.userservice.exceptions.DataNotFoundException;
import com.dmatch.userservice.exceptions.InvalidBodyException;
import com.dmatch.userservice.exceptions.PermissionDeniedException;
import com.dmatch.userservice.dtos.InternalUserResponse;
import com.dmatch.userservice.dtos.UserResponse;
import com.dmatch.userservice.repositories.CandidateProfileRepository;
import com.dmatch.userservice.repositories.RoleRepository;
import com.dmatch.userservice.repositories.UserRepository;
import com.dmatch.userservice.services.interfaces.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
        return CandidateProfileResponse.fromEntity(profile);
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
        if (request.getGender() != null)
            profile.setGender(request.getGender());
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
        return CandidateProfileResponse.fromEntity(saved);
    }


    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new PermissionDeniedException("User is not logged in");
        }
        String email = authentication.getName();
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new DataNotFoundException("Current user not found"));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
