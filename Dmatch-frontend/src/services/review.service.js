import axiosClient from './axiosClient';

/**
 * Review API service — quản lý đánh giá công ty/công việc.
 *
 * Endpoints (qua API Gateway):
 *   POST   /api/v1/reviews            → Tạo review mới
 *   GET    /api/v1/reviews/{id}       → Lấy review theo ID
 *   GET    /api/v1/reviews            → Lấy danh sách reviews (filter + pagination)
 *   PUT    /api/v1/reviews/{id}       → Cập nhật review
 *   PATCH  /api/v1/reviews/{id}/status → Cập nhật trạng thái review (ADMIN)
 *   DELETE /api/v1/reviews/{id}       → Xóa review
 *   GET    /api/v1/reviews/summary    → Lấy thống kê đánh giá
 */

/**
 * Tạo review mới.
 * @param {Object} data - ReviewCreateRequest { company_id, job_id?, rating, title, content }
 */
export const createReview = (data) => {
     return axiosClient.post('/api/v1/reviews', data);
};

/**
 * Lấy review theo ID.
 * @param {number} id
 */
export const getReviewById = (id) => {
     return axiosClient.get(`/api/v1/reviews/${id}`);
};

/**
 * Lấy danh sách reviews có filter + pagination.
 * @param {Object} params - { company_id, job_id, user_id, rating, status, page, limit, sort_by, sort_dir }
 */
export const getReviews = (params = {}) => {
     return axiosClient.get('/api/v1/reviews', { params });
};

/**
 * Cập nhật review.
 * @param {number} id
 * @param {Object} data - ReviewUpdateRequest { rating, title, content }
 */
export const updateReview = (id, data) => {
     return axiosClient.put(`/api/v1/reviews/${id}`, data);
};

/**
 * Cập nhật trạng thái review (ADMIN only).
 * @param {number} id
 * @param {Object} data - ReviewStatusUpdateRequest { status }
 */
export const updateReviewStatus = (id, data) => {
     return axiosClient.patch(`/api/v1/reviews/${id}/status`, data);
};

/**
 * Xóa review.
 * @param {number} id
 */
export const deleteReview = (id) => {
     return axiosClient.delete(`/api/v1/reviews/${id}`);
};

/**
 * Lấy thống kê đánh giá cho company hoặc job.
 * @param {Object} params - { company_id?, job_id? }
 */
export const getReviewSummary = (params = {}) => {
     return axiosClient.get('/api/v1/reviews/summary', { params });
};
