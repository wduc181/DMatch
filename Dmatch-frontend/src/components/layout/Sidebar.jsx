import { NavLink, Link, useLocation } from 'react-router-dom';
import {
     LayoutDashboard,
     Building2,
     Briefcase,
     Users,
     ChevronLeft,
     ChevronRight,
     Menu,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
     Sheet,
     SheetContent,
     SheetTrigger,
} from '@/components/ui/sheet';

const RECRUITER_NAV = [
     {
          label: 'Tổng quan',
          path: '/recruiter/dashboard',
          icon: LayoutDashboard,
     },
     {
          label: 'Hồ sơ công ty',
          path: '/recruiter/company-profile',
          icon: Building2,
     },
     {
          label: 'Quản lý việc làm',
          path: '/recruiter/manage-jobs',
          icon: Briefcase,
     },
     {
          label: 'Quản lý ứng viên',
          path: '/recruiter/manage-candidates',
          icon: Users,
     },
];

const ADMIN_NAV = [
     {
          label: 'Tổng quan',
          path: '/admin/dashboard',
          icon: LayoutDashboard,
     },
     {
          label: 'Quản lý người dùng',
          path: '/admin/users',
          icon: Users,
     },
];

const SidebarNavItems = ({ items, collapsed }) => {
     return (
          <nav className="flex flex-col gap-1 px-3">
               {items.map(({ label, path, icon: Icon }) => (
                    <NavLink
                         key={path}
                         to={path}
                         className={({ isActive }) =>
                              cn(
                                   'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                                   isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                   collapsed && 'justify-center px-2',
                              )
                         }
                         title={collapsed ? label : undefined}
                    >
                         <Icon size={20} className="shrink-0" />
                         {!collapsed && <span>{label}</span>}
                    </NavLink>
               ))}
          </nav>
     );
};

const SidebarContent = ({ items, collapsed, onToggle }) => (
     <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={cn('flex items-center h-16 px-4 border-b border-border', collapsed ? 'justify-center' : 'gap-2')}>
               <Link to="/" className="flex items-center gap-1 group">
                    <span
                         className="text-xl font-bold tracking-tight"
                         style={{ fontFamily: "'Rethink Sans', sans-serif" }}
                    >
                         <span className="text-primary group-hover:text-primary/80 transition-colors">D</span>
                         {!collapsed && <span className="text-foreground group-hover:text-foreground/80 transition-colors">match</span>}
                    </span>
               </Link>
          </div>

          {/* Nav */}
          <div className="flex-1 py-4 overflow-y-auto">
               <SidebarNavItems items={items} collapsed={collapsed} />
          </div>

          {/* Toggle (desktop only) */}
          {onToggle && (
               <div className="border-t border-border p-3">
                    <Button
                         variant="ghost"
                         size="sm"
                         onClick={onToggle}
                         className={cn('w-full', collapsed ? 'justify-center' : 'justify-start gap-2')}
                    >
                         {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                         {!collapsed && <span className="text-xs">Thu gọn</span>}
                    </Button>
               </div>
          )}
     </div>
);

const Sidebar = () => {
     const [collapsed, setCollapsed] = useState(false);
     const location = useLocation();

     const isAdmin = location.pathname.startsWith('/admin');
     const navItems = isAdmin ? ADMIN_NAV : RECRUITER_NAV;

     return (
          <>
               {/* Desktop sidebar */}
               <aside
                    className={cn(
                         'hidden lg:flex flex-col border-r border-border bg-background transition-all duration-300',
                         collapsed ? 'w-17' : 'w-64',
                    )}
               >
                    <SidebarContent
                         items={navItems}
                         collapsed={collapsed}
                         onToggle={() => setCollapsed((c) => !c)}
                    />
               </aside>

               {/* Mobile: Sheet trigger + content */}
               <Sheet>
                    <SheetTrigger asChild>
                         <Button
                              variant="ghost"
                              size="icon"
                              className="fixed top-4 left-4 z-50 lg:hidden"
                         >
                              <Menu size={20} />
                         </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                         <SidebarContent items={navItems} collapsed={false} />
                    </SheetContent>
               </Sheet>
          </>
     );
};

export default Sidebar;
