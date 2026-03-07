import axiosClient from './axiosClient';

/**
 * Lấy danh sách jobs có hỗ trợ filter + sort + pagination.
 * @param {Object} params - { keyword, location, job_type, status, job_level_id,
 *   category_ids, salary_min, salary_max, company_id, sort, page, limit }
 */
export const getJobs = (params = {}) => {
     return axiosClient.get('/api/v1/jobs', { params });
};

/**
 * Lấy chi tiết job theo ID.
 * @param {number} id
 */
export const getJobById = (id) => {
     return axiosClient.get(`/api/v1/jobs/${id}`);
};

/**
 * Lấy jobs theo company ID.
 * @param {number} companyId
 * @param {Object} params - { page, limit }
 */
export const getJobsByCompany = (companyId, params = {}) => {
     return axiosClient.get(`/api/v1/jobs/by-company/${companyId}`, { params });
};

/**
 * Tạo job mới (COMPANY/ADMIN).
 * @param {number} companyId
 * @param {Object} data - JobCreateRequest
 */
export const createJob = (companyId, data) => {
     return axiosClient.post('/api/v1/jobs', data, {
          params: { company_id: companyId },
     });
};

/**
 * Cập nhật job (COMPANY/ADMIN).
 * @param {number} jobId
 * @param {number} companyId
 * @param {Object} data - JobUpdateRequest
 */
export const updateJob = (jobId, companyId, data) => {
     return axiosClient.put(`/api/v1/jobs/${jobId}`, data, {
          params: { company_id: companyId },
     });
};

/**
 * Xóa job (COMPANY/ADMIN).
 * @param {number} jobId
 * @param {number} companyId
 */
export const deleteJob = (jobId, companyId) => {
     return axiosClient.delete(`/api/v1/jobs/${jobId}`, {
          params: { company_id: companyId },
     });
};

/**
 * Thay đổi trạng thái job (COMPANY/ADMIN).
 * @param {number} jobId
 * @param {number} companyId
 * @param {string} status
 */
export const changeJobStatus = (jobId, companyId, status) => {
     return axiosClient.put(`/api/v1/jobs/${jobId}/status`, null, {
          params: { company_id: companyId, status },
     });
};

/**
 * Lấy danh sách job levels.
 */
export const getJobLevels = () => {
     return axiosClient.get('/api/v1/jobs/levels');
};

/**
 * Lấy danh sách job categories.
 */
export const getJobCategories = () => {
     return axiosClient.get('/api/v1/jobs/categories');
};
