import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ROLE_META = {
     USER: {
          label: 'Ứng viên',
          className: 'border-blue-200 bg-blue-500/10 text-blue-700',
     },
     COMPANY: {
          label: 'Nhà tuyển dụng',
          className: 'border-amber-200 bg-amber-500/10 text-amber-700',
     },
     ADMIN: {
          label: 'Quản trị viên',
          className: 'border-primary/20 bg-primary/10 text-primary',
     },
};

const UserRolesList = ({ roles = [] }) => {
     if (roles.length === 0) {
          return <span className="text-sm text-muted-foreground">Chưa có quyền</span>;
     }

     return (
          <div className="flex flex-wrap gap-1.5">
               {roles.map((role) => {
                    const meta = ROLE_META[role] || {
                         label: role,
                         className: 'border-border bg-muted text-muted-foreground',
                    };

                    return (
                         <Badge key={role} variant="outline" className={cn('font-medium', meta.className)}>
                              {meta.label}
                         </Badge>
                    );
               })}
          </div>
     );
};

export default UserRolesList;