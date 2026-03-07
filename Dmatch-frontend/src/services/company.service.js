import axiosClient from './axiosClient';

/**
 * Lấy danh sách companies có hỗ trợ filter + pagination.
 * @param {Object} params - { page, limit, keyword, location, min_size, max_size }
 */
export const getCompanies = (params = {}) => {
     return axiosClient.get('/api/v1/companies', { params });
};

/**
 * Lấy chi tiết company theo ID.
 * @param {number} id
 */
export const getCompanyById = (id) => {
     return axiosClient.get(`/api/v1/companies/${id}`);
};

/**
 * Lấy company theo owner ID (cho recruiter).
 * @param {number} ownerId
 */
export const getCompanyByOwnerId = (ownerId) => {
     return axiosClient.get(`/api/v1/companies/by-owner/${ownerId}`);
};

/**
 * Tạo company mới.
 * @param {Object} data - CompanyCreateRequest
 */
export const createCompany = (data) => {
     return axiosClient.post('/api/v1/companies', data);
};

/**
 * Cập nhật company theo owner ID.
 * @param {number} ownerId
 * @param {Object} data - CompanyUpdateRequest
 */
export const updateCompany = (ownerId, data) => {
     return axiosClient.put(`/api/v1/companies/by-owner/${ownerId}`, data);
};

/**
 * Xóa company theo owner ID.
 * @param {number} ownerId
 */
export const deleteCompany = (ownerId) => {
     return axiosClient.delete(`/api/v1/companies/by-owner/${ownerId}`);
};
