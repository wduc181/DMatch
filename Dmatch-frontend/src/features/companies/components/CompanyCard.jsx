import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * CompanyCard — hiển thị thông tin công ty.
 *
 * @param {object} props
 * @param {object} props.company - CompanyResponse DTO (snake_case)
 * @param {"compact"|"full"} [props.variant="full"]
 *   - "compact": dùng ở HomePage carousel (layout ngang, nhỏ gọn)
 *   - "full": dùng ở CompanyListingPage (layout dọc, card lớn, có cover)
 */
/**
 * Loại bỏ HTML tags, trả về plain text cho hiển thị tóm tắt.
 */
const stripHtml = (html) => {
     if (!html) return '';
     return html.replace(/<[^>]*>/g, '');
};

const CompanyCard = ({ company, variant = 'full' }) => {
     const initials = company.name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

     /**
      * Hiển thị quy mô công ty dạng dễ đọc.
      */
     const formatEmployeeSize = (size) => {
          if (!size) return null;
          if (size < 50) return '< 50 nhân viên';
          if (size < 150) return '50-150 nhân viên';
          if (size < 500) return '150-500 nhân viên';
          return '500+ nhân viên';
     };

     /* ============ COMPACT VARIANT (giữ nguyên style cũ cho HomePage) ============ */
     if (variant === 'compact') {
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
                                        {stripHtml(company.description)}
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
     }

     /* ============ FULL VARIANT (CompanyListingPage) ============ */
     return (
          <Link to={`/companies/${company.id}`} className="block group">
               <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 group-hover:-translate-y-1">
                    {/* Cover / Header — gradient giả cover image */}
                    <div className="relative h-24 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 overflow-hidden">
                         {/* Decorative pattern */}
                         <div className="absolute inset-0 opacity-30">
                              <div className="absolute top-2 right-4 size-16 rounded-full bg-primary/20 blur-xl" />
                              <div className="absolute bottom-1 left-6 size-12 rounded-full bg-primary/15 blur-lg" />
                         </div>

                         {/* Avatar đè lên cover */}
                         <div className="absolute -bottom-6 left-4">
                              <Avatar className="size-14 rounded-lg border-2 border-background shadow-md">
                                   {company.logo_url ? (
                                        <AvatarImage
                                             src={company.logo_url}
                                             alt={company.name}
                                             className="object-cover"
                                        />
                                   ) : null}
                                   <AvatarFallback className="rounded-lg bg-background text-primary font-bold text-lg">
                                        {initials}
                                   </AvatarFallback>
                              </Avatar>
                         </div>
                    </div>

                    <CardContent className="pt-8 space-y-3">
                         {/* Tên công ty */}
                         <h3 className="font-bold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-1 text-base">
                              {company.name}
                         </h3>

                         {/* Industry badge */}
                         {company.industry && (
                              <Badge variant="secondary" className="text-xs font-normal">
                                   {company.industry}
                              </Badge>
                         )}

                         {/* Info: Quy mô + Địa điểm */}
                         <div className="space-y-1.5 text-sm text-muted-foreground">
                              {company.employee_size && (
                                   <div className="flex items-center gap-1.5">
                                        <Users size={14} className="shrink-0 text-primary/70" />
                                        <span>{formatEmployeeSize(company.employee_size)}</span>
                                   </div>
                              )}
                              {company.address && (
                                   <div className="flex items-center gap-1.5">
                                        <MapPin size={14} className="shrink-0 text-primary/70" />
                                        <span className="truncate">{company.address}</span>
                                   </div>
                              )}
                         </div>

                         {/* Footer: Open jobs */}
                         {company.open_jobs != null && (
                              <div className="pt-2 border-t border-border">
                                   <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-center gap-1.5 text-primary hover:text-primary hover:bg-primary/5 text-xs font-medium"
                                        tabIndex={-1}
                                   >
                                        <Briefcase size={14} />
                                        {company.open_jobs} việc làm đang tuyển
                                   </Button>
                              </div>
                         )}
                    </CardContent>
               </Card>
          </Link>
     );
};

export default CompanyCard;
