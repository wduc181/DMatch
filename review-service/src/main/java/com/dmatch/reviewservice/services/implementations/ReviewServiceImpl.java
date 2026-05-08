package com.dmatch.reviewservice.services.implementations;

import com.dmatch.reviewservice.clients.CompanyServiceClient;
import com.dmatch.reviewservice.clients.JobServiceClient;
import com.dmatch.reviewservice.clients.UserServiceClient;
import com.dmatch.reviewservice.commons.ApiResponse;
import com.dmatch.reviewservice.commons.ReviewStatus;
import com.dmatch.reviewservice.dtos.CompanySummaryResponse;
import com.dmatch.reviewservice.dtos.JobSummaryResponse;
import com.dmatch.reviewservice.dtos.ReviewCreateRequest;
import com.dmatch.reviewservice.dtos.ReviewResponse;
import com.dmatch.reviewservice.dtos.ReviewSearchRequest;
import com.dmatch.reviewservice.dtos.ReviewStatusUpdateRequest;
import com.dmatch.reviewservice.dtos.ReviewSummaryResponse;
import com.dmatch.reviewservice.dtos.ReviewUpdateRequest;
import com.dmatch.reviewservice.dtos.UserSummaryResponse;
import com.dmatch.reviewservice.entities.Review;
import com.dmatch.reviewservice.exceptions.DataNotFoundException;
import com.dmatch.reviewservice.exceptions.InvalidBodyException;
import com.dmatch.reviewservice.exceptions.InvalidParamException;
import com.dmatch.reviewservice.exceptions.PermissionDeniedException;
import com.dmatch.reviewservice.repositories.ReviewRepository;
import com.dmatch.reviewservice.services.interfaces.ReviewService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewServiceImpl implements ReviewService {

	private final ReviewRepository reviewRepository;
	private final CompanyServiceClient companyServiceClient;
	private final JobServiceClient jobServiceClient;
	private final UserServiceClient userServiceClient;
	private final ReviewEventPublisher reviewEventPublisher;

	@Override
	@Transactional
	public ReviewResponse createReview(ReviewCreateRequest request) {
		validateTarget(request.getCompanyId(), request.getJobId());
		validateUserExists(request.getUserId());
		validateOwnerAccess(request.getUserId());

		if (request.getCompanyId() != null) {
			validateCompanyExists(request.getCompanyId());
			if (reviewRepository.existsByUserIdAndCompanyId(request.getUserId(), request.getCompanyId())) {
				throw new InvalidBodyException("User has already reviewed this company");
			}
		}

		if (request.getJobId() != null) {
			validateJobExists(request.getJobId());
			if (reviewRepository.existsByUserIdAndJobId(request.getUserId(), request.getJobId())) {
				throw new InvalidBodyException("User has already reviewed this job");
			}
		}

		Review review = Review.builder()
				.userId(request.getUserId())
				.companyId(request.getCompanyId())
				.jobId(request.getJobId())
				.rating(request.getRating() == null ? null : request.getRating().shortValue())
				.comment(request.getComment())
				.status(ReviewStatus.ACTIVE.name())
				.build();

		Review saved = reviewRepository.save(review);

		try {
			reviewEventPublisher.publishReviewCreated(
					saved.getId(), saved.getUserId(), saved.getCompanyId(),
					saved.getJobId(), saved.getRating() == null ? null : saved.getRating().intValue());
		} catch (Exception e) {
			log.warn("Failed to publish review-created event for reviewId={}: {}", saved.getId(), e.getMessage());
		}

		return toResponse(saved);
	}

	@Override
	public ReviewResponse getReviewById(Long id) {
		Review review = reviewRepository.findById(id)
				.orElseThrow(() -> new DataNotFoundException("Review not found"));
		return toResponse(review);
	}

	@Override
	public Page<ReviewResponse> getReviews(ReviewSearchRequest request) {
		Specification<Review> specification = buildSpecification(request);
		Pageable pageable = buildPageable(request);
		return reviewRepository.findAll(specification, pageable)
				.map(this::toResponse);
	}

	@Override
	@Transactional
	public ReviewResponse updateReview(Long id, ReviewUpdateRequest request) {
		Review review = reviewRepository.findById(id)
				.orElseThrow(() -> new DataNotFoundException("Review not found"));

		validateOwnerAccess(review.getUserId());

		if (request.getRating() != null) {
			review.setRating(request.getRating().shortValue());
		}

		if (request.getComment() != null) {
			review.setComment(request.getComment());
		}
		review.setStatus(ReviewStatus.CHANGED.name());

		Review saved = reviewRepository.save(review);
		return toResponse(saved);
	}

	@Override
	@Transactional
	public ReviewResponse updateReviewStatus(Long id, ReviewStatusUpdateRequest request) {
		Review review = reviewRepository.findById(id)
				.orElseThrow(() -> new DataNotFoundException("Review not found"));

		review.setStatus(normalizeReviewStatus(request.getStatus()));
		Review saved = reviewRepository.save(review);
		return toResponse(saved);
	}

	@Override
	@Transactional
	public void deleteReview(Long id) {
		Review review = reviewRepository.findById(id)
				.orElseThrow(() -> new DataNotFoundException("Review not found"));

		validateOwnerAccess(review.getUserId());

		reviewRepository.delete(review);
	}

	@Override
	public ReviewSummaryResponse getReviewSummary(Long companyId, Long jobId) {
		validateSummaryTarget(companyId, jobId);

		if (companyId != null) {
			validateCompanyExists(companyId);
			Double avg = reviewRepository.getAverageRatingByCompanyIdAndStatus(companyId,
					ReviewStatus.ACTIVE.name());
			long total = reviewRepository.countByCompanyIdAndStatus(companyId, ReviewStatus.ACTIVE.name());
			return ReviewSummaryResponse.builder()
					.companyId(companyId)
					.averageRating(avg == null ? 0.0 : avg)
					.totalReviews(total)
					.build();
		}

		validateJobExists(jobId);
		Double avg = reviewRepository.getAverageRatingByJobIdAndStatus(jobId, ReviewStatus.ACTIVE.name());
		long total = reviewRepository.countByJobIdAndStatus(jobId, ReviewStatus.ACTIVE.name());
		return ReviewSummaryResponse.builder()
				.jobId(jobId)
				.averageRating(avg == null ? 0.0 : avg)
				.totalReviews(total)
				.build();
	}

	private void validateTarget(Long companyId, Long jobId) {
		boolean hasCompany = companyId != null;
		boolean hasJob = jobId != null;
		if ((hasCompany && hasJob) || (!hasCompany && !hasJob)) {
			throw new InvalidBodyException("Exactly one of company_id or job_id must be provided");
		}
	}

	private void validateSummaryTarget(Long companyId, Long jobId) {
		boolean hasCompany = companyId != null;
		boolean hasJob = jobId != null;
		if ((hasCompany && hasJob) || (!hasCompany && !hasJob)) {
			throw new InvalidParamException("Exactly one of company_id or job_id must be provided");
		}
	}

	private Pageable buildPageable(ReviewSearchRequest request) {
		int page = request.getPage() == null ? 1 : request.getPage();
		int limit = request.getLimit() == null ? 10 : request.getLimit();

		if (page < 1 || limit < 1) {
			throw new InvalidParamException("Page and limit must be positive");
		}

		String sortField = mapSortField(request.getSortBy());
		Sort.Direction direction = "asc".equalsIgnoreCase(request.getSortDir())
				? Sort.Direction.ASC
				: Sort.Direction.DESC;

		return PageRequest.of(page - 1, limit, Sort.by(direction, sortField));
	}

	private String mapSortField(String sortBy) {
		if (sortBy == null || sortBy.isBlank()) {
			return "createdAt";
		}

		String normalized = sortBy.trim().toLowerCase(Locale.ROOT);
		return switch (normalized) {
			case "created_at" -> "createdAt";
			case "updated_at" -> "updatedAt";
			case "rating" -> "rating";
			case "status" -> "status";
			case "id" -> "id";
			default -> throw new InvalidParamException("Unsupported sort_by: " + sortBy);
		};
	}

	private Specification<Review> buildSpecification(ReviewSearchRequest request) {
		Specification<Review> specification = Specification.where(null);

		if (request.getCompanyId() != null) {
			specification = specification
					.and((root, query, cb) -> cb.equal(root.get("companyId"), request.getCompanyId()));
		}

		if (request.getJobId() != null) {
			specification = specification.and((root, query, cb) -> cb.equal(root.get("jobId"), request.getJobId()));
		}

		if (request.getUserId() != null) {
			specification = specification
					.and((root, query, cb) -> cb.equal(root.get("userId"), request.getUserId()));
		}

		if (request.getRating() != null) {
			specification = specification
					.and((root, query, cb) -> cb.equal(root.get("rating"), request.getRating().shortValue()));
		}

		if (request.getStatus() != null && !request.getStatus().isBlank()) {
			specification = specification
					.and((root, query, cb) -> cb.equal(root.get("status"), request.getStatus()));
		}

		return specification;
	}

	private String normalizeReviewStatus(String status) {
		if (status == null || status.isBlank()) {
			throw new InvalidParamException("status is required");
		}
		String normalized = status.trim().toUpperCase(Locale.ROOT);
		try {
			return ReviewStatus.valueOf(normalized).name();
		} catch (IllegalArgumentException e) {
			throw new InvalidParamException("Unsupported review status: " + status);
		}
	}

	private ReviewResponse toResponse(Review review) {
		return ReviewResponse.builder()
				.id(review.getId())
				.userId(review.getUserId())
				.companyId(review.getCompanyId())
				.jobId(review.getJobId())
				.rating(review.getRating() == null ? null : review.getRating().intValue())
				.comment(review.getComment())
				.status(review.getStatus())
				.createdAt(review.getCreatedAt())
				.updatedAt(review.getUpdatedAt())
				.build();
	}

	private void validateUserExists(Long userId) {
		if (userId == null) {
			throw new InvalidParamException("user_id is required");
		}
		try {
			ApiResponse<UserSummaryResponse> response = userServiceClient.getUserById(userId);
			if (response == null || response.getData() == null) {
				throw new DataNotFoundException("User not found");
			}
		} catch (Exception e) {
			throw new DataNotFoundException("User not found");
		}
	}

	private void validateCompanyExists(Long companyId) {
		try {
			ApiResponse<CompanySummaryResponse> response = companyServiceClient.getCompanyById(companyId);
			if (response == null || response.getData() == null) {
				throw new DataNotFoundException("Company not found");
			}
		} catch (Exception e) {
			throw new DataNotFoundException("Company not found");
		}
	}

	private void validateJobExists(Long jobId) {
		try {
			ApiResponse<JobSummaryResponse> response = jobServiceClient.getJobById(jobId);
			if (response == null || response.getData() == null) {
				throw new DataNotFoundException("Job not found");
			}
		} catch (Exception e) {
			throw new DataNotFoundException("Job not found");
		}
	}

	private void validateOwnerAccess(Long reviewOwnerId) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !authentication.isAuthenticated()) {
			throw new PermissionDeniedException("User not authenticated");
		}

		boolean isAdmin = authentication.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.anyMatch(role -> role.equals("ROLE_ADMIN"));
		if (isAdmin) {
			return;
		}

		String currentEmail = authentication.getName();
		try {
			ApiResponse<UserSummaryResponse> response = userServiceClient.getUserByEmail(currentEmail);
			if (response == null || response.getData() == null) {
				throw new PermissionDeniedException("Cannot verify user identity");
			}

			Long currentUserId = response.getData().getId();
			if (!reviewOwnerId.equals(currentUserId)) {
				throw new PermissionDeniedException("You don't have permission to access this review");
			}
		} catch (PermissionDeniedException e) {
			throw e;
		} catch (Exception e) {
			throw new PermissionDeniedException("Cannot verify user identity");
		}
	}
}
