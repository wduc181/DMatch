import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LogIn, FileText, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from '@/components/ui/dialog';
import useAuthStore from '@/store/useAuthStore';
import { getMyProfileApi } from '@/services/user.service';
import { useApplyToJob } from '@/hooks/useApplications';

/**
 * Modal Ứng tuyển — hiển thị nội dung khác nhau tùy trạng thái auth.
 *
 * - Chưa đăng nhập → thông báo + nút đến /login
 * - Đăng nhập ROLE_USER → form chọn CV + cover letter và submit application
 * - Đăng nhập role khác → thông báo không phải ứng viên
 *
 * @param {{ open: boolean, onOpenChange: (open: boolean) => void, jobId: number|string, jobTitle: string }} props
 */
const ApplyJobDialog = ({ open, onOpenChange, jobId, jobTitle }) => {
     const { isAuthenticated, user } = useAuthStore();
     const [cvUrl, setCvUrl] = useState('');
     const [coverLetter, setCoverLetter] = useState('');
     const [message, setMessage] = useState(null);

     const isCandidate = isAuthenticated
          && user?.roles?.includes('USER')
          && !user?.roles?.some((role) => ['COMPANY', 'ADMIN'].includes(role));
     const applyMutation = useApplyToJob();

     const { data: profile, isLoading: isProfileLoading } = useQuery({
          queryKey: ['candidateProfile', 'me'],
          queryFn: () => getMyProfileApi().then((res) => res.data),
          enabled: open && isCandidate,
     });

     useEffect(() => {
          if (open && profile?.cv_file_url) {
               setCvUrl(profile.cv_file_url);
          }
          if (!open) {
               setMessage(null);
               setCoverLetter('');
          }
     }, [open, profile]);

     const handleApply = async () => {
          setMessage(null);

          if (!cvUrl.trim()) {
               setMessage({ type: 'error', text: 'Vui lòng nhập URL CV trước khi gửi hồ sơ.' });
               return;
          }

          try {
               await applyMutation.mutateAsync({
                    jobId,
                    data: {
                         candidate_name: profile?.full_name || user?.fullName || user?.email,
                         cv_file_url: cvUrl.trim(),
                         cover_letter: coverLetter.trim() || null,
                    },
               });
               setMessage({ type: 'success', text: 'Ứng tuyển thành công.' });
               setTimeout(() => onOpenChange(false), 700);
          } catch (err) {
               setMessage({
                    type: 'error',
                    text: err.response?.data?.message || 'Không thể gửi hồ sơ. Vui lòng thử lại.',
               });
          }
     };

     return (
          <Dialog open={open} onOpenChange={onOpenChange}>
               <DialogContent className="sm:max-w-md">
                    {/* Case 1: Chưa đăng nhập */}
                    {!isAuthenticated && (
                         <>
                              <DialogHeader>
                                   <DialogTitle>Đăng nhập để ứng tuyển</DialogTitle>
                                   <DialogDescription>
                                        Bạn cần đăng nhập với tài khoản ứng viên để ứng tuyển vị trí này.
                                   </DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-col items-center gap-4 py-4">
                                   <div className="flex items-center justify-center size-16 rounded-full bg-primary/10">
                                        <LogIn size={28} className="text-primary" />
                                   </div>
                                   <p className="text-sm text-muted-foreground text-center">
                                        Vui lòng đăng nhập để ứng tuyển vị trí{' '}
                                        <span className="font-medium text-foreground">{jobTitle}</span>
                                   </p>
                              </div>
                              <DialogFooter>
                                   <Button variant="outline" onClick={() => onOpenChange(false)}>
                                        Để sau
                                   </Button>
                                   <Button asChild>
                                        <Link to="/login">
                                             <LogIn size={16} />
                                             Đăng nhập ngay
                                        </Link>
                                   </Button>
                              </DialogFooter>
                         </>
                    )}

                    {/* Case 2: Đăng nhập nhưng không phải USER (COMPANY/ADMIN) */}
                    {isAuthenticated && !isCandidate && (
                         <>
                              <DialogHeader>
                                   <DialogTitle>Không thể ứng tuyển</DialogTitle>
                                   <DialogDescription>
                                        Tài khoản của bạn không phải là tài khoản ứng viên.
                                   </DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-col items-center gap-4 py-4">
                                   <div className="flex items-center justify-center size-16 rounded-full bg-destructive/10">
                                        <AlertCircle size={28} className="text-destructive" />
                                   </div>
                                   <p className="text-sm text-muted-foreground text-center">
                                        Chỉ tài khoản ứng viên (Candidate) mới có thể ứng tuyển việc làm.
                                   </p>
                              </div>
                              <DialogFooter>
                                   <Button variant="outline" onClick={() => onOpenChange(false)}>
                                        Đóng
                                   </Button>
                              </DialogFooter>
                         </>
                    )}

                    {/* Case 3: ROLE_USER — Form ứng tuyển */}
                    {isCandidate && (
                         <>
                              <DialogHeader>
                                   <DialogTitle>Ứng tuyển việc làm</DialogTitle>
                                   <DialogDescription>
                                        Gửi hồ sơ ứng tuyển cho vị trí{' '}
                                        <span className="font-medium text-foreground">{jobTitle}</span>
                                   </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                   {message && (
                                        <div
                                             className={`flex items-center gap-2 rounded-md border p-3 text-sm ${
                                                  message.type === 'success'
                                                       ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                                       : 'border-destructive/20 bg-destructive/10 text-destructive'
                                             }`}
                                        >
                                             {message.type === 'success' ? (
                                                  <CheckCircle2 size={16} className="shrink-0" />
                                             ) : (
                                                  <AlertCircle size={16} className="shrink-0" />
                                             )}
                                             {message.text}
                                        </div>
                                   )}

                                   <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                             <FileText size={16} className="text-primary" />
                                             URL CV
                                        </label>
                                        <Input
                                             value={cvUrl}
                                             onChange={(event) => setCvUrl(event.target.value)}
                                             placeholder="https://..."
                                             disabled={isProfileLoading || applyMutation.isPending}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                             Hệ thống tự điền CV từ hồ sơ cá nhân nếu bạn đã cập nhật.
                                        </p>
                                   </div>

                                   <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                             Thư giới thiệu
                                        </label>
                                        <Textarea
                                             value={coverLetter}
                                             onChange={(event) => setCoverLetter(event.target.value)}
                                             placeholder="Viết ngắn gọn lý do bạn phù hợp với vị trí này..."
                                             className="min-h-28"
                                             disabled={applyMutation.isPending}
                                        />
                                   </div>
                              </div>
                              <DialogFooter>
                                   <Button
                                        variant="outline"
                                        onClick={() => onOpenChange(false)}
                                        disabled={applyMutation.isPending}
                                   >
                                        Hủy
                                   </Button>
                                   <Button onClick={handleApply} disabled={applyMutation.isPending || isProfileLoading}>
                                        {applyMutation.isPending ? (
                                             <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                             <FileText size={16} />
                                        )}
                                        Gửi hồ sơ
                                   </Button>
                              </DialogFooter>
                         </>
                    )}
               </DialogContent>
          </Dialog>
     );
};

export default ApplyJobDialog;
