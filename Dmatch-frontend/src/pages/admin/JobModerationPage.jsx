import { BriefcaseBusiness, Clock3, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from '@/components/ui/table';
import { SAMPLE_ADMIN_PENDING_JOBS } from '@/data/sampleData';

// TODO: Cần implement job moderation API trong backend (job-service)
// Khi có API: const { data: jobs } = usePendingJobs();
// Endpoint cần có: GET /api/v1/admin/jobs/pending hoặc GET /api/v1/jobs?status=PENDING_REVIEW

const MODERATION_META = {
     PENDING_REVIEW: {
          label: 'Chờ duyệt',
          className: 'border-amber-200 bg-amber-500/10 text-amber-700',
     },
     ESCALATED: {
          label: 'Ưu tiên cao',
          className: 'border-destructive/20 bg-destructive/10 text-destructive',
     },
};

const JobModerationPage = () => {
     const jobs = SAMPLE_ADMIN_PENDING_JOBS;

     return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-2xl font-bold text-foreground">Kiểm duyệt việc làm</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                         Trang này đang dùng dữ liệu mẫu để bạn kiểm tra bố cục moderation trước khi nối backend.
                    </p>
               </div>

               <Card>
                    <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                         <div>
                              <CardTitle className="flex items-center gap-2 text-lg">
                                   <BriefcaseBusiness size={20} className="text-primary" />
                                   Danh sách tin cần admin xem xét
                              </CardTitle>
                         </div>
                         <Badge variant="outline" className="border-amber-200 bg-amber-500/10 text-amber-700">
                              {jobs.length} mục mẫu
                         </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                         <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                              <div className="flex items-start gap-3">
                                   <ShieldAlert size={18} className="mt-0.5 shrink-0" />
                                   <div>
                                        <p className="font-medium">Đây là dữ liệu mock để test UI moderation.</p>
                                        <p className="mt-1 text-amber-700">
                                             Khi backend bổ sung API duyệt job, bạn có thể thay mảng sample bằng dữ liệu thật và giữ nguyên bố cục hiện tại.
                                        </p>
                                   </div>
                              </div>
                         </div>

                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Job ID</TableHead>
                                        <TableHead>Tiêu đề</TableHead>
                                        <TableHead>Công ty</TableHead>
                                        <TableHead>Địa điểm</TableHead>
                                        <TableHead>Lý do</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {jobs.map((job) => {
                                        const meta = MODERATION_META[job.moderationStatus] || {
                                             label: job.moderationStatus,
                                             className: 'border-border bg-muted text-muted-foreground',
                                        };

                                        return (
                                             <TableRow key={job.id}>
                                                  <TableCell className="font-medium text-foreground">#{job.id}</TableCell>
                                                  <TableCell>{job.title}</TableCell>
                                                  <TableCell>{job.companyName}</TableCell>
                                                  <TableCell>{job.location}</TableCell>
                                                  <TableCell className="max-w-xs text-muted-foreground">{job.reportedReason}</TableCell>
                                                  <TableCell>
                                                       <Badge variant="outline" className={meta.className}>
                                                            <Clock3 size={12} />
                                                            {meta.label}
                                                       </Badge>
                                                  </TableCell>
                                             </TableRow>
                                        );
                                   })}
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
};

export default JobModerationPage;