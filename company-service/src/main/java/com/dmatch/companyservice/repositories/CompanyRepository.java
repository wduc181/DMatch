package com.dmatch.companyservice.repositories;

import com.dmatch.companyservice.entities.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    boolean existsByOwnerId(Long ownerId);
    Optional<Company> findByOwnerId(Long ownerId);
    Page<Company> findByNameContainingIgnoreCase(String name, Pageable pageable);

    /**
     * Tìm kiếm + lọc companies với nhiều tiêu chí (keyword, location, employee size).
     * Dùng JPQL với điều kiện optional (null/empty = bỏ qua filter đó).
     * Sử dụng COALESCE thay vì IS NULL để tránh lỗi PostgreSQL "function lower(bytea) does not exist".
     */
    @Query("SELECT c FROM Company c WHERE " +
            "(COALESCE(:keyword, '') = '' OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "    OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (COALESCE(:location, '') = '' OR LOWER(c.address) LIKE LOWER(CONCAT('%', :location, '%'))) " +
            "AND (:minSize IS NULL OR c.employeeSize >= :minSize) " +
            "AND (:maxSize IS NULL OR c.employeeSize <= :maxSize)")
    Page<Company> searchCompanies(
            @Param("keyword") String keyword,
            @Param("location") String location,
            @Param("minSize") Integer minSize,
            @Param("maxSize") Integer maxSize,
            Pageable pageable
    );
}