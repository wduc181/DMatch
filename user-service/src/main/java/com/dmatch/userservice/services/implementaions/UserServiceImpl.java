package com.dmatch.userservice.services.implementaions;

import com.dmatch.userservice.commons.UserStatus;
import com.dmatch.userservice.dtos.UserCreateDTO;
import com.dmatch.userservice.entities.Role;
import com.dmatch.userservice.entities.User;
import com.dmatch.userservice.exceptions.DataNotFoundException;
import com.dmatch.userservice.exceptions.InvalidBodyException;
import com.dmatch.userservice.exceptions.PermissionDeniedException;
import com.dmatch.userservice.reponses.InternalUserResponse;
import com.dmatch.userservice.reponses.UserResponse;
import com.dmatch.userservice.repositories.RoleRepository;
import com.dmatch.userservice.repositories.UserRepository;
import com.dmatch.userservice.services.interfaces.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
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
    public InternalUserResponse createUser(UserCreateDTO userCreateDTO) {
        String email = userCreateDTO.getEmail();
        if (userRepository.existsByEmail(email)) {
            throw new InvalidBodyException("Email already exists");
        }
        Role role = roleRepository.findByName(userCreateDTO.getRole())
                .orElseThrow(() -> new PermissionDeniedException("Role not found"));
        Set<Role> roles = new HashSet<>();
        roles.add(role);

        User user = User.builder()
                .email(userCreateDTO.getEmail())
                .password(userCreateDTO.getPassword())
                .fullName(userCreateDTO.getFullName())
                .status(UserStatus.ACTIVE)
                .roles(roles)
                .build();

        userRepository.save(user);
        return InternalUserResponse.fromUser(user);
    }

    @Override
    public InternalUserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("User not found with id: " + id));
        return InternalUserResponse.fromUser(user);
    }

    @Override
    public InternalUserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new DataNotFoundException("User not found with email: " + email));
        return InternalUserResponse.fromUser(user);
    }

    @Override
    public UserResponse getCurrentUser() {
        throw new RuntimeException("Method logic not implemented yet");
    }

    @Override
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserResponse::fromUser).toList();
    }

    @Override
    public UserResponse changeUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (user.getStatus().equals(UserStatus.ACTIVE)) {
            user.setStatus(UserStatus.BANNED);
        } else {
            user.setStatus(UserStatus.ACTIVE);
        }
        User updatedUser = userRepository.save(user);
        return UserResponse.fromUser(updatedUser);
    }
}
