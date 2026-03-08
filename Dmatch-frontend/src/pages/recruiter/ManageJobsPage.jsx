import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
     Plus, MoreHorizontal, Pencil, Trash2, Eye, ToggleLeft, ToggleRight,
     Briefcase, Loader2, Search, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
     Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
     DropdownMenu, DropdownMenuContent, DropdownMenuItem,
     DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
     Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import useAuthStore from '@/store/useAuthStore';
import { useCompanyByOwner } from '@/hooks/useCompanies';
import { useJobsByCompany, useDeleteJob, useChangeJobStatus } from '@/hooks/useJobs';
import { SAMPLE_RECRUITER_COMPANY, SAMPLE_RECRUITER_JOBS } from '@/data/sampleData';

// ==================== Helpers ====================
const formatSalary = (value) => {
     if (!value) return null;
     if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}M`;
     if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
     return value.toString();
};

const formatDate = (dateStr) => {
     if (!dateStr) return '—';
     return new Date(dateStr).toLocaleDateString('vi-VN', {
          day: '2-digit', month: '2-digit', year: 'numeric',
     });
};

const STATUS_CONFIG = {
     PUBLISHED: { label: 'Đang hiển thị', variant: 'default' },
     DRAFT: { label: 'Bản nháp', variant: 'secondary' },
     CLOSED: { label: 'Đã đóng', variant: 'outline' },
};

const JOB_TYPE_LABELS = {
     FULL_TIME: 'Toàn thời gian',
     PART_TIME: 'Bán thời gian',
     CONTRACT: 'Hợp đồng',
     INTERNSHIP: 'Thực tập',
     REMOTE: 'Từ xa',
};

const ManageJobsPage = () => {
     const user = useAuthStore((s) => s.user);
     const navigate = useNavigate();
     const [searchTerm, setSearchTerm] = useState('');
     const [toast, setToast] = useState(null);
     const [deleteDialog, setDeleteDialog] = useState({ open: false, job: null });

     // Fetch company by owner
     const {
          data: apiCompany,
          isLoading: isLoadingCompany,
     } = useCompanyByOwner(user?.id);

     // Fetch jobs by company
     const {
          data: jobsData,
          isLoading: isLoadingJobs,
          refetch: refetchJobs,
     } = useJobsByCompany(apiCompany?.id, { limit: 100 });

     const deleteJobMutation = useDeleteJob();
     const changeStatusMutation = useChangeJobStatus();

     // Sample data fallback
     const company = apiCompany || SAMPLE_RECRUITER_COMPANY;

     // Auto-hide toast
     useEffect(() => {
          if (toast) {
               const timer = setTimeout(() => setToast(null), 4000);
               return () => clearTimeout(timer);
          }
     }, [toast]);

     const jobs = (jobsData?.content || jobsData) || SAMPLE_RECRUITER_JOBS;
     const filteredJobs = jobs.filter((job) =>
          job.title?.toLowerCase().includes(searchTerm.toLowerCase()),
     );

     const handleToggleStatus = async (job) => {
          const newStatus = job.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
          try {
               await changeStatusMutation.mutateAsync({
                    jobId: job.id,
                    companyId: company.id,
                    status: newStatus,
               });
               setToast({
                    type: 'success',
                    message: `Đã chuyển trạng thái sang "${STATUS_CONFIG[newStatus]?.label}"`,
               });
          } catch (err) {
               setToast({
                    type: 'error',
                    message: err.response?.data?.message || 'Không thể thay đổi trạng thái',
               });
          }
     };

     const handleDelete = async () => {
          if (!deleteDialog.job) return;
          try {
               await deleteJobMutation.mutateAsync({
                    jobId: deleteDialog.job.id,
                    companyId: company.id,
               });
               setDeleteDialog({ open: false, job: null });
               setToast({ type: 'success', message: 'Đã xóa tin tuyển dụng' });
          } catch (err) {
               setToast({
                    type: 'error',
                    message: err.response?.data?.message || 'Không thể xóa tin',
               });
          }
     };

     // Loading state (chỉ show khi có API data thật)
     if (apiCompany && (isLoadingCompany || isLoadingJobs)) {
          return (
               <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                         <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                         <p className="text-sm text-muted-foreground">Đang tải danh sách việc làm...</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="space-y-6">
               {/* Header */}
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                         <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                              <Briefcase size={24} className="text-primary" />
                              Quản lý việc làm
                         </h1>
                         <p className="text-sm text-muted-foreground mt-1">
                              Quản lý các tin tuyển dụng của công ty bạn
                         </p>
                    </div>
                    <Button className="gap-2" asChild>
                         <Link to="/recruiter/post-job">
                              <Plus size={16} />
                              Đăng tin mới
                         </Link>
                    </Button>
               </div>

               {/* Toast */}
               {toast && (
                    <div
                         className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                              toast.type === 'success'
                                   ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                   : 'bg-destructive/10 text-destructive border border-destructive/20'
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

               {/* Search */}
               <div className="relative max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                         placeholder="Tìm theo tiêu đề..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="pl-9"
                    />
               </div>

               {/* Table */}
               <Card>
                    <CardContent className="p-0">
                         {filteredJobs.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-16 text-center">
                                   <Briefcase size={40} className="text-muted-foreground/40 mb-3" />
                                   <p className="text-muted-foreground font-medium">
                                        {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có tin tuyển dụng nào'}
                                   </p>
                                   {!searchTerm && (
                                        <Button className="mt-4 gap-2" variant="outline" asChild>
                                             <Link to="/recruiter/post-job">
                                                  <Plus size={16} />
                                                  Đăng tin đầu tiên
                                             </Link>
                                        </Button>
                                   )}
                              </div>
                         ) : (
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead className="w-[40%]">Tiêu đề</TableHead>
                                             <TableHead>Loại hình</TableHead>
                                             <TableHead>Mức lương</TableHead>
                                             <TableHead>Ngày tạo</TableHead>
                                             <TableHead>Trạng thái</TableHead>
                                             <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {filteredJobs.map((job) => {
                                             const statusCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.DRAFT;
                                             const salaryRange = job.salaryMin || job.salaryMax
                                                  ? `${formatSalary(job.salaryMin) || '?'} - ${formatSalary(job.salaryMax) || '?'}`
                                                  : 'Thỏa thuận';

                                             return (
                                                  <TableRow key={job.id}>
                                                       <TableCell>
                                                            <div>
                                                                 <p className="font-medium text-foreground">{job.title}</p>
                                                                 {job.location && (
                                                                      <p className="text-xs text-muted-foreground mt-0.5">{job.location}</p>
                                                                 )}
                                                            </div>
                                                       </TableCell>
                                                       <TableCell className="text-sm text-muted-foreground">
                                                            {JOB_TYPE_LABELS[job.jobType] || job.jobType}
                                                       </TableCell>
                                                       <TableCell className="text-sm text-muted-foreground">
                                                            {salaryRange}
                                                       </TableCell>
                                                       <TableCell className="text-sm text-muted-foreground">
                                                            {formatDate(job.createdAt)}
                                                       </TableCell>
                                                       <TableCell>
                                                            <Badge variant={statusCfg.variant}>
                                                                 {statusCfg.label}
                                                            </Badge>
                                                       </TableCell>
                                                       <TableCell>
                                                            <DropdownMenu>
                                                                 <DropdownMenuTrigger asChild>
                                                                      <Button variant="ghost" size="icon-sm">
                                                                           <MoreHorizontal size={16} />
                                                                      </Button>
                                                                 </DropdownMenuTrigger>
                                                                 <DropdownMenuContent align="end">
                                                                      <DropdownMenuItem asChild>
                                                                           <Link to={`/jobs/${job.id}`} className="cursor-pointer">
                                                                                <Eye size={14} />
                                                                                Xem chi tiết
                                                                           </Link>
                                                                      </DropdownMenuItem>
                                                                      <DropdownMenuItem
                                                                           className="cursor-pointer"
                                                                           onClick={() => navigate(`/recruiter/post-job?edit=${job.id}`)}
                                                                      >
                                                                           <Pencil size={14} />
                                                                           Chỉnh sửa
                                                                      </DropdownMenuItem>
                                                                      <DropdownMenuSeparator />
                                                                      <DropdownMenuItem
                                                                           className="cursor-pointer"
                                                                           onClick={() => handleToggleStatus(job)}
                                                                           disabled={changeStatusMutation.isPending}
                                                                      >
                                                                           {job.status === 'PUBLISHED' ? (
                                                                                <>
                                                                                     <ToggleLeft size={14} />
                                                                                     Chuyển sang Nháp
                                                                                </>
                                                                           ) : (
                                                                                <>
                                                                                     <ToggleRight size={14} />
                                                                                     Đăng tin
                                                                                </>
                                                                           )}
                                                                      </DropdownMenuItem>
                                                                      <DropdownMenuSeparator />
                                                                      <DropdownMenuItem
                                                                           className="cursor-pointer text-destructive focus:text-destructive"
                                                                           onClick={() => setDeleteDialog({ open: true, job })}
                                                                      >
                                                                           <Trash2 size={14} />
                                                                           Xóa tin
                                                                      </DropdownMenuItem>
                                                                 </DropdownMenuContent>
                                                            </DropdownMenu>
                                                       </TableCell>
                                                  </TableRow>
                                             );
                                        })}
                                   </TableBody>
                              </Table>
                         )}
                    </CardContent>
               </Card>

               {/* Delete Confirmation Dialog */}
               <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, job: null })}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>Xác nhận xóa</DialogTitle>
                              <DialogDescription>
                                   Bạn có chắc muốn xóa tin tuyển dụng{' '}
                                   <span className="font-semibold text-foreground">"{deleteDialog.job?.title}"</span>?
                                   Hành động này không thể hoàn tác.
                              </DialogDescription>
                         </DialogHeader>
                         <DialogFooter>
                              <Button
                                   variant="outline"
                                   onClick={() => setDeleteDialog({ open: false, job: null })}
                              >
                                   Hủy
                              </Button>
                              <Button
                                   variant="destructive"
                                   onClick={handleDelete}
                                   disabled={deleteJobMutation.isPending}
                                   className="gap-2"
                              >
                                   {deleteJobMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                                   Xóa
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </div>
     );
};

export default ManageJobsPage;
