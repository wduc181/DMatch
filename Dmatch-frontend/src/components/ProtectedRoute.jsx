import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute - Component bọc các route cần xác thực và phân quyền.
 * 
 * Props:
 *  - allowedRoles: Mảng các role được phép truy cập (ví dụ: ['USER'], ['COMPANY'], ['ADMIN'])
 * 
 * TODO: Tích hợp với AuthContext/Zustand store để lấy thông tin user và token.
 * Hiện tại chỉ là placeholder, luôn redirect về /login.
 */
const ProtectedRoute = ({ allowedRoles }) => {
     // TODO: Lấy token và role từ auth state
     const isAuthenticated = false; // Thay bằng logic kiểm tra token
     const userRole = null; // Thay bằng role thực tế từ token/store

     if (!isAuthenticated) {
          return <Navigate to="/login" replace />;
     }

     if (allowedRoles && !allowedRoles.includes(userRole)) {
          return <Navigate to="/403" replace />;
     }

     return <Outlet />;
};

export default ProtectedRoute;
