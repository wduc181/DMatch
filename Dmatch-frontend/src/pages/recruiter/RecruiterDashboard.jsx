import { Link } from 'react-router-dom';
import {
     Briefcase, Eye, FileText, Building2, ArrowRight,
     TrendingUp, Clock, AlertCircle, Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/store/useAuthStore';
import { useCompanyByOwner } from '@/hooks/useCompanies';
import { useJobsByCompany } from '@/hooks/useJobs';

// ==================== Helpers ====================
const formatDate = (dateStr) => {
     if (!dateStr) return '—';
     return new Date(dateStr).toLocaleDateString('vi-VN', {
          day: '2-digit', month: '2-digit', year: 'numeric',
     });
};

const StatCard = ({ icon: Icon, label, value, description, color = 'text-primary' }) => (
     <Card>
          <CardContent className="p-5">
               <div className="flex items-center justify-between">
                    <div>
                         <p className="text-sm text-muted-foreground">{label}</p>
                         <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
                         {description && (
                              <p className="text-xs text-muted-foreground mt-1">{description}</p>
                         )}
                    </div>
                    <div className={`size-12 rounded-lg flex items-center justify-center bg-primary/10 ${color}`}>
                         <Icon size={24} />
                    </div>
               </div>
          </CardContent>
     </Card>
);

const RecruiterDashboard = () => {
     const user = useAuthStore((s) => s.user);

     const {
          data: company,
          isLoading: isLoadingCompany,
          isError: isCompanyError,
     } = useCompanyByOwner(user?.id);

     const {
          data: jobsData,
          isLoading: isLoadingJobs,
     } = useJobsByCompany(company?.id, { limit: 100 });

     const isLoading = isLoadingCompany || (company && isLoadingJobs);

     if (isLoading) {
          return (
               <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                         <Loader2 size={32} className="animate-spin text-primary" />
                         <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
                    </div>
               </div>
          );
     }

     // Chưa có company - hiển thị hướng dẫn tạo company
     if (isCompanyError || !company) {
          return (
               <div className="min-h-[60vh] flex items-center justify-center">
                    <Card className="max-w-md w-full">
                         <CardContent className="pt-6 text-center">
                              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                   <Building2 size={32} className="text-primary" />
                              </div>
                              <h2 className="text-xl font-bold text-foreground mb-2">
                                   Chưa có hồ sơ công ty
                              </h2>
                              <p className="text-sm text-muted-foreground mb-6">
                                   Bạn cần tạo hồ sơ công ty trước khi có thể đăng tin tuyển dụng và quản lý ứng viên.
                              </p>
                              <Button asChild>
                                   <Link to="/recruiter/company-profile">
                                        <Building2 size={16} />
                                        Tạo hồ sơ công ty
                                   </Link>
                              </Button>
                         </CardContent>
                    </Card>
               </div>
          );
     }

     // Compute stats
     const jobs = jobsData?.content || [];
     const publishedJobs = jobs.filter((j) => j.status === 'PUBLISHED' || j.status === 'ACTIVE');
     const draftJobs = jobs.filter((j) => j.status === 'DRAFT');
     const recentJobs = [...jobs]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

     return (
          <div className="space-y-6">
               {/* Header */}
               <div>
                    <h1 className="text-2xl font-bold text-foreground">
                         Xin chào, {user?.fullName || 'Nhà tuyển dụng'}!
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                         Tổng quan hoạt động tuyển dụng của <span className="font-medium text-foreground">{company.name}</span>
                    </p>
               </div>

               {/* Stat Cards */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                         icon={Briefcase}
                         label="Việc làm đang mở"
                         value={publishedJobs.length}
                         description={`${jobs.length} tin tổng cộng`}
                    />
                    <StatCard
                         icon={FileText}
                         label="Bản nháp"
                         value={draftJobs.length}
                         description="Chưa đăng"
                         color="text-amber-600"
                    />
                    <StatCard
                         icon={Eye}
                         label="Tổng lượt xem"
                         value="—"
                         description="Sắp ra mắt"
                         color="text-blue-600"
                    />
                    <StatCard
                         icon={FileText}
                         label="Hồ sơ chờ duyệt"
                         value="—"
                         description="Sắp ra mắt"
                         color="text-emerald-600"
                    />
               </div>

               {/* Quick Actions + Recent Jobs */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Jobs */}
                    <Card className="lg:col-span-2">
                         <CardHeader className="flex-row items-center justify-between">
                              <CardTitle className="text-lg">Tin tuyển dụng gần đây</CardTitle>
                              <Button variant="ghost" size="sm" asChild className="gap-1">
                                   <Link to="/recruiter/manage-jobs">
                                        Xem tất cả
                                        <ArrowRight size={14} />
                                   </Link>
                              </Button>
                         </CardHeader>
                         <CardContent>
                              {recentJobs.length === 0 ? (
                                   <div className="flex flex-col items-center py-8 text-muted-foreground">
                                        <Briefcase size={32} className="mb-2 opacity-40" />
                                        <p className="text-sm">Chưa có tin tuyển dụng nào</p>
                                   </div>
                              ) : (
                                   <div className="space-y-3">
                                        {recentJobs.map((job) => (
                                             <div
                                                  key={job.id}
                                                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                                             >
                                                  <div className="min-w-0 flex-1">
                                                       <Link
                                                            to={`/jobs/${job.id}`}
                                                            className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                                                       >
                                                            {job.title}
                                                       </Link>
                                                       <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                 <Clock size={12} />
                                                                 {formatDate(job.created_at)}
                                                            </span>
                                                            {job.location && (
                                                                 <span className="text-xs text-muted-foreground">
                                                                      • {job.location}
                                                                 </span>
                                                            )}
                                                       </div>
                                                  </div>
                                                  <Badge
                                                       variant={job.status === 'PUBLISHED' || job.status === 'ACTIVE' ? 'default' : 'secondary'}
                                                       className="ml-3 shrink-0"
                                                  >
                                                       {job.status === 'PUBLISHED' || job.status === 'ACTIVE' ? 'Đang hiển thị' : 'Nháp'}
                                                  </Badge>
                                             </div>
                                        ))}
                                   </div>
                              )}
                         </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                         <CardHeader>
                              <CardTitle className="text-lg">Hành động nhanh</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-3">
                              <Button className="w-full justify-start gap-2" asChild>
                                   <Link to="/recruiter/post-job">
                                        <Briefcase size={16} />
                                        Đăng tin tuyển dụng
                                   </Link>
                              </Button>
                              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                                   <Link to="/recruiter/company-profile">
                                        <Building2 size={16} />
                                        Cập nhật hồ sơ công ty
                                   </Link>
                              </Button>
                              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                                   <Link to="/recruiter/manage-jobs">
                                        <TrendingUp size={16} />
                                        Xem danh sách việc làm
                                   </Link>
                              </Button>

                              {/* Notice about upcoming features */}
                              <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                   <div className="flex items-start gap-2">
                                        <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                                        <div>
                                             <p className="text-xs font-medium text-amber-800">Tính năng sắp ra mắt</p>
                                             <p className="text-xs text-amber-600 mt-0.5">
                                                  Quản lý ứng viên và thống kê lượt xem sẽ có trong phiên bản tiếp theo.
                                             </p>
                                        </div>
                                   </div>
                              </div>
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
};

export default RecruiterDashboard;
