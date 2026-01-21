package com.dmatch.authservice.dtos;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthRegisterRequest {
    private String email;
    private String fullName;
    private String password;
}
