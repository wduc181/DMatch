import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
     ClipboardList, Search, Briefcase, MapPin, DollarSign, Clock,
     Building2, Eye, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
     Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
     Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import ApplicationStatusBadge, { STATUS_CONFIG } from '@/features/jobs/components/ApplicationStatusBadge';
import { SAMPLE_CANDIDATE_APPLICATIONS } from '@/data/sampleData';

// ==================== Helpers ====================
const formatSalary = (min, max, currency = 'VND') => {
     const format = (n) => {
          if (!n) return '?';
          if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
          if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
          return n.toString();
     };
     if (!min && !max) return 'Thỏa thuận';
     return `${format(min)} - ${format(max)} ${currency}`;
};

const formatDate = (dateStr) => {
     if (!dateStr) return '—';
     return new Date(dateStr).toLocaleDateString('vi-VN', {
          day: '2-digit', month: '2-digit', year: 'numeric',
     });
};

const JOB_TYPE_LABELS = {
     FULL_TIME: 'Toàn thời gian',
     PART_TIME: 'Bán thời gian',
     CONTRACT: 'Hợp đồng',
     INTERNSHIP: 'Thực tập',
     REMOTE: 'Từ xa',
};

// ==================== Stat Card ====================
const StatCard = ({ icon: Icon, label, value, className }) => (
     <Card>
          <CardContent className="flex items-center gap-3 py-4">
               <div className={`flex items-center justify-center size-10 rounded-lg ${className}`}>
                    <Icon size={20} />
               </div>
               <div>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
               </div>
          </CardContent>
     </Card>
);

