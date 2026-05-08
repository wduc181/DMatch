import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardTopbar from './DashboardTopbar';

const DashboardLayout = () => {
     return (
          <div className="min-h-screen flex bg-muted/30">
               <Sidebar />
               <div className="flex-1 flex flex-col min-w-0">
                    <DashboardTopbar />
                    <main className="flex-1 p-4 lg:p-6">
                         <Outlet />
                    </main>
               </div>
          </div>
     );
};

export default DashboardLayout;
