import { Clock, Eye, CheckCircle2, XCircle, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
     PENDING: {
          label: 'Chờ duyệt',
          icon: Clock,
          className: 'bg-amber-100 text-amber-700 border-amber-200',
     },
     REVIEWING: {
          label: 'Đang xem xét',
          icon: Eye,
          className: 'bg-blue-100 text-blue-700 border-blue-200',
     },
     ACCEPTED: {
          label: 'Đã chấp nhận',
          icon: CheckCircle2,
          className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
     },
     REJECTED: {
          label: 'Đã từ chối',
          icon: XCircle,
          className: 'bg-red-100 text-red-700 border-red-200',
     },
     WITHDRAWN: {
          label: 'Đã rút',
          icon: Undo2,
          className: 'bg-slate-100 text-slate-700 border-slate-200',
     },
};

const ApplicationStatusBadge = ({ status }) => {
     const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
     const Icon = config.icon;

     return (
          <Badge variant="outline" className={cn('gap-1', config.className)}>
               <Icon size={12} />
               {config.label}
          </Badge>
     );
};

export default ApplicationStatusBadge;
export { STATUS_CONFIG };
