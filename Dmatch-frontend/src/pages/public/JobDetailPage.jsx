import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
     ArrowLeft,
     MapPin,
     Clock,
     DollarSign,
     Briefcase,
     Loader2,
     SearchX,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJob } from '@/hooks/useJobs';
import { useCompany } from '@/hooks/useCompanies';
import { useMyApplicationForJob } from '@/hooks/useApplications';
import useAuthStore from '@/store/useAuthStore';
import JobCompanySidebar from '@/features/jobs/components/JobCompanySidebar';
import ApplyJobDialog from '@/features/jobs/components/ApplyJobDialog';

/**
 * Formats salary range to human-readable string.
 */
const formatSalary = (min, max, currency = 'VND') => {
     const format = (n) => {
          if (n >= 1000000) return `${(n / 1000000).toFixed(0)}M`;
          if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
          return n.toString();
     };
     if (!min && !max) return 'Thỏa thuận';
     if (!min) return `Tới ${format(max)} ${currency}`;
     if (!max) return `Từ ${format(min)} ${currency}`;
     return `${format(min)} - ${format(max)} ${currency}`;
};

/**
 * Map job_type code sang label tiếng Việt.
 */
const JOB_TYPE_LABELS = {
     FULL_TIME: 'Toàn thời gian',
     PART_TIME: 'Bán thời gian',
     INTERNSHIP: 'Thực tập',
     CONTRACT: 'Hợp đồng',
     FREELANCE: 'Freelance',
};

/**
 * Calculates relative time from date string.
 */
const timeAgo = (dateStr) => {
     if (!dateStr) return '';
     const diff = Date.now() - new Date(dateStr).getTime();
     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
     if (days === 0) return 'Hôm nay';
     if (days === 1) return 'Hôm qua';
     if (days < 7) return `${days} ngày trước`;
     if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
     return `${Math.floor(days / 30)} tháng trước`;
};

const JobDetailPage = () => {
     const { id } = useParams();
     const [applyOpen, setApplyOpen] = useState(false);
     const { isAuthenticated, user } = useAuthStore();
     const isCandidate = isAuthenticated
          && user?.roles?.includes('USER')
          && !user?.roles?.some((role) => ['COMPANY', 'ADMIN'].includes(role));

     // Fetch job detail từ API
     const {
          data: job,
          isLoading: isJobLoading,
          isError: isJobError,
     } = useJob(id);

     // Fetch company info (Microservices pattern: gọi sang company-service)
     const {
          data: company,
          isLoading: isCompanyLoading,
     } = useCompany(job?.company_id);

     const { data: myApplication } = useMyApplicationForJob(id, {
          enabled: isCandidate && !!id,
     });

     // Loading state
     if (isJobLoading) {
          return (
               <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 size={32} className="animate-spin text-primary" />
               </div>
          );
     }

     // Not found or error
     if (isJobError || !job) {
          return (
               <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                    <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                         <SearchX size={28} className="text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                         Không tìm thấy việc làm
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                         Tin tuyển dụng này không tồn tại hoặc đã bị xóa.
                    </p>
                    <Button asChild variant="outline">
                         <Link to="/jobs">
                              <ArrowLeft size={16} />
                              Quay lại danh sách
                         </Link>
                    </Button>
               </div>
          );
     }

     const jobTypeLabel = JOB_TYPE_LABELS[job.job_type] || job.job_type;

     return (
          <>
               {/* ===== Job Header Section ===== */}
               <section className="bg-muted/50 border-b border-border">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                         {/* Breadcrumb-style back link */}
                         <Link
                              to="/jobs"
                              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
                         >
                              <ArrowLeft size={14} />
                              Quay lại danh sách việc làm
                         </Link>

                         <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                              {/* Title + Badges */}
                              <div className="space-y-4 min-w-0 flex-1">
                                   <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                                        {job.title}
                                   </h1>

                                   {/* Company name link */}
                                   {(job.company_name || company?.name) && (
                                        <Link
                                             to={`/companies/${job.company_id}`}
                                             className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                             <Briefcase size={14} />
                                             {job.company_name || company?.name}
                                        </Link>
                                   )}

                                   {/* Badge row */}
                                   <div className="flex flex-wrap items-center gap-2">
                                        {job.location && (
                                             <Badge variant="secondary" className="gap-1">
                                                  <MapPin size={12} />
                                                  {job.location}
                                             </Badge>
                                        )}
                                        {job.job_type && (
                                             <Badge variant="secondary" className="gap-1">
                                                  <Clock size={12} />
                                                  {jobTypeLabel}
                                             </Badge>
                                        )}
                                        {(job.salary_min || job.salary_max) && (
                                             <Badge variant="secondary" className="gap-1 font-medium">
                                                  <DollarSign size={12} />
                                                  {formatSalary(job.salary_min, job.salary_max, job.currency)}
                                             </Badge>
                                        )}
                                        {job.job_level && (
                                             <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">
                                                  {job.job_level.name}
                                             </Badge>
                                        )}
                                   </div>

                                   {/* Posted time */}
                                   {job.created_at && (
                                        <p className="text-xs text-muted-foreground">
                                             Đăng {timeAgo(job.created_at)}
                                        </p>
                                   )}
                              </div>

                              {/* Apply CTA */}
                              <div className="shrink-0 lg:pt-1">
                                   <Button
                                        size="lg"
                                        className="w-full lg:w-auto text-base px-8"
                                        onClick={() => setApplyOpen(true)}
                                        disabled={!!myApplication}
                                   >
                                        {myApplication ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
                                   </Button>
                              </div>
                         </div>
                    </div>
               </section>

               {/* ===== Main Content + Sidebar ===== */}
               <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                         {/* Cột trái — Nội dung chính (70%) */}
                         <div className="lg:col-span-2 space-y-8">
                              {/* Mô tả công việc */}
                              {job.description && (
                                   <Card>
                                        <CardHeader>
                                             <CardTitle className="text-lg">Mô tả công việc</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                             <div
                                                  className="prose prose-sm max-w-none text-foreground
                                                       prose-headings:text-foreground prose-headings:font-semibold
                                                       prose-p:text-muted-foreground prose-p:leading-relaxed
                                                       prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                                       prose-li:text-muted-foreground
                                                       prose-strong:text-foreground"
                                                  dangerouslySetInnerHTML={{ __html: job.description }}
                                             />
                                        </CardContent>
                                   </Card>
                              )}

                              {/* Yêu cầu ứng viên */}
                              {job.requirements && (
                                   <Card>
                                        <CardHeader>
                                             <CardTitle className="text-lg">Yêu cầu ứng viên</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                             <div
                                                  className="prose prose-sm max-w-none text-foreground
                                                       prose-headings:text-foreground prose-headings:font-semibold
                                                       prose-p:text-muted-foreground prose-p:leading-relaxed
                                                       prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                                       prose-li:text-muted-foreground
                                                       prose-strong:text-foreground"
                                                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                                             />
                                        </CardContent>
                                   </Card>
                              )}

                              {/* Kỹ năng / Danh mục */}
                              {job.categories?.length > 0 && (
                                   <Card>
                                        <CardHeader>
                                             <CardTitle className="text-lg">Kỹ năng yêu cầu</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                             <div className="flex flex-wrap gap-2">
                                                  {job.categories.map((cat) => (
                                                       <Badge
                                                            key={cat.id}
                                                            variant="secondary"
                                                            className="text-sm"
                                                       >
                                                            {cat.name}
                                                       </Badge>
                                                  ))}
                                             </div>
                                        </CardContent>
                                   </Card>
                              )}

                              {/* Bottom CTA — Mobile friendly */}
                              <div className="flex items-center justify-center lg:hidden">
                                   <Button
                                        size="lg"
                                        className="w-full text-base"
                                        onClick={() => setApplyOpen(true)}
                                        disabled={!!myApplication}
                                   >
                                        {myApplication ? 'Đã ứng tuyển' : 'Ứng tuyển ngay'}
                                   </Button>
                              </div>
                         </div>

                         {/* Cột phải — Sidebar (30%) */}
                         <div className="lg:col-span-1">
                              <JobCompanySidebar
                                   company={company}
                                   job={job}
                                   isLoading={isCompanyLoading}
                              />
                         </div>
                    </div>
               </section>

               {/* ===== Apply Dialog ===== */}
               <ApplyJobDialog
                    open={applyOpen}
                    onOpenChange={setApplyOpen}
                    jobId={job.id}
                    jobTitle={job.title}
               />
          </>
     );
};

export default JobDetailPage;
