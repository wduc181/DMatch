import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

const Topbar = () => {
     return (
          <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
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
                                   <span className="text-purple-600 group-hover:text-purple-700 transition-colors duration-200">
                                        D
                                   </span>
                                   <span className="text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                                        match
                                   </span>
                              </span>
                         </Link>

                         {/* Auth Buttons */}
                         <div className="flex items-center gap-3">
                              <Link
                                   to="/login"
                                   className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 hover:text-purple-600 transition-all duration-200 cursor-pointer"
                              >
                                   <LogIn size={16} />
                                   <span className="hidden sm:inline">Đăng nhập</span>
                              </Link>
                              <Link
                                   to="/register"
                                   className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 active:bg-purple-800 transition-all duration-200 cursor-pointer"
                              >
                                   <UserPlus size={16} />
                                   <span className="hidden sm:inline">Đăng ký</span>
                              </Link>
                         </div>
                    </div>
               </div>
          </nav>
     );
};

export default Topbar;
