import axiosClient from './axiosClient';

export const getAdminUsersApi = async () => {
     const response = await axiosClient.get('/api/v1/admin/users');
     return response.data;
};

export const toggleAdminUserStatusApi = async (userId) => {
     const response = await axiosClient.put(`/api/v1/admin/users/${userId}/status`);
     return response.data;
};