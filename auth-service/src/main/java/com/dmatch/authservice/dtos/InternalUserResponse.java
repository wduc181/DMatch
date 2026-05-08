package com.dmatch.authservice.dtos;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InternalUserResponse {
    private Long id;
    private String email;
    private String status;
    private List<String> roles;
}
