import axiosClient from './axiosClient';

export const applyToJob = (jobId, data) => {
     return axiosClient.post(`/api/v1/applications/jobs/${jobId}`, data);
};

export const getMyApplications = (params = {}) => {
     return axiosClient.get('/api/v1/applications/me', { params });
};

export const getMyApplicationForJob = (jobId) => {
     return axiosClient.get(`/api/v1/applications/me/jobs/${jobId}`);
};

export const getCompanyApplications = (companyId, params = {}) => {
     return axiosClient.get(`/api/v1/applications/company/${companyId}`, { params });
};

export const updateApplicationStatus = (applicationId, status) => {
     return axiosClient.put(`/api/v1/applications/${applicationId}/status`, { status });
};

export const withdrawApplication = (applicationId) => {
     return axiosClient.put(`/api/v1/applications/${applicationId}/withdraw`);
};
