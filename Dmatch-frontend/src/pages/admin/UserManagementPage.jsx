import { useDeferredValue, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Search, ShieldAlert, Users } from 'lucide-react';
import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogHeader,
     DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '@/components/ui/select';
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from '@/components/ui/table';
import UserActionMenu from '@/features/admin/components/UserActionMenu';
import UserRolesList from '@/features/admin/components/UserRolesList';
import UserStatusBadge from '@/features/admin/components/UserStatusBadge';
import { SAMPLE_ADMIN_USERS } from '@/data/sampleData';

const DATE_FORMATTER = new Intl.DateTimeFormat('vi-VN', {
     day: '2-digit',
     month: '2-digit',
     year: 'numeric',
});

const STATUS_FILTERS = [
     { value: 'ALL', label: 'Tất cả trạng thái' },
     { value: 'ACTIVE', label: 'Đang hoạt động' },
     { value: 'BANNED', label: 'Đã khóa' },
];

const ROLE_FILTERS = [
     { value: 'ALL', label: 'Tất cả vai trò' },
     { value: 'USER', label: 'Ứng viên' },
     { value: 'COMPANY', label: 'Nhà tuyển dụng' },
     { value: 'ADMIN', label: 'Quản trị viên' },
];

const formatDate = (value) => {
     if (!value) return '—';
     return DATE_FORMATTER.format(new Date(value));
};

