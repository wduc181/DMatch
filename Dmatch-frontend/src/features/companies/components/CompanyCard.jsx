import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const CompanyCard = ({ company }) => {
     const initials = company.name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

     return (
          <Link to={`/companies/${company.id}`} className="block group">
               <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary/30 group-hover:-translate-y-0.5">
                    <CardContent className="flex items-center gap-4">
                         <Avatar className="size-14 rounded-lg shrink-0">
                              {company.logo_url ? (
                                   <AvatarImage
                                        src={company.logo_url}
                                        alt={company.name}
                                        className="object-cover"
                                   />
                              ) : null}
                              <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold text-lg">
                                   {initials}
                              </AvatarFallback>
                         </Avatar>

                         <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate">
                                   {company.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                   {company.description}
                              </p>
                              {company.open_jobs != null && (
                                   <span className="inline-flex items-center gap-1 text-xs text-primary mt-2">
                                        <Briefcase size={12} />
                                        {company.open_jobs} việc đang tuyển
                                   </span>
                              )}
                         </div>
                    </CardContent>
               </Card>
          </Link>
     );
};

export default CompanyCard;
