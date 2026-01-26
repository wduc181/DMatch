package com.dmatch.userservice.services.implementations;

import com.dmatch.userservice.commons.RoleName;
import com.dmatch.userservice.commons.UserStatus;
import com.dmatch.userservice.dtos.UserCreateRequest;
import com.dmatch.userservice.entities.Role;
import com.dmatch.userservice.entities.User;
import com.dmatch.userservice.exceptions.DataNotFoundException;
import com.dmatch.userservice.exceptions.InvalidBodyException;
import com.dmatch.userservice.exceptions.PermissionDeniedException;
import com.dmatch.userservice.dtos.InternalUserResponse;
import com.dmatch.userservice.dtos.UserResponse;
import com.dmatch.userservice.repositories.RoleRepository;
import com.dmatch.userservice.repositories.UserRepository;
import com.dmatch.userservice.services.interfaces.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest userCreateRequest) {
        String email = userCreateRequest.getEmail();

        if (userRepository.existsByEmail(email)) {
            throw new InvalidBodyException("Email already exists");
        }
        Role role = roleRepository.findByName(RoleName.USER.name())
                .orElseThrow(() -> new DataNotFoundException("Default role USER not found in Database"));
        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .email(userCreateRequest.getEmail())
                .password(userCreateRequest.getPassword()) // Password đã hash
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
        User user = userRepository.findByEmailIgnoreCase(email)
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
}
