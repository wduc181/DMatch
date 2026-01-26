package com.dmatch.companyservice.repositories;

import com.dmatch.companyservice.entities.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    boolean existsByOwnerId(Long ownerId);
    Optional<Company> findByOwnerId(Long ownerId);
    Page<Company> findByNameContainingIgnoreCase(String name, Pageable pageable);
}