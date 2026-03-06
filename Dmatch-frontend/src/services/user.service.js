import axiosClient from './axiosClient';

/**
 * User / Candidate Profile API service.
 *
 * Endpoints (qua API Gateway):
 *   GET  /api/v1/users/me/profile → ApiResponse<CandidateProfileResponse>
 *   PUT  /api/v1/users/me/profile → ApiResponse<CandidateProfileResponse>
 */

/**
 * Lấy profile ứng viên hiện tại.
 * Backend sẽ tự tạo profile rỗng nếu chưa có (lazy creation).
 * @returns {Promise<{ message: string, data: CandidateProfileResponse }>}
 */
export const getMyProfileApi = async () => {
     const response = await axiosClient.get('/api/v1/users/me/profile');
     return response.data;
};

/**
 * Cập nhật profile ứng viên hiện tại.
 * @param {object} payload — CandidateProfileUpdateRequest
 * @returns {Promise<{ message: string, data: CandidateProfileResponse }>}
 */
export const updateMyProfileApi = async (payload) => {
     const response = await axiosClient.put('/api/v1/users/me/profile', payload);
     return response.data;
};
