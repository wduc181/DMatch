import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
     Users, Search, Clock, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
     Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '@/components/ui/select';
import useAuthStore from '@/store/useAuthStore';
import { useCompanyByOwner } from '@/hooks/useCompanies';
import { useJobsByCompany } from '@/hooks/useJobs';
import { Building2 } from 'lucide-react';
import { useCompanyApplications, useUpdateApplicationStatus } from '@/hooks/useApplications';

// ==================== Status Config ====================
const APPLICATION_STATUS = {
     PENDING: { label: 'Chờ duyệt', variant: 'secondary' },
     REVIEWING: { label: 'Đang xem xét', variant: 'default' },
     ACCEPTED: { label: 'Đã chấp nhận', variant: 'default' },
     REJECTED: { label: 'Đã từ chối', variant: 'destructive' },
     WITHDRAWN: { label: 'Đã rút', variant: 'outline' },
};

const formatDate = (dateStr) => {
     if (!dateStr) return '—';
     return new Date(dateStr).toLocaleDateString('vi-VN', {
          day: '2-digit', month: '2-digit', year: 'numeric',
     });
};

const ManageCandidatesPage = () => {
     const user = useAuthStore((s) => s.user);
     const [selectedJobId, setSelectedJobId] = useState('all');
     const [searchTerm, setSearchTerm] = useState('');
     const [toast, setToast] = useState(null);

     // Fetch company
     const { data: apiCompany, isLoading: isLoadingCompany } = useCompanyByOwner(user?.id);

     // Fetch jobs for filter dropdown
     const { data: jobsData, isLoading: isLoadingJobs } = useJobsByCompany(apiCompany?.id, { limit: 100 });

     const applicationParams = {
          page: 1,
          limit: 100,
          job_id: selectedJobId === 'all' ? undefined : Number(selectedJobId),
          keyword: searchTerm || undefined,
     };
     const {
          data: applicationsData,
          isLoading: isApplicationsLoading,
     } = useCompanyApplications(apiCompany?.id, applicationParams, { enabled: !!apiCompany?.id });
     const updateStatusMutation = useUpdateApplicationStatus();

     useEffect(() => {
          if (toast) {
               const timer = setTimeout(() => setToast(null), 4000);
               return () => clearTimeout(timer);
          }
     }, [toast]);

     const isLoading = isLoadingCompany || (!!apiCompany && isLoadingJobs);

     if (isLoading) {
          return (
               <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                         <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                         <p className="text-sm text-muted-foreground">Đang tải...</p>
                    </div>
               </div>
          );
     }

     // No company (chỉ khi API trả về null rõ ràng)
     if (apiCompany === null) {
          return (
               <div className="min-h-[60vh] flex items-center justify-center">
                    <Card className="max-w-md w-full text-center">
                         <CardContent className="pt-8 pb-6 flex flex-col items-center gap-4">
                              <Building2 size={48} className="text-muted-foreground" />
                              <h2 className="text-lg font-semibold">Chưa có hồ sơ công ty</h2>
                              <p className="text-sm text-muted-foreground">
                                   Vui lòng tạo hồ sơ công ty trước.
                              </p>
                              <Button asChild>
                                   <Link to="/recruiter/company-profile">Tạo hồ sơ công ty</Link>
                              </Button>
                         </CardContent>
                    </Card>
               </div>
          );
     }

     const jobs = jobsData?.content || [];
     const filteredApplications = applicationsData?.content || [];

     const handleStatusChange = async (applicationId, status) => {
          setToast(null);
          try {
               await updateStatusMutation.mutateAsync({ applicationId, status });
               setToast({ type: 'success', message: 'Đã cập nhật trạng thái ứng tuyển' });
          } catch (err) {
               setToast({
                    type: 'error',
                    message: err.response?.data?.message || 'Không thể cập nhật trạng thái',
               });
          }
     };

     return (
          <div className="space-y-6">
               {/* Header */}
               <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                         <Users size={24} className="text-primary" />
                         Quản lý ứng viên
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                         Xem và quản lý hồ sơ ứng viên ứng tuyển vào các tin tuyển dụng
                    </p>
               </div>

               {toast && (
                    <div
                         className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                              toast.type === 'success'
                                   ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                                   : 'border border-destructive/20 bg-destructive/10 text-destructive'
                         }`}
                    >
                         {toast.type === 'success' ? (
                              <CheckCircle2 size={16} className="shrink-0" />
                         ) : (
                              <AlertCircle size={16} className="shrink-0" />
                         )}
                         {toast.message}
                    </div>
               )}

               {/* Filters */}
               <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                         <Input
                              placeholder="Tìm theo tên ứng viên..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-9"
                         />
                    </div>
                    <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                         <SelectTrigger className="w-full sm:w-72">
                              <SelectValue placeholder="Lọc theo tin tuyển dụng" />
                         </SelectTrigger>
                         <SelectContent>
                              <SelectItem value="all">Tất cả tin tuyển dụng</SelectItem>
                              {jobs.map((job) => (
                                   <SelectItem key={job.id} value={job.id.toString()}>
                                        {job.title}
                                   </SelectItem>
                              ))}
                         </SelectContent>
                    </Select>
               </div>

               {/* Content */}
               <Card>
                    <CardContent className="p-0">
                         {isApplicationsLoading ? (
                              <div className="flex items-center justify-center py-20">
                                   <Loader2 size={28} className="animate-spin text-primary" />
                              </div>
                         ) : filteredApplications.length === 0 ? (
                              /* ===== Empty State ===== */
                              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                   <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <Users size={32} className="text-muted-foreground" />
                                   </div>
                                   <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Không tìm thấy ứng viên
                                   </h3>
                                   <p className="text-sm text-muted-foreground max-w-md">
                                        {searchTerm || selectedJobId !== 'all'
                                             ? 'Thử thay đổi bộ lọc để xem kết quả khác.'
                                             : 'Chưa có ứng viên nào ứng tuyển.'}
                                   </p>
                              </div>
                         ) : (
                              /* ===== Real Table (khi có data) ===== */
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead className="w-[30%]">Ứng viên</TableHead>
                                             <TableHead>Vị trí ứng tuyển</TableHead>
                                             <TableHead>Ngày nộp</TableHead>
                                             <TableHead>Trạng thái</TableHead>
                                             <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {filteredApplications.map((app) => {
                                             const statusCfg = APPLICATION_STATUS[app.status] || APPLICATION_STATUS.PENDING;
                                             return (
                                                  <TableRow key={app.id}>
                                                       <TableCell>
                                                            <div>
                                                                 <p className="font-medium text-foreground">{app.candidate_name || app.candidate_email}</p>
                                                                 <p className="text-xs text-muted-foreground">{app.candidate_email}</p>
                                                            </div>
                                                       </TableCell>
                                                       <TableCell className="text-sm">{app.job_title}</TableCell>
                                                       <TableCell className="text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                 <Clock size={12} />
                                                                 {formatDate(app.applied_at)}
                                                            </span>
                                                       </TableCell>
                                                       <TableCell>
                                                            {app.status === 'WITHDRAWN' ? (
                                                                 <Badge variant={statusCfg.variant}>
                                                                      {statusCfg.label}
                                                                 </Badge>
                                                            ) : (
                                                                 <Select
                                                                      value={app.status}
                                                                      onValueChange={(status) => handleStatusChange(app.id, status)}
                                                                      disabled={updateStatusMutation.isPending}
                                                                 >
                                                                      <SelectTrigger className="h-8 w-40">
                                                                           <SelectValue />
                                                                      </SelectTrigger>
                                                                      <SelectContent>
                                                                           {Object.entries(APPLICATION_STATUS)
                                                                                .filter(([status]) => status !== 'WITHDRAWN')
                                                                                .map(([status, cfg]) => (
                                                                                     <SelectItem key={status} value={status}>
                                                                                          {cfg.label}
                                                                                     </SelectItem>
                                                                                ))}
                                                                      </SelectContent>
                                                                 </Select>
                                                            )}
                                                       </TableCell>
                                                  </TableRow>
                                             );
                                        })}
                                   </TableBody>
                              </Table>
                         )}
                    </CardContent>
               </Card>
          </div>
     );
};

export default ManageCandidatesPage;
