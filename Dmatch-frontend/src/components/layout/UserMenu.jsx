import { Link, useNavigate } from 'react-router-dom';
import {
     User,
     FileText,
     LayoutDashboard,
     Briefcase,
     ShieldAlert,
     Users,
     Settings,
     LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuGroup,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuthStore from '@/store/useAuthStore';

/**
 * UserMenu — Dropdown menu cho user đã đăng nhập.
 *
 * - Trigger: Avatar (chữ cái đầu tên user)
 * - Header: Tên + Email
 * - Items: phân theo role (USER / COMPANY / ADMIN)
 * - Chung: Cài đặt + Đăng xuất
 */
const UserMenu = () => {
     const { user, logout } = useAuthStore();
     const navigate = useNavigate();

     const roles = user?.roles || [];

     // Tính initials cho Avatar
     const initials = user?.fullName
          ? user.fullName
               .split(' ')
               .map((w) => w[0])
               .join('')
               .slice(0, 2)
               .toUpperCase()
          : '?';

     const handleLogout = () => {
          logout();
          navigate('/');
     };

     return (
          <DropdownMenu>
               {/* ===== Trigger: Avatar ===== */}
               <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary/50 cursor-pointer">
                         <Avatar className="size-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                                   {initials}
                              </AvatarFallback>
                         </Avatar>
                    </button>
               </DropdownMenuTrigger>

               {/* ===== Content ===== */}
               <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                    {/* Header: Tên + Email */}
                    <DropdownMenuLabel className="font-normal">
                         <div className="flex flex-col gap-1">
                              <p className="text-sm font-semibold leading-none text-foreground">
                                   {user?.fullName || 'User'}
                              </p>
                              <p className="text-xs leading-none text-muted-foreground">
                                   {user?.email || ''}
                              </p>
                         </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {/* ===== Nhóm ROLE: USER (Ứng viên) ===== */}
                    {roles.includes('USER') && (
                         <DropdownMenuGroup>
                              <DropdownMenuItem asChild>
                                   <Link to="/candidate/profile" className="cursor-pointer">
                                        <User />
                                        Hồ sơ cá nhân
                                   </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                   <Link to="/candidate/applied-jobs" className="cursor-pointer">
                                        <FileText />
                                        Việc làm đã ứng tuyển
                                   </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                         </DropdownMenuGroup>
                    )}

                    {/* ===== Nhóm ROLE: COMPANY (Nhà tuyển dụng) ===== */}
                    {roles.includes('COMPANY') && (
                         <DropdownMenuGroup>
                              <DropdownMenuItem asChild>
                                   <Link to="/recruiter/dashboard" className="cursor-pointer">
                                        <LayoutDashboard />
                                        Dashboard Tuyển dụng
                                   </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                   <Link to="/recruiter/manage-jobs" className="cursor-pointer">
                                        <Briefcase />
                                        Quản lý tin tuyển dụng
                                   </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                         </DropdownMenuGroup>
                    )}

                    {/* ===== Nhóm ROLE: ADMIN (Quản trị viên) ===== */}
                    {roles.includes('ADMIN') && (
                         <DropdownMenuGroup>
                              <DropdownMenuItem asChild>
                                   <Link to="/admin/dashboard" className="cursor-pointer text-destructive focus:text-destructive">
                                        <ShieldAlert />
                                        Trang Quản Trị Hệ Thống
                                   </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                   <Link to="/admin/users" className="cursor-pointer">
                                        <Users />
                                        Quản lý người dùng
                                   </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                         </DropdownMenuGroup>
                    )}

                    {/* ===== Nhóm Chung ===== */}
                    <DropdownMenuGroup>
                         <DropdownMenuItem asChild>
                              <Link to="/settings" className="cursor-pointer">
                                   <Settings />
                                   Cài đặt tài khoản
                              </Link>
                         </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                         onClick={handleLogout}
                         className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                    >
                         <LogOut />
                         Đăng xuất
                    </DropdownMenuItem>
               </DropdownMenuContent>
          </DropdownMenu>
     );
};

export default UserMenu;
