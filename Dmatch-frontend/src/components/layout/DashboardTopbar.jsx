import { useLocation, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import UserMenu from './UserMenu';

const BREADCRUMB_MAP = {
     '/recruiter/dashboard': 'Tổng quan',
     '/recruiter/company-profile': 'Hồ sơ công ty',
     '/recruiter/manage-jobs': 'Quản lý việc làm',
     '/recruiter/post-job': 'Đăng tin mới',
     '/recruiter/manage-candidates': 'Quản lý ứng viên',
     '/admin/dashboard': 'Tổng quan',
     '/admin/users': 'Quản lý người dùng',
};

const DashboardTopbar = () => {
     const { pathname } = useLocation();

     const isAdmin = pathname.startsWith('/admin');
     const rootLabel = isAdmin ? 'Quản trị' : 'Nhà tuyển dụng';
     const rootPath = isAdmin ? '/admin/dashboard' : '/recruiter/dashboard';
     const currentLabel = BREADCRUMB_MAP[pathname] || 'Trang';

     return (
          <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 lg:px-6 bg-background/80 backdrop-blur-md border-b border-border">
               {/* Breadcrumb - có khoảng trống bên trái cho nút mobile menu */}
               <nav className="flex items-center gap-1.5 text-sm pl-12 lg:pl-0">
                    <Link
                         to={rootPath}
                         className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                         {rootLabel}
                    </Link>
                    <ChevronRight size={14} className="text-muted-foreground" />
                    <span className="font-medium text-foreground">{currentLabel}</span>
               </nav>

               {/* User menu */}
               <UserMenu />
          </header>
     );
};

export default DashboardTopbar;
