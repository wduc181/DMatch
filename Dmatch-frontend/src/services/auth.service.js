import axiosClient from './axiosClient';

/**
 * Auth API service — gọi trực tiếp endpoint qua API Gateway.
 *
 * Endpoints (từ api-gateway routes):
 *   POST /api/v1/auth/register → AuthRegisterRequest → ApiResponse<UserResponse>
 *   POST /api/v1/auth/login    → AuthLoginRequest   → ApiResponse<AuthResponse>
 */

/**
 * Đăng ký tài khoản mới.
 * @param {{ email: string, fullName: string, password: string }} payload
 * @returns {Promise<{ message: string, data: UserResponse }>}
 */
export const registerApi = async (payload) => {
     const response = await axiosClient.post('/api/v1/auth/register', payload);
     return response.data; // ApiResponse<UserResponse>
};

/**
 * Đăng nhập.
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ message: string, data: AuthResponse }>}
 */
export const loginApi = async (payload) => {
     const response = await axiosClient.post('/api/v1/auth/login', payload);
     return response.data; // ApiResponse<AuthResponse>
};

/**
 * Lấy thông tin user hiện tại (cần Bearer token).
 * @returns {Promise<{ message: string, data: UserResponse }>}
 */
export const getMeApi = async () => {
     const response = await axiosClient.get('/api/v1/users/me');
     return response.data; // ApiResponse<UserResponse>
};

