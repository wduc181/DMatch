import axios from 'axios';
import useAuthStore from '@/store/useAuthStore';

/**
 * Axios instance cốt lõi — mọi API call đều đi qua đây.
 *
 * - baseURL: API Gateway (http://localhost:8081)
 * - Request Interceptor: tự động gắn Authorization: Bearer <token>
 * - Response Interceptor: bắt 401 → logout() + redirect /login
 */
const axiosClient = axios.create({
     baseURL: 'http://localhost:8081',
     timeout: 10000,
     headers: {
          'Content-Type': 'application/json',
     },
});

// ===== Request Interceptor =====
axiosClient.interceptors.request.use(
     (config) => {
          const token = useAuthStore.getState().token;
          if (token) {
               config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
     },
     (error) => Promise.reject(error)
);

// ===== Response Interceptor =====
axiosClient.interceptors.response.use(
     (response) => response,
     (error) => {
          if (error.response?.status === 401) {
               // Token hết hạn hoặc không hợp lệ → logout
               useAuthStore.getState().logout();
               // Redirect về login (không dùng navigate vì nằm ngoài component)
               window.location.href = '/login';
          }
          return Promise.reject(error);
     }
);

export default axiosClient;
