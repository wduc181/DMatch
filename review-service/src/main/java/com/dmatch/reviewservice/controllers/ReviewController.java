package com.dmatch.reviewservice.controllers;

import com.dmatch.reviewservice.commons.ApiResponse;
import com.dmatch.reviewservice.dtos.ReviewCreateRequest;
import com.dmatch.reviewservice.dtos.ReviewResponse;
import com.dmatch.reviewservice.dtos.ReviewSearchRequest;
import com.dmatch.reviewservice.dtos.ReviewStatusUpdateRequest;
import com.dmatch.reviewservice.dtos.ReviewSummaryResponse;
import com.dmatch.reviewservice.dtos.ReviewUpdateRequest;
import com.dmatch.reviewservice.services.interfaces.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${app.api-prefix}/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
	    @Valid @RequestBody ReviewCreateRequest request
    ) {
		ReviewResponse response = reviewService.createReview(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<ReviewResponse>builder()
				.message("Created review successfully")
				.data(response)
				.build()
		);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewById(
	    @PathVariable Long id
    ) {
		ReviewResponse response = reviewService.getReviewById(id);
		return ResponseEntity.ok(ApiResponse.<ReviewResponse>builder()
				.message("Got review successfully")
				.data(response)
				.build()
		);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getReviews(
	    @RequestParam(value = "company_id", required = false) Long companyId,
	    @RequestParam(value = "job_id", required = false) Long jobId,
	    @RequestParam(value = "user_id", required = false) Long userId,
	    @RequestParam(value = "rating", required = false) Integer rating,
	    @RequestParam(value = "status", required = false) String status,
	    @RequestParam(value = "page", defaultValue = "1") Integer page,
	    @RequestParam(value = "limit", defaultValue = "10") Integer limit,
	    @RequestParam(value = "sort_by", defaultValue = "created_at") String sortBy,
	    @RequestParam(value = "sort_dir", defaultValue = "desc") String sortDir
    ) {
		ReviewSearchRequest request = new ReviewSearchRequest();
		request.setCompanyId(companyId);
		request.setJobId(jobId);
		request.setUserId(userId);
		request.setRating(rating);
		request.setStatus(status);
		request.setPage(page);
		request.setLimit(limit);
		request.setSortBy(sortBy);
		request.setSortDir(sortDir);

		Page<ReviewResponse> reviews = reviewService.getReviews(request);
		return ResponseEntity.ok(ApiResponse.<Page<ReviewResponse>>builder()
				.message("Got reviews successfully")
				.data(reviews)
				.build()
		);
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
	    @PathVariable Long id,
	    @Valid @RequestBody ReviewUpdateRequest request
    ) {
		ReviewResponse response = reviewService.updateReview(id, request);
		return ResponseEntity.ok(ApiResponse.<ReviewResponse>builder()
				.message("Updated review successfully")
				.data(response)
				.build()
		);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReviewStatus(
	    @PathVariable Long id,
	    @Valid @RequestBody ReviewStatusUpdateRequest request
    ) {
		ReviewResponse response = reviewService.updateReviewStatus(id, request);
		return ResponseEntity.ok(ApiResponse.<ReviewResponse>builder()
				.message("Updated review status successfully")
				.data(response)
				.build()
		);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
	    @PathVariable Long id
    ) {
		reviewService.deleteReview(id);
		return ResponseEntity.ok(ApiResponse.<Void>builder()
				.message("Deleted review successfully")
				.data(null)
				.build()
		);
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<ReviewSummaryResponse>> getReviewSummary(
	    @RequestParam(value = "company_id", required = false) Long companyId,
	    @RequestParam(value = "job_id", required = false) Long jobId
    ) {
		ReviewSummaryResponse response = reviewService.getReviewSummary(companyId, jobId);
		return ResponseEntity.ok(ApiResponse.<ReviewSummaryResponse>builder()
				.message("Got review summary successfully")
				.data(response)
				.build()
		);
    }
}