// ==================== Mobile Card ====================
const ApplicationCard = ({ application }) => (
     <Link to={`/jobs/${application.job_id}`} className="block group">
          <Card className="transition-all duration-300 hover:shadow-md hover:border-primary/30 group-hover:-translate-y-0.5">
               <CardContent className="space-y-3">
                    {/* Company + Status */}
                    <div className="flex items-center justify-between gap-2">
                         <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground truncate">
                              <Building2 size={14} className="shrink-0" />
                              {application.company_name}
                         </span>
                         <ApplicationStatusBadge status={application.status} />
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                         {application.job_title}
                    </h3>

                    {/* Location + Salary */}
                    <div className="flex flex-col gap-1.5 text-sm">
                         <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                              <MapPin size={14} className="shrink-0 text-primary/70" />
                              {application.location}
                         </span>
                         <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                              <DollarSign size={14} className="shrink-0" />
                              {formatSalary(application.salary_min, application.salary_max, application.currency)}
                         </span>
                    </div>

                    {/* Ngày nộp + Job type */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
                         <span className="inline-flex items-center gap-1">
                              <Clock size={12} />
                              Nộp ngày {formatDate(application.applied_at)}
                         </span>
                         <span>{JOB_TYPE_LABELS[application.job_type] || application.job_type}</span>
                    </div>
               </CardContent>
          </Card>
     </Link>
);

// ==================== Page ====================
const AppliedJobsPage = () => {
     const [searchTerm, setSearchTerm] = useState('');
     const [statusFilter, setStatusFilter] = useState('all');

     // TODO: Cần implement application-service backend trước
     // Khi có API: const { data: applications, isLoading } = useMyApplications();
     // Endpoint cần có: GET /api/v1/applications/me
     const applications = SAMPLE_CANDIDATE_APPLICATIONS;
     const isLoading = false;

     // Filter
     const filteredApplications = useMemo(() => {
          return applications.filter((app) => {
               const matchesSearch = !searchTerm
                    || app.job_title.toLowerCase().includes(searchTerm.toLowerCase())
                    || app.company_name.toLowerCase().includes(searchTerm.toLowerCase());
               const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
               return matchesSearch && matchesStatus;
          });
     }, [applications, searchTerm, statusFilter]);

     // Stats
     const stats = useMemo(() => ({
          total: applications.length,
          pending: applications.filter((a) => a.status === 'PENDING').length,
          reviewing: applications.filter((a) => a.status === 'REVIEWING').length,
          accepted: applications.filter((a) => a.status === 'ACCEPTED').length,
          rejected: applications.filter((a) => a.status === 'REJECTED').length,
     }), [applications]);

     return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
               {/* Header */}
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                         <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                              <ClipboardList size={24} className="text-primary" />
                              Việc Đã Ứng Tuyển
                         </h1>
                         <p className="text-sm text-muted-foreground mt-1">
                              Theo dõi trạng thái các đơn ứng tuyển của bạn
                         </p>
                    </div>
                    <Button className="gap-2" asChild>
                         <Link to="/jobs">
                              <Briefcase size={16} />
                              Tìm việc mới
                         </Link>
                    </Button>
               </div>

               {/* Stats */}
               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard
                         icon={ClipboardList}
                         label="Tổng đơn"
                         value={stats.total}
                         className="bg-primary/10 text-primary"
                    />
                    <StatCard
                         icon={Clock}
                         label="Chờ duyệt"
                         value={stats.pending}
                         className="bg-amber-100 text-amber-700"
                    />
                    <StatCard
                         icon={Eye}
                         label="Đang xem xét"
                         value={stats.reviewing}
                         className="bg-blue-100 text-blue-700"
                    />
                    <StatCard
                         icon={Briefcase}
                         label="Đã chấp nhận"
                         value={stats.accepted}
                         className="bg-emerald-100 text-emerald-700"
                    />
               </div>

               {/* Filters */}
               <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                         <Input
                              placeholder="Tìm theo tên việc hoặc công ty..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-9"
                         />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                         <SelectTrigger className="w-full sm:w-52">
                              <SelectValue placeholder="Lọc trạng thái" />
                         </SelectTrigger>
                         <SelectContent>
                              <SelectItem value="all">Tất cả trạng thái</SelectItem>
                              {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                                   <SelectItem key={key} value={key}>{label}</SelectItem>
                              ))}
                         </SelectContent>
                    </Select>
               </div>

               {/* Content */}
               {filteredApplications.length === 0 ? (
                    /* ===== Empty State ===== */
                    <Card>
                         <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                              <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                   <ClipboardList size={32} className="text-muted-foreground" />
                              </div>
                              <h3 className="text-lg font-semibold text-foreground mb-2">
                                   {searchTerm || statusFilter !== 'all'
                                        ? 'Không tìm thấy kết quả'
                                        : 'Bạn chưa ứng tuyển công việc nào'}
                              </h3>
                              <p className="text-sm text-muted-foreground max-w-md mb-6">
                                   {searchTerm || statusFilter !== 'all'
                                        ? 'Thử thay đổi bộ lọc để xem kết quả khác.'
                                        : 'Khám phá các cơ hội việc làm phù hợp và bắt đầu ứng tuyển ngay!'}
                              </p>
                              {!searchTerm && statusFilter === 'all' && (
                                   <Button className="gap-2" asChild>
                                        <Link to="/jobs">
                                             <Briefcase size={16} />
                                             Tìm việc ngay
                                        </Link>
                                   </Button>
                              )}
                         </CardContent>
                    </Card>
               ) : (
                    <>
                         {/* ===== Desktop Table ===== */}
                         <Card className="hidden md:block">
                              <CardContent className="p-0">
                                   <Table>
                                        <TableHeader>
                                             <TableRow>
                                                  <TableHead className="w-[35%]">Vị trí</TableHead>
                                                  <TableHead>Công ty</TableHead>
                                                  <TableHead>Mức lương</TableHead>
                                                  <TableHead>Ngày nộp</TableHead>
                                                  <TableHead>Trạng thái</TableHead>
                                                  <TableHead className="w-12"></TableHead>
                                             </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                             {filteredApplications.map((app) => (
                                                  <TableRow key={app.id}>
                                                       <TableCell>
                                                            <div>
                                                                 <p className="font-medium text-foreground">{app.job_title}</p>
                                                                 <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                                                      <MapPin size={12} />
                                                                      {app.location}
                                                                 </p>
                                                            </div>
                                                       </TableCell>
                                                       <TableCell>
                                                            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                                                 <Building2 size={14} className="shrink-0" />
                                                                 {app.company_name}
                                                            </span>
                                                       </TableCell>
                                                       <TableCell className="text-sm text-muted-foreground">
                                                            {formatSalary(app.salary_min, app.salary_max, app.currency)}
                                                       </TableCell>
                                                       <TableCell className="text-sm text-muted-foreground">
                                                            {formatDate(app.applied_at)}
                                                       </TableCell>
                                                       <TableCell>
                                                            <ApplicationStatusBadge status={app.status} />
                                                       </TableCell>
                                                       <TableCell>
                                                            <Button variant="ghost" size="icon-sm" asChild>
                                                                 <Link to={`/jobs/${app.job_id}`}>
                                                                      <ChevronRight size={16} />
                                                                 </Link>
                                                            </Button>
                                                       </TableCell>
                                                  </TableRow>
                                             ))}
                                        </TableBody>
                                   </Table>
                              </CardContent>
                         </Card>

                         {/* ===== Mobile Cards ===== */}
                         <div className="grid grid-cols-1 gap-3 md:hidden">
                              {filteredApplications.map((app) => (
                                   <ApplicationCard key={app.id} application={app} />
                              ))}
                         </div>
                    </>
               )}
          </div>
     );
};

export default AppliedJobsPage;
