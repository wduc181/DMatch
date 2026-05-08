import SearchBar from '@/components/common/SearchBar';
import { Sparkles } from 'lucide-react';

const HeroSection = () => {
     return (
          <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
               {/* Decorative blurs */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 size-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 size-96 bg-primary/5 rounded-full blur-3xl" />
               </div>

               <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                         <Sparkles size={14} />
                         Nền tảng tuyển dụng IT #1 Việt Nam
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                         Kết nối đúng người,{' '}
                         <span className="text-primary">Trúng đúng việc</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                         Khám phá hàng nghìn cơ hội việc làm IT hấp dẫn từ những công ty hàng đầu Việt Nam
                    </p>

                    {/* Search */}
                    <div className="mt-8">
                         <SearchBar />
                    </div>

                    {/* Stats */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-muted-foreground">
                         <div className="text-center">
                              <span className="block text-2xl font-bold text-foreground">5,000+</span>
                              Việc làm IT
                         </div>
                         <div className="hidden sm:block w-px h-8 bg-border" />
                         <div className="text-center">
                              <span className="block text-2xl font-bold text-foreground">300+</span>
                              Công ty
                         </div>
                         <div className="hidden sm:block w-px h-8 bg-border" />
                         <div className="text-center">
                              <span className="block text-2xl font-bold text-foreground">10,000+</span>
                              Ứng viên
                         </div>
                    </div>
               </div>
          </section>
     );
};

export default HeroSection;
