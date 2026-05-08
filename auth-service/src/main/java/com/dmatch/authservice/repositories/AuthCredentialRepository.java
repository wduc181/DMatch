package com.dmatch.authservice.repositories;

import com.dmatch.authservice.entities.AuthCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthCredentialRepository extends JpaRepository<AuthCredential, Long> {
    boolean existsByEmailIgnoreCase(String email);

    Optional<AuthCredential> findByEmailIgnoreCase(String email);
}