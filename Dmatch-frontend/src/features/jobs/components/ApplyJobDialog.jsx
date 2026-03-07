import { Link } from 'react-router-dom';
import { LogIn, FileText, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from '@/components/ui/dialog';
import useAuthStore from '@/store/useAuthStore';

/**
 * Modal Ứng tuyển — hiển thị nội dung khác nhau tùy trạng thái auth.
 *
 * - Chưa đăng nhập → thông báo + nút đến /login
 * - Đăng nhập ROLE_USER → form chọn CV (placeholder, chờ backend Apply API)
 * - Đăng nhập role khác → thông báo không phải ứng viên
 *
 * @param {{ open: boolean, onOpenChange: (open: boolean) => void, jobTitle: string }} props
 */
const ApplyJobDialog = ({ open, onOpenChange, jobTitle }) => {
     const { isAuthenticated, user } = useAuthStore();

     const isCandidate = isAuthenticated && user?.roles?.includes('USER');

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

                    {/* Case 3: ROLE_USER — Form ứng tuyển (placeholder chờ API) */}
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
                                   {/* Chọn CV từ hồ sơ */}
                                   <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                             <FileText size={16} className="text-primary" />
                                             CV từ hồ sơ cá nhân
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                             Tính năng đang phát triển — sẽ hiển thị danh sách CV từ profile ứng viên.
                                        </p>
                                   </div>

                                   {/* Upload CV mới */}
                                   <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
                                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                             <Upload size={16} className="text-primary" />
                                             Upload CV mới
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                             Tính năng đang phát triển — cho phép upload file PDF/DOCX.
                                        </p>
                                   </div>
                              </div>
                              <DialogFooter>
                                   <Button variant="outline" onClick={() => onOpenChange(false)}>
                                        Hủy
                                   </Button>
                                   <Button disabled>
                                        <FileText size={16} />
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
