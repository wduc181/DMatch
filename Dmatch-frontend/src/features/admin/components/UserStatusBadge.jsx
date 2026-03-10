import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_META = {
     ACTIVE: {
          label: 'Đang hoạt động',
          className: 'border-emerald-200 bg-emerald-500/10 text-emerald-700',
     },
     BANNED: {
          label: 'Đã khóa',
          className: 'border-destructive/20 bg-destructive/10 text-destructive',
     },
};

const UserStatusBadge = ({ status }) => {
     const meta = STATUS_META[status] || {
          label: status || 'Không rõ',
          className: 'border-border bg-muted text-muted-foreground',
     };

     return (
          <Badge variant="outline" className={cn('font-medium', meta.className)}>
               {meta.label}
          </Badge>
     );
};

export default UserStatusBadge;