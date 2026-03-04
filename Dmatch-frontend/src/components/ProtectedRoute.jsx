import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';

/**
 * ProtectedRoute — bảo vệ route theo xác thực + phân quyền.
 *
 * Props:
 *   - allowedRoles: string[] (ví dụ: ['USER'], ['COMPANY'], ['ADMIN'])
 *
 * Logic:
 *   1. Đang hydrate → loading spinner
 *   2. Chưa login → redirect /login
 *   3. Sai role → redirect /403
 *   4. Hợp lệ → render children
 */
const ProtectedRoute = ({ allowedRoles }) => {
     const { isAuthenticated, isLoading, user } = useAuthStore();

     // Đang hydrate từ localStorage
     if (isLoading) {
          return (
               <div className="min-h-screen flex items-center justify-center">
                    <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
               </div>
          );
     }

     // Chưa đăng nhập
     if (!isAuthenticated) {
          return <Navigate to="/login" replace />;
     }

     // Kiểm tra role — user.roles là List<String> từ backend
     if (allowedRoles && allowedRoles.length > 0) {
          const userRoles = user?.roles || [];
          const hasPermission = userRoles.some((role) => allowedRoles.includes(role));
          if (!hasPermission) {
               return <Navigate to="/403" replace />;
          }
     }

     return <Outlet />;
};

export default ProtectedRoute;

