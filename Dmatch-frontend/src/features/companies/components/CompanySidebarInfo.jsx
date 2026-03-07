import { MapPin, Users, Globe, Building, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/**
 * Format employee_size thành chuỗi dễ đọc.
 */
const formatEmployeeSize = (size) => {
     if (!size) return 'Chưa cập nhật';
     if (size < 50) return '< 50 nhân viên';
     if (size < 150) return '50 - 150 nhân viên';
     if (size < 500) return '150 - 500 nhân viên';
     return '500+ nhân viên';
};

const INFO_ITEMS = [
     {
          key: 'address',
          icon: MapPin,
          label: 'Địa chỉ',
          render: (company) => company.address,
     },
     {
          key: 'employee_size',
          icon: Users,
          label: 'Quy mô',
          render: (company) => formatEmployeeSize(company.employee_size),
     },
     {
          key: 'industry',
          icon: Building,
          label: 'Ngành nghề',
          render: (company) => company.industry,
     },
     {
          key: 'website',
          icon: Globe,
          label: 'Website',
          render: (company) => company.website,
          isLink: true,
     },
];

const CompanySidebarInfo = ({ company }) => {
     return (
          <Card>
               <CardHeader>
                    <CardTitle className="text-lg">Thông tin chung</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                    {INFO_ITEMS.map((item, index) => {
                         const value = item.render(company);
                         if (!value) return null;

                         return (
                              <div key={item.key}>
                                   {index > 0 && <Separator className="mb-4" />}
                                   <div className="flex items-start gap-3">
                                        <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 shrink-0">
                                             <item.icon size={16} className="text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                             <p className="text-xs text-muted-foreground mb-0.5">
                                                  {item.label}
                                             </p>
                                             {item.isLink ? (
                                                  <a
                                                       href={value}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                       className="text-sm font-medium text-primary hover:underline break-all"
                                                  >
                                                       {value}
                                                  </a>
                                             ) : (
                                                  <p className="text-sm font-medium text-foreground">
                                                       {value}
                                                  </p>
                                             )}
                                        </div>
                                   </div>
                              </div>
                         );
                    })}

                    {company.created_at && (
                         <>
                              <Separator />
                              <div className="flex items-start gap-3">
                                   <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 shrink-0">
                                        <Calendar size={16} className="text-primary" />
                                   </div>
                                   <div>
                                        <p className="text-xs text-muted-foreground mb-0.5">
                                             Tham gia từ
                                        </p>
                                        <p className="text-sm font-medium text-foreground">
                                             {new Date(company.created_at).toLocaleDateString('vi-VN', {
                                                  year: 'numeric',
                                                  month: 'long',
                                             })}
                                        </p>
                                   </div>
                              </div>
                         </>
                    )}
               </CardContent>
          </Card>
     );
};

export default CompanySidebarInfo;
