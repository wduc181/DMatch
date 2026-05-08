import { create } from 'zustand';

const TOKEN_KEY = 'dmatch_token';
const USER_KEY = 'dmatch_user';

/**
 * Auth Store — quản lý trạng thái xác thực xuyên suốt ứng dụng.
 *
 * State:
 *   - user: { id, email, fullName, status, roles[], createdAt } (from UserResponse DTO)
 *   - token: JWT access token string
 *   - isAuthenticated: boolean
 *   - isLoading: true khi đang hydrate từ localStorage
 *
 * Actions:
 *   - login(userData, token) — lưu vào store + localStorage
 *   - logout() — xóa store + localStorage
 *   - initialize() — hydrate từ localStorage khi app start
 */
const useAuthStore = create((set) => ({
     user: null,
     token: null,
     isAuthenticated: false,
     isLoading: true,

     /**
      * Gọi khi đăng nhập thành công.
      * @param {object} userData — UserResponse từ backend
      * @param {string} token — accessToken từ AuthResponse
      */
     login: (userData, token) => {
          localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(userData));
          set({
               user: userData,
               token,
               isAuthenticated: true,
               isLoading: false,
          });
     },

     /**
      * Gọi khi đăng xuất hoặc token hết hạn (401).
      */
     logout: () => {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          set({
               user: null,
               token: null,
               isAuthenticated: false,
               isLoading: false,
          });
     },

     /**
      * Hydrate state từ localStorage khi app start (F5).
      * Gọi 1 lần trong App.jsx hoặc main.jsx.
      */
     initialize: () => {
          const token = localStorage.getItem(TOKEN_KEY);
          const userStr = localStorage.getItem(USER_KEY);

          if (token && userStr) {
               try {
                    const user = JSON.parse(userStr);
                    set({
                         user,
                         token,
                         isAuthenticated: true,
                         isLoading: false,
                    });
               } catch {
                    // Dữ liệu localStorage bị hỏng → xóa
                    localStorage.removeItem(TOKEN_KEY);
                    localStorage.removeItem(USER_KEY);
                    set({ isLoading: false });
               }
          } else {
               set({ isLoading: false });
          }
     },
}));

export default useAuthStore;
