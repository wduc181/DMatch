import { createElement } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const TONE_STYLES = {
     primary: 'bg-primary/10 text-primary',
     emerald: 'bg-emerald-500/10 text-emerald-700',
     amber: 'bg-amber-500/10 text-amber-700',
     slate: 'bg-slate-900/5 text-slate-700',
};

const AdminStatCard = ({ icon, label, value, description, tone = 'primary' }) => {
     return (
          <Card>
               <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                         <div>
                              <p className="text-sm text-muted-foreground">{label}</p>
                              <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
                              {description && (
                                   <p className="mt-2 text-xs text-muted-foreground">{description}</p>
                              )}
                         </div>
                         <div className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', TONE_STYLES[tone])}>
                              {createElement(icon, { size: 22 })}
                         </div>
                    </div>
               </CardContent>
          </Card>
     );
};

export default AdminStatCard;