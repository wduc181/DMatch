package com.dmatch.jobservice.repositories;

import com.dmatch.jobservice.dtos.JobSearchRequest;
import com.dmatch.jobservice.entities.Job;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * Utility class xây dựng Specification<Job> từ JobSearchRequest.
 * Hỗ trợ kết hợp nhiều filter cùng lúc thay vì chuỗi if/else.
 */
public final class JobSpecification {

     private JobSpecification() {
          // Prevent instantiation
     }

     /**
      * Build Specification từ tất cả filter fields trong request.
      * Các filter kết hợp bằng AND.
      */
     public static Specification<Job> fromSearchRequest(JobSearchRequest request) {
          return (root, query, cb) -> {
               List<Predicate> predicates = new ArrayList<>();

               // Keyword: tìm theo title (LIKE, case-insensitive)
               if (request.getKeyword() != null && !request.getKeyword().isBlank()) {
                    predicates.add(cb.like(
                              cb.lower(root.get("title")),
                              "%" + request.getKeyword().toLowerCase() + "%"));
               }

               // Location filter (LIKE, case-insensitive)
               if (request.getLocation() != null && !request.getLocation().isBlank()) {
                    predicates.add(cb.like(
                              cb.lower(root.get("location")),
                              "%" + request.getLocation().toLowerCase() + "%"));
               }

               // Job type filter (exact match)
               if (request.getJobType() != null && !request.getJobType().isBlank()) {
                    predicates.add(cb.equal(root.get("jobType"), request.getJobType()));
               }

               // Status filter (exact match)
               if (request.getStatus() != null && !request.getStatus().isBlank()) {
                    predicates.add(cb.equal(root.get("status"), request.getStatus()));
               }

               // Company ID filter
               if (request.getCompanyId() != null) {
                    predicates.add(cb.equal(root.get("companyId"), request.getCompanyId()));
               }

               // Job level filter
               if (request.getJobLevelId() != null) {
                    predicates.add(cb.equal(root.get("jobLevel").get("id"), request.getJobLevelId()));
               }

               // Category IDs filter (job phải thuộc ít nhất 1 trong các categories)
               if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
                    var categoriesJoin = root.join("categories", JoinType.INNER);
                    predicates.add(categoriesJoin.get("id").in(request.getCategoryIds()));
                    // Tránh duplicate khi join
                    query.distinct(true);
               }

               // Salary range filter (overlap logic: job.salary_max >= filter.min AND
               // job.salary_min <= filter.max)
               if (request.getSalaryMin() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("salaryMax"), request.getSalaryMin()));
               }
               if (request.getSalaryMax() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("salaryMin"), request.getSalaryMax()));
               }

               return cb.and(predicates.toArray(new Predicate[0]));
          };
     }
}