const UserManagementPage = () => {
     const [searchValue, setSearchValue] = useState('');
     const [roleFilter, setRoleFilter] = useState('ALL');
     const [statusFilter, setStatusFilter] = useState('ALL');
     const [users, setUsers] = useState(SAMPLE_ADMIN_USERS);
     const [selectedUser, setSelectedUser] = useState(null);
     const [confirmTarget, setConfirmTarget] = useState(null);
     const [feedback, setFeedback] = useState(null);
     const deferredSearch = useDeferredValue(searchValue);

     const filteredUsers = useMemo(() => {
          const keyword = deferredSearch.trim().toLowerCase();

          return [...users]
               .filter((user) => {
                    const matchesKeyword = !keyword
                         || user.email?.toLowerCase().includes(keyword)
                         || user.fullName?.toLowerCase().includes(keyword);

                    const matchesRole = roleFilter === 'ALL' || user.roles?.includes(roleFilter);
                    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;

                    return matchesKeyword && matchesRole && matchesStatus;
               })
               .sort((left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0));
     }, [users, deferredSearch, roleFilter, statusFilter]);

     const handleToggleStatus = async () => {
          if (!confirmTarget) return;

          try {
               const updatedUsers = users.map((user) => {
                    if (user.id !== confirmTarget.id) return user;

                    return {
                         ...user,
                         status: user.status === 'BANNED' ? 'ACTIVE' : 'BANNED',
                    };
               });

               const updatedUser = updatedUsers.find((user) => user.id === confirmTarget.id);
               setUsers(updatedUsers);
               const isBanned = updatedUser?.status === 'BANNED';

               setFeedback({
                    type: 'success',
                    message: isBanned
                         ? `Đã khóa tài khoản ${updatedUser?.email}`
                         : `Đã mở khóa tài khoản ${updatedUser?.email}`,
               });
               setConfirmTarget(null);
               if (selectedUser?.id === updatedUser.id) {
                    setSelectedUser(updatedUser);
               }
          } catch {
               setFeedback({
                    type: 'error',
                    message: 'Không thể cập nhật trạng thái tài khoản.',
               });
               setConfirmTarget(null);
          }
     };

     return (
          <div className="space-y-6">
               <div>
                    <h1 className="text-2xl font-bold text-foreground">Quản lý người dùng</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                         Trang này đang dùng sample data cục bộ để bạn test UI trước khi nối API admin của user-service.
                    </p>
               </div>

               {feedback && (
                    <div
                         className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                              feedback.type === 'success'
                                   ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                   : 'border-destructive/20 bg-destructive/10 text-destructive'
                         }`}
                    >
                         {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                         <span>{feedback.message}</span>
                    </div>
               )}

               <Card>
                    <CardHeader className="gap-4">
                         <div>
                              <CardTitle className="flex items-center gap-2 text-lg">
                                   <Users size={20} className="text-primary" />
                                   Bộ lọc người dùng
                              </CardTitle>
                         </div>
                         <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
                              <div className="relative">
                                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                   <Input
                                        value={searchValue}
                                        onChange={(event) => setSearchValue(event.target.value)}
                                        placeholder="Tìm theo email hoặc họ tên..."
                                        className="pl-9"
                                   />
                              </div>

                              <Select value={roleFilter} onValueChange={setRoleFilter}>
                                   <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Lọc theo vai trò" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {ROLE_FILTERS.map((filter) => (
                                             <SelectItem key={filter.value} value={filter.value}>
                                                  {filter.label}
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>

                              <Select value={statusFilter} onValueChange={setStatusFilter}>
                                   <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Lọc theo trạng thái" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        {STATUS_FILTERS.map((filter) => (
                                             <SelectItem key={filter.value} value={filter.value}>
                                                  {filter.label}
                                             </SelectItem>
                                        ))}
                                   </SelectContent>
                              </Select>
                         </div>
                    </CardHeader>
                    <CardContent className="p-0">
                         {filteredUsers.length === 0 ? (
                              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                                   <Users size={40} className="text-muted-foreground/40" />
                                   <div>
                                        <p className="font-medium text-foreground">Không tìm thấy người dùng phù hợp</p>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                             Hãy thử nới lỏng từ khóa hoặc điều kiện lọc hiện tại.
                                        </p>
                                   </div>
                              </div>
                         ) : (
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead>ID</TableHead>
                                             <TableHead>Full Name</TableHead>
                                             <TableHead>Email</TableHead>
                                             <TableHead>Role</TableHead>
                                             <TableHead>Status</TableHead>
                                             <TableHead>Ngày tạo</TableHead>
                                             <TableHead className="w-12" />
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {filteredUsers.map((user) => (
                                             <TableRow key={user.id}>
                                                  <TableCell className="font-medium text-foreground">#{user.id}</TableCell>
                                                  <TableCell>
                                                       <div>
                                                            <p className="font-medium text-foreground">{user.fullName || 'Chưa cập nhật'}</p>
                                                       </div>
                                                  </TableCell>
                                                  <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                                                  <TableCell>
                                                       <UserRolesList roles={user.roles} />
                                                  </TableCell>
                                                  <TableCell>
                                                       <UserStatusBadge status={user.status} />
                                                  </TableCell>
                                                  <TableCell className="text-sm text-muted-foreground">
                                                       {formatDate(user.createdAt)}
                                                  </TableCell>
                                                  <TableCell>
                                                       <UserActionMenu
                                                            user={user}
                                                            onViewDetails={setSelectedUser}
                                                            onToggleStatus={setConfirmTarget}
                                                            disabled={false}
                                                       />
                                                  </TableCell>
                                             </TableRow>
                                        ))}
                                   </TableBody>
                              </Table>
                         )}
                    </CardContent>
               </Card>

               <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>Chi tiết người dùng</DialogTitle>
                              <DialogDescription>
                                   Thông tin chi tiết tài khoản đang được trả về từ UserResponse của user-service.
                              </DialogDescription>
                         </DialogHeader>
                         {selectedUser && (
                              <div className="space-y-4 text-sm">
                                   <div className="rounded-xl border bg-muted/30 p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Họ và tên</p>
                                        <p className="mt-1 text-base font-semibold text-foreground">{selectedUser.fullName || 'Chưa cập nhật'}</p>
                                   </div>

                                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="rounded-xl border p-4">
                                             <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</p>
                                             <p className="mt-1 text-foreground">{selectedUser.email}</p>
                                        </div>
                                        <div className="rounded-xl border p-4">
                                             <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Ngày tạo</p>
                                             <p className="mt-1 text-foreground">{formatDate(selectedUser.createdAt)}</p>
                                        </div>
                                   </div>

                                   <div className="rounded-xl border p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Vai trò</p>
                                        <div className="mt-2">
                                             <UserRolesList roles={selectedUser.roles} />
                                        </div>
                                   </div>

                                   <div className="rounded-xl border p-4">
                                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Trạng thái</p>
                                        <div className="mt-2">
                                             <UserStatusBadge status={selectedUser.status} />
                                        </div>
                                   </div>

                                   {selectedUser.roles?.includes('ADMIN') && (
                                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                                             <div className="flex items-start gap-3">
                                                  <ShieldAlert size={18} className="mt-0.5 shrink-0" />
                                                  <div>
                                                       <p className="font-medium">Tài khoản quản trị</p>
                                                       <p className="mt-1 text-amber-700">
                                                            Hãy cân nhắc kỹ trước khi thay đổi trạng thái tài khoản có quyền quản trị hệ thống.
                                                       </p>
                                                  </div>
                                             </div>
                                        </div>
                                   )}
                              </div>
                         )}
                    </DialogContent>
               </Dialog>

               <AlertDialog open={!!confirmTarget} onOpenChange={(open) => !open && setConfirmTarget(null)}>
                    <AlertDialogContent>
                         <AlertDialogHeader>
                              <AlertDialogTitle>
                                   {confirmTarget?.status === 'BANNED' ? 'Mở khóa tài khoản?' : 'Khóa tài khoản?'}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                   {confirmTarget?.status === 'BANNED'
                                        ? `Bạn có chắc muốn mở khóa tài khoản ${confirmTarget?.email}? Người dùng sẽ có thể truy cập hệ thống lại nếu còn hợp lệ.`
                                        : `Bạn có chắc muốn khóa tài khoản ${confirmTarget?.email}? Đây là thao tác nhạy cảm và sẽ chặn người dùng truy cập hệ thống.`}
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                   onClick={handleToggleStatus}
                                   className="bg-destructive text-white hover:bg-destructive/90"
                              >
                                   Xác nhận
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </div>
     );
};

export default UserManagementPage;
