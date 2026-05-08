import { Link } from 'react-router-dom';
import { Building2, BarChart3, Clock, CircleCheckBig } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/**
 * Format status sang tiếng Việt.
 */
const STATUS_MAP = {
     ACTIVE: { label: 'Đang tuyển', className: 'bg-green-100 text-green-700' },
     CLOSED: { label: 'Đã đóng', className: 'bg-red-100 text-red-700' },
     DRAFT: { label: 'Nháp', className: 'bg-yellow-100 text-yellow-700' },
};

/**
 * Format date sang dạng ngắn gọn (vi-VN).
 */
const formatDate = (dateStr) => {
     if (!dateStr) return 'Chưa cập nhật';
     return new Date(dateStr).toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
     });
};

/**
 * Sidebar hiển thị thông tin công ty + tóm tắt thuộc tính Job.
 *
 * @param {{ company: object|null, job: object, isLoading: boolean }} props
 */
const JobCompanySidebar = ({ company, job, isLoading }) => {
     const initials = company?.name
          ?.split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

     const statusInfo = STATUS_MAP[job.status] || {
          label: job.status,
          className: 'bg-muted text-muted-foreground',
     };

     return (
          <div className="space-y-6">
               {/* ===== Company Card ===== */}
               <Card>
                    <CardHeader>
                         <CardTitle className="text-lg">Công ty tuyển dụng</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {isLoading ? (
                              <div className="space-y-3 animate-pulse">
                                   <div className="flex items-center gap-3">
                                        <div className="size-12 rounded-lg bg-muted" />
                                        <div className="space-y-2 flex-1">
                                             <div className="h-4 bg-muted rounded w-3/4" />
                                             <div className="h-3 bg-muted rounded w-1/2" />
                                        </div>
                                   </div>
                              </div>
                         ) : company ? (
                              <div className="space-y-4">
                                   <div className="flex items-center gap-3">
                                        <Avatar className="size-12 rounded-lg shrink-0">
                                             {company.logo_url ? (
                                                  <AvatarImage
                                                       src={company.logo_url}
                                                       alt={company.name}
                                                       className="object-cover"
                                                  />
                                             ) : null}
                                             <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-sm">
                                                  {initials}
                                             </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                             <h3 className="font-semibold text-foreground truncate">
                                                  {company.name}
                                             </h3>
                                             {company.industry && (
                                                  <p className="text-xs text-muted-foreground">
                                                       {company.industry}
                                                  </p>
                                             )}
                                        </div>
                                   </div>

                                   <Button variant="outline" size="sm" className="w-full" asChild>
                                        <Link to={`/companies/${company.id}`}>
                                             <Building2 size={14} />
                                             Xem trang công ty
                                        </Link>
                                   </Button>
                              </div>
                         ) : (
                              <p className="text-sm text-muted-foreground italic">
                                   Không tìm thấy thông tin công ty.
                              </p>
                         )}
                    </CardContent>
               </Card>

               {/* ===== Job Summary Card ===== */}
               <Card>
                    <CardHeader>
                         <CardTitle className="text-lg">Thông tin chung</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         {/* Cấp bậc */}
                         {job.job_level && (
                              <div className="flex items-start gap-3">
                                   <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 shrink-0">
                                        <BarChart3 size={16} className="text-primary" />
                                   </div>
                                   <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">
                                             Cấp bậc
                                        </p>
                                        <p className="text-sm font-medium text-foreground">
                                             {job.job_level.name}
                                        </p>
                                   </div>
                              </div>
                         )}

                         <Separator />

                         {/* Cập nhật */}
                         <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 shrink-0">
                                   <Clock size={16} className="text-primary" />
                              </div>
                              <div>
                                   <p className="text-xs text-muted-foreground mb-0.5">
                                        Cập nhật lần cuối
                                   </p>
                                   <p className="text-sm font-medium text-foreground">
                                        {formatDate(job.updated_at || job.created_at)}
                                   </p>
                              </div>
                         </div>

                         <Separator />

                         {/* Trạng thái */}
                         <div className="flex items-start gap-3">
                              <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 shrink-0">
                                   <CircleCheckBig size={16} className="text-primary" />
                              </div>
                              <div>
                                   <p className="text-xs text-muted-foreground mb-0.5">
                                        Tình trạng
                                   </p>
                                   <Badge className={statusInfo.className}>
                                        {statusInfo.label}
                                   </Badge>
                              </div>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
};

export default JobCompanySidebar;
