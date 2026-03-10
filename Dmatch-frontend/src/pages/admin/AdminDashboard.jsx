import { Link } from 'react-router-dom';
import {
     ArrowRight,
     Building2,
     Clock3,
     ShieldAlert,
     Users,
} from 'lucide-react';
import AdminStatCard from '@/features/admin/components/AdminStatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SAMPLE_ADMIN_PENDING_JOBS, SAMPLE_ADMIN_USERS } from '@/data/sampleData';

const formatPercent = (value, total) => {
     if (!total) return 0;
     return Math.round((value / total) * 100);
};

const ProgressRow = ({ label, value, total, toneClass }) => {
     const percent = formatPercent(value, total);

     return (
          <div className="space-y-2">
               <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
               </div>
               <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${toneClass}`} style={{ width: `${percent}%` }} />
               </div>
          </div>
     );
};

const AdminDashboard = () => {
     const users = SAMPLE_ADMIN_USERS;
     const pendingJobs = SAMPLE_ADMIN_PENDING_JOBS;

     const candidateCount = users.filter((user) => user.roles?.includes('USER') && !user.roles?.includes('COMPANY') && !user.roles?.includes('ADMIN')).length;
     const recruiterCount = users.filter((user) => user.roles?.includes('COMPANY')).length;
     const adminCount = users.filter((user) => user.roles?.includes('ADMIN')).length;
     const activeCount = users.filter((user) => user.status === 'ACTIVE').length;
     const bannedCount = users.filter((user) => user.status === 'BANNED').length;
     const totalUsers = users.length;

     return (
          <div className="space-y-6">
               <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                         <h1 className="text-2xl font-bold text-foreground">Tổng quan hệ thống</h1>
                         <p className="mt-1 text-sm text-muted-foreground">
                              Bức tranh nhanh về tài khoản và các khu vực nghiệp vụ admin đang quản lý trên DMatch.
                         </p>
                    </div>
                    <Button variant="outline" asChild className="gap-2">
                         <Link to="/admin/users">
                              Đi tới quản lý người dùng
                              <ArrowRight size={14} />
                         </Link>
                    </Button>
               </div>

               <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <AdminStatCard
                         icon={Users}
                         label="Tổng số ứng viên"
                         value={candidateCount}
                         description="Tính theo tài khoản có role USER và chưa mang role COMPANY/ADMIN"
                         tone="primary"
                    />
                    <AdminStatCard
                         icon={Building2}
                         label="Tổng số nhà tuyển dụng"
                         value={recruiterCount}
                         description="Đếm theo số tài khoản đang mang role COMPANY"
                         tone="emerald"
                    />
                    <AdminStatCard
                         icon={Clock3}
                         label="Việc làm chờ duyệt"
                         value={pendingJobs.length}
                         description="Dùng sample moderation data để test bố cục UI"
                         tone="amber"
                    />
               </div>

               <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <Card className="xl:col-span-2">
                         <CardHeader>
                              <CardTitle className="text-lg">Phân bổ tài khoản</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-5">
                              <ProgressRow
                                   label="Ứng viên"
                                   value={candidateCount}
                                   total={Math.max(totalUsers, 1)}
                                   toneClass="bg-primary"
                              />
                              <ProgressRow
                                   label="Nhà tuyển dụng"
                                   value={recruiterCount}
                                   total={Math.max(totalUsers, 1)}
                                   toneClass="bg-emerald-500"
                              />
                              <ProgressRow
                                   label="Quản trị viên"
                                   value={adminCount}
                                   total={Math.max(totalUsers, 1)}
                                   toneClass="bg-slate-700"
                              />
                         </CardContent>
                    </Card>

                    <Card>
                         <CardHeader>
                              <CardTitle className="text-lg">Tình trạng tài khoản</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-5">
                              <ProgressRow
                                   label="Đang hoạt động"
                                   value={activeCount}
                                   total={Math.max(totalUsers, 1)}
                                   toneClass="bg-emerald-500"
                              />
                              <ProgressRow
                                   label="Đã khóa"
                                   value={bannedCount}
                                   total={Math.max(totalUsers, 1)}
                                   toneClass="bg-destructive"
                              />
                              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                   <div className="flex items-start gap-3">
                                        <ShieldAlert size={18} className="mt-0.5 shrink-0" />
                                        <div>
                                             <p className="font-medium">Lưu ý nghiệp vụ</p>
                                             <p className="mt-1 text-amber-700">
                                                  Dashboard hiện đang đọc dữ liệu mẫu cục bộ để bạn test UI. Khi nối backend, chỉ cần thay
                                                  sample bằng dữ liệu thật từ API admin tương ứng.
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

export default AdminDashboard;
