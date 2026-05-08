import { Link, Outlet } from 'react-router-dom';
import { Briefcase, Shield, Zap } from 'lucide-react';

const features = [
     { icon: Briefcase, text: 'Hàng nghìn việc làm IT chất lượng' },
     { icon: Shield, text: 'Bảo mật thông tin tuyệt đối' },
     { icon: Zap, text: 'Kết nối nhanh chóng với nhà tuyển dụng' },
];

const AuthLayout = () => {
     return (
          <div className="min-h-screen flex">
               {/* Left Panel — Branding */}
               <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground p-12 flex-col justify-between">
                    <div>
                         <Link to="/" className="inline-block">
                              <span
                                   className="text-3xl font-bold tracking-tight"
                                   style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                              >
                                   <span className="text-white">D</span>
                                   <span className="text-white/80">match</span>
                              </span>
                         </Link>
                    </div>

                    <div className="space-y-6">
                         <h1 className="text-4xl font-bold leading-tight">
                              Kết nối đúng người,
                              <br />
                              Trúng đúng việc.
                         </h1>
                         <p className="text-lg text-white/70 max-w-md">
                              Nền tảng tuyển dụng IT hàng đầu Việt Nam, giúp bạn tìm được công việc mơ ước.
                         </p>

                         <div className="space-y-4 pt-4">
                              {features.map((f, i) => (
                                   <div key={i} className="flex items-center gap-3">
                                        <div className="flex items-center justify-center size-10 rounded-lg bg-white/10">
                                             <f.icon size={20} />
                                        </div>
                                        <span className="text-sm text-white/80">{f.text}</span>
                                   </div>
                              ))}
                         </div>
                    </div>

                    <p className="text-xs text-white/40">
                         © {new Date().getFullYear()} DMatch. All rights reserved.
                    </p>
               </div>

               {/* Right Panel — Form */}
               <div className="flex-1 flex items-center justify-center bg-background p-6 sm:p-8">
                    <div className="w-full max-w-md">
                         {/* Mobile logo */}
                         <div className="lg:hidden mb-8 text-center">
                              <Link to="/">
                                   <span
                                        className="text-2xl font-bold tracking-tight"
                                        style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                                   >
                                        <span className="text-primary">D</span>
                                        <span className="text-foreground">match</span>
                                   </span>
                              </Link>
                         </div>
                         <Outlet />
                    </div>
               </div>
          </div>
     );
};

export default AuthLayout;

