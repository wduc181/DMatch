import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * Formats salary range to human-readable string.
 * @param {number} min - salary_min from DTO
 * @param {number} max - salary_max from DTO
 * @param {string} currency
 */
const formatSalary = (min, max, currency = 'VND') => {
     const format = (n) => {
          if (n >= 1000000) return `${(n / 1000000).toFixed(0)}M`;
          if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
          return n.toString();
     };
     return `${format(min)} - ${format(max)} ${currency}`;
};

/**
 * Calculates relative time from created_at.
 * @param {string} dateStr
 */
const timeAgo = (dateStr) => {
     const diff = Date.now() - new Date(dateStr).getTime();
     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
     if (days === 0) return 'Hôm nay';
     if (days === 1) return 'Hôm qua';
     if (days < 7) return `${days} ngày trước`;
     if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
     return `${Math.floor(days / 30)} tháng trước`;
};

const JobCard = ({ job }) => {
     return (
          <Link to={`/jobs/${job.id}`} className="block group">
               <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary/30 group-hover:-translate-y-0.5">
                    <CardContent className="space-y-4">
                         {/* Company + Time */}
                         <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                   <Building2 size={14} className="shrink-0" />
                                   {job.company_name}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                   <Clock size={12} />
                                   {timeAgo(job.created_at)}
                              </span>
                         </div>

                         {/* Title */}
                         <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                              {job.title}
                         </h3>

                         {/* Location + Salary */}
                         <div className="flex flex-col gap-2 text-sm">
                              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                   <MapPin size={14} className="shrink-0 text-primary/70" />
                                   {job.location}
                              </span>
                              <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                                   <DollarSign size={14} className="shrink-0" />
                                   {formatSalary(job.salary_min, job.salary_max, job.currency)}
                              </span>
                         </div>

                         {/* Categories / Skills */}
                         <div className="flex flex-wrap gap-1.5">
                              {job.categories?.slice(0, 4).map((cat) => (
                                   <Badge
                                        key={cat.id}
                                        variant="secondary"
                                        className="text-xs"
                                   >
                                        {cat.name}
                                   </Badge>
                              ))}
                              {job.categories?.length > 4 && (
                                   <Badge variant="outline" className="text-xs">
                                        +{job.categories.length - 4}
                                   </Badge>
                              )}
                         </div>

                         {/* Level badge */}
                         {job.job_level && (
                              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                                   {job.job_level.name}
                              </Badge>
                         )}
                    </CardContent>
               </Card>
          </Link>
     );
};

export default JobCard;
