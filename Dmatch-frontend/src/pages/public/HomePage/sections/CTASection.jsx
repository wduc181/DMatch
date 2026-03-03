import { Link } from 'react-router-dom';
import { FileText, Megaphone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CTASection = () => {
     return (
          <section className="py-12 md:py-16 bg-muted/30">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* CTA for Candidates */}
                         <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                              <CardContent className="py-8 text-center space-y-4">
                                   <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary">
                                        <FileText size={28} />
                                   </div>
                                   <h3 className="text-xl font-bold text-foreground">
                                        Bạn đang tìm việc?
                                   </h3>
                                   <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                        Tạo hồ sơ chuyên nghiệp, để nhà tuyển dụng tìm thấy bạn
                                   </p>
                                   <Button size="lg" asChild>
                                        <Link to="/register">
                                             Tạo CV ngay
                                             <ArrowRight size={16} />
                                        </Link>
                                   </Button>
                              </CardContent>
                         </Card>

                         {/* CTA for Recruiters */}
                         <Card className="relative overflow-hidden border-primary/20">
                              <CardContent className="py-8 text-center space-y-4">
                                   <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary">
                                        <Megaphone size={28} />
                                   </div>
                                   <h3 className="text-xl font-bold text-foreground">
                                        Bạn cần tuyển dụng?
                                   </h3>
                                   <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                                        Đăng tin tuyển dụng và tiếp cận hàng nghìn ứng viên IT chất lượng
                                   </p>
                                   <Button size="lg" variant="outline" asChild>
                                        <Link to="/register">
                                             Đăng tin tuyển dụng
                                             <ArrowRight size={16} />
                                        </Link>
                                   </Button>
                              </CardContent>
                         </Card>
                    </div>
               </div>
          </section>
     );
};

export default CTASection;
