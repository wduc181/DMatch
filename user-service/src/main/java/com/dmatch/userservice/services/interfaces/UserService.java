package com.dmatch.userservice.services.interfaces;

import com.dmatch.userservice.dtos.UserCreateRequest;
import com.dmatch.userservice.dtos.InternalUserResponse;
import com.dmatch.userservice.dtos.UserResponse;

import java.util.List;

public interface    UserService {
    UserResponse createUser(UserCreateRequest userCreateRequest);
    UserResponse getUserById(Long id);
    InternalUserResponse getUserByEmail(String email);
    UserResponse getCurrentUser();
    List<UserResponse> getAllUsers();
    UserResponse changeUserStatus(Long id);
    UserResponse addCompanyRoleToUser(Long userId);
}
