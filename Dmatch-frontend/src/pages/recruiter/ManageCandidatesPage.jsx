import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
     Users, Briefcase, Search, Clock,
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
import {
     SAMPLE_RECRUITER_JOBS,
     SAMPLE_APPLICATIONS,
} from '@/data/sampleData';

// ==================== Status Config ====================
const APPLICATION_STATUS = {
     PENDING: { label: 'Chờ duyệt', variant: 'secondary' },
     REVIEWING: { label: 'Đang xem xét', variant: 'default' },
     ACCEPTED: { label: 'Đã chấp nhận', variant: 'default' },
     REJECTED: { label: 'Đã từ chối', variant: 'destructive' },
};

const ManageCandidatesPage = () => {
     const user = useAuthStore((s) => s.user);
     const [selectedJobId, setSelectedJobId] = useState('all');
     const [searchTerm, setSearchTerm] = useState('');

     // Fetch company
     const { data: apiCompany, isLoading: isLoadingCompany } = useCompanyByOwner(user?.id);

     // Fetch jobs for filter dropdown
     const { data: jobsData, isLoading: isLoadingJobs } = useJobsByCompany(apiCompany?.id, { limit: 100 });

     // Sample data fallback
     const isLoading = apiCompany ? (isLoadingCompany || isLoadingJobs) : false;

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

     const jobs = (jobsData?.content || jobsData) || SAMPLE_RECRUITER_JOBS;

     // TODO: Replace with actual API call when backend apply feature is ready
     // const { data: apiApplications } = useApplicationsByCompany(company.id, { job_id: selectedJobId });
     const applications = SAMPLE_APPLICATIONS;

     // Filter applications
     const filteredApplications = applications.filter((app) => {
          const matchesSearch = !searchTerm || app.candidateName.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesJob = selectedJobId === 'all' || app.jobId.toString() === selectedJobId;
          return matchesSearch && matchesJob;
     });

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
                         {filteredApplications.length === 0 ? (
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
                                                                 <p className="font-medium text-foreground">{app.candidateName}</p>
                                                                 <p className="text-xs text-muted-foreground">{app.candidateEmail}</p>
                                                            </div>
                                                       </TableCell>
                                                       <TableCell className="text-sm">{app.jobTitle}</TableCell>
                                                       <TableCell className="text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                 <Clock size={12} />
                                                                 {app.appliedAt}
                                                            </span>
                                                       </TableCell>
                                                       <TableCell>
                                                            <Badge variant={statusCfg.variant}>
                                                                 {statusCfg.label}
                                                            </Badge>
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
