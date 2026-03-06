import { Building2 } from 'lucide-react';
import {
     Carousel,
     CarouselContent,
     CarouselItem,
     CarouselPrevious,
     CarouselNext,
} from '@/components/ui/carousel';
import CompanyCard from '@/features/companies/components/CompanyCard';
import { SAMPLE_COMPANIES } from '@/data/sampleData';

const TopCompaniesSection = () => {
     return (
          <section className="py-12 md:py-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-8">
                         <div className="inline-flex items-center gap-2 text-primary mb-2">
                              <Building2 size={20} />
                              <span className="text-sm font-semibold uppercase tracking-wider">Công ty nổi bật</span>
                         </div>
                         <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                              Nhà tuyển dụng hàng đầu
                         </h2>
                         <p className="mt-2 text-muted-foreground">
                              Các công ty đang tuyển dụng nhiều nhất
                         </p>
                    </div>

                    {/* Carousel */}
                    <div className="relative px-8 md:px-12">
                         <Carousel
                              opts={{
                                   align: 'start',
                                   loop: true,
                              }}
                         >
                              <CarouselContent className="-ml-4">
                                   {SAMPLE_COMPANIES.map((company) => (
                                        <CarouselItem
                                             key={company.id}
                                             className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                                        >
                                             <CompanyCard company={company} variant="compact" />
                                        </CarouselItem>
                                   ))}
                              </CarouselContent>
                              <CarouselPrevious className="-left-4 md:-left-6" />
                              <CarouselNext className="-right-4 md:-right-6" />
                         </Carousel>
                    </div>
               </div>
          </section>
     );
};

export default TopCompaniesSection;
