import { Link, NavLink } from 'react-router-dom';
import { LogIn, UserPlus, Briefcase, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/useAuthStore';
import UserMenu from './UserMenu';

const Topbar = () => {
     const { isAuthenticated } = useAuthStore();

     const navLinkClass = ({ isActive }) =>
          `text-sm font-medium transition-colors duration-200 ${isActive
               ? 'text-primary'
               : 'text-muted-foreground hover:text-foreground'
          }`;

     return (
          <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                         {/* Logo */}
                         <Link
                              to="/"
                              className="flex items-center gap-1 group"
                         >
                              <span
                                   className="text-2xl font-bold tracking-tight"
                                   style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                              >
                                   <span className="text-primary group-hover:text-primary/80 transition-colors duration-200">
                                        D
                                   </span>
                                   <span className="text-foreground group-hover:text-foreground/80 transition-colors duration-200">
                                        match
                                   </span>
                              </span>
                         </Link>

                         {/* Navigation Links */}
                         <div className="hidden md:flex items-center gap-6">
                              <NavLink to="/jobs" className={navLinkClass}>
                                   <span className="inline-flex items-center gap-1.5">
                                        <Briefcase size={16} />
                                        Việc làm
                                   </span>
                              </NavLink>
                              <NavLink to="/companies" className={navLinkClass}>
                                   <span className="inline-flex items-center gap-1.5">
                                        <Building2 size={16} />
                                        Công ty
                                   </span>
                              </NavLink>
                         </div>

                         {/* Auth Area */}
                         <div className="flex items-center gap-3">
                              {isAuthenticated ? (
                                   <UserMenu />
                              ) : (
                                   <>
                                        <Button variant="outline" size="sm" asChild>
                                             <Link to="/login">
                                                  <LogIn size={16} />
                                                  <span className="hidden sm:inline">Đăng nhập</span>
                                             </Link>
                                        </Button>
                                        <Button size="sm" asChild>
                                             <Link to="/register">
                                                  <UserPlus size={16} />
                                                  <span className="hidden sm:inline">Đăng ký</span>
                                             </Link>
                                        </Button>
                                   </>
                              )}
                         </div>
                    </div>
               </div>
          </nav>
     );
};

export default Topbar;
