import { Eye, Lock, MoreHorizontal, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserActionMenu = ({ user, onViewDetails, onToggleStatus, disabled = false }) => {
     const isBanned = user?.status === 'BANNED';

     return (
          <DropdownMenu>
               <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label="Mở menu thao tác">
                         <MoreHorizontal size={16} />
                    </Button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(user)}>
                         <Eye size={14} />
                         Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                         variant="destructive"
                         disabled={disabled}
                         onClick={() => onToggleStatus(user)}
                    >
                         {isBanned ? <Unlock size={14} /> : <Lock size={14} />}
                         {isBanned ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                    </DropdownMenuItem>
               </DropdownMenuContent>
          </DropdownMenu>
     );
};

export default UserActionMenu;