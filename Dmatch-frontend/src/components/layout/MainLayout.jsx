import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Footer from './Footer';

const MainLayout = () => {
     return (
          <div className="min-h-screen flex flex-col">
               <Topbar />
               <main className="flex-1">
                    <Outlet />
               </main>
               <Footer />
          </div>
     );
};

export default MainLayout;
