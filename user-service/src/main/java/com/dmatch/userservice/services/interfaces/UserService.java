package com.dmatch.userservice.services.interfaces;

import com.dmatch.userservice.dtos.UserCreateDTO;
import com.dmatch.userservice.reponses.InternalUserResponse;
import com.dmatch.userservice.reponses.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserCreateDTO userCreateDTO);
    UserResponse getUserById(Long id);
    InternalUserResponse getUserByEmail(String email);
    UserResponse getCurrentUser();
    List<UserResponse> getAllUsers();
    UserResponse changeUserStatus(Long id);
}
