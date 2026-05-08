import { Link } from 'react-router-dom';
import { Briefcase, Building2, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
     forCandidates: [
          { label: 'Tìm việc làm', to: '/jobs' },
          { label: 'Công ty hàng đầu', to: '/companies' },
          { label: 'Tạo CV', to: '/candidate/profile' },
     ],
     forRecruiters: [
          { label: 'Đăng tin tuyển dụng', to: '/recruiter/post-job' },
          { label: 'Quản lý ứng viên', to: '/recruiter/manage-candidates' },
          { label: 'Quản lý tin đăng', to: '/recruiter/manage-jobs' },
     ],
};

const Footer = () => {
     return (
          <footer className="bg-foreground text-background">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                         {/* Brand */}
                         <div className="space-y-4">
                              <Link to="/" className="inline-block">
                                   <span
                                        className="text-2xl font-bold tracking-tight"
                                        style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                                   >
                                        <span className="text-primary">D</span>
                                        <span className="text-background">match</span>
                                   </span>
                              </Link>
                              <p className="text-sm text-background/60 leading-relaxed">
                                   Kết nối đúng người, trúng đúng việc. Nền tảng tuyển dụng IT hàng đầu Việt Nam.
                              </p>
                         </div>

                         {/* For Candidates */}
                         <div className="space-y-4">
                              <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                                   <Briefcase size={16} className="text-primary" />
                                   Ứng viên
                              </h3>
                              <ul className="space-y-2">
                                   {footerLinks.forCandidates.map((link) => (
                                        <li key={link.to}>
                                             <Link
                                                  to={link.to}
                                                  className="text-sm text-background/60 hover:text-primary transition-colors duration-200"
                                             >
                                                  {link.label}
                                             </Link>
                                        </li>
                                   ))}
                              </ul>
                         </div>

                         {/* For Recruiters */}
                         <div className="space-y-4">
                              <h3 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                                   <Building2 size={16} className="text-primary" />
                                   Nhà tuyển dụng
                              </h3>
                              <ul className="space-y-2">
                                   {footerLinks.forRecruiters.map((link) => (
                                        <li key={link.to}>
                                             <Link
                                                  to={link.to}
                                                  className="text-sm text-background/60 hover:text-primary transition-colors duration-200"
                                             >
                                                  {link.label}
                                             </Link>
                                        </li>
                                   ))}
                              </ul>
                         </div>

                         {/* Contact */}
                         <div className="space-y-4">
                              <h3 className="text-sm font-semibold uppercase tracking-wider">
                                   Liên hệ
                              </h3>
                              <ul className="space-y-2">
                                   <li>
                                        <span className="text-sm text-background/60 flex items-center gap-2">
                                             <Mail size={14} className="text-primary shrink-0" />
                                             contact@dmatch.vn
                                        </span>
                                   </li>
                                   <li>
                                        <span className="text-sm text-background/60 flex items-center gap-2">
                                             <Phone size={14} className="text-primary shrink-0" />
                                             (028) 1234 5678
                                        </span>
                                   </li>
                                   <li>
                                        <span className="text-sm text-background/60 flex items-center gap-2">
                                             <MapPin size={14} className="text-primary shrink-0" />
                                             TP. Hồ Chí Minh, Việt Nam
                                        </span>
                                   </li>
                              </ul>
                         </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="mt-10 pt-6 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                         <p className="text-xs text-background/40">
                              © {new Date().getFullYear()} DMatch. All rights reserved.
                         </p>
                         <div className="flex items-center gap-4 text-xs text-background/40">
                              <Link to="#" className="hover:text-primary transition-colors">Điều khoản</Link>
                              <Link to="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link>
                         </div>
                    </div>
               </div>
          </footer>
     );
};

export default Footer;
