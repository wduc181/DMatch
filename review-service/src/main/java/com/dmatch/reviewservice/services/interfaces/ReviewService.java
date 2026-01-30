package com.dmatch.reviewservice.services.interfaces;

import com.dmatch.reviewservice.dtos.ReviewCreateRequest;
import com.dmatch.reviewservice.dtos.ReviewResponse;
import com.dmatch.reviewservice.dtos.ReviewSearchRequest;
import com.dmatch.reviewservice.dtos.ReviewStatusUpdateRequest;
import com.dmatch.reviewservice.dtos.ReviewSummaryResponse;
import com.dmatch.reviewservice.dtos.ReviewUpdateRequest;
import org.springframework.data.domain.Page;

public interface ReviewService {
	ReviewResponse createReview(ReviewCreateRequest request);

	ReviewResponse getReviewById(Long id);

	Page<ReviewResponse> getReviews(ReviewSearchRequest request);

	ReviewResponse updateReview(Long id, ReviewUpdateRequest request);

	ReviewResponse updateReviewStatus(Long id, ReviewStatusUpdateRequest request);

	void deleteReview(Long id);

	ReviewSummaryResponse getReviewSummary(Long companyId, Long jobId);
}
