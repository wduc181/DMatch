import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ForbiddenPage = () => {
     return (
          <div className="min-h-screen flex items-center justify-center bg-background">
               <div className="flex flex-col items-center text-center max-w-md px-4">
                    <div className="flex items-center justify-center size-20 rounded-full bg-destructive/10 text-destructive mb-6">
                         <ShieldX size={40} />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">403</h1>
                    <p className="text-lg text-muted-foreground mb-6">
                         Bạn không có quyền truy cập trang này.
                    </p>
                    <Button asChild>
                         <Link to="/">Về Trang Chủ</Link>
                    </Button>
               </div>
          </div>
     );
};

export default ForbiddenPage;
