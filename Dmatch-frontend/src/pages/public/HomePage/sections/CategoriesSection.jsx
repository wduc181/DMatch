import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layers, Loader2 } from 'lucide-react';
import CategoryCard from '@/components/common/CategoryCard';
import { getJobCategories } from '@/services/job.service';

const CategoriesSection = () => {
     const navigate = useNavigate();

     // Fetch categories từ API
     const { data: categoriesResponse, isLoading } = useQuery({
          queryKey: ['job-categories'],
          queryFn: getJobCategories,
          staleTime: 10 * 60 * 1000, // 10 phút (categories ít thay đổi)
     });

     const categories = categoriesResponse?.data?.data || [];

     const handleCategoryClick = (category) => {
          navigate(`/jobs?category_ids=${category.id}`);
     };

     if (isLoading) {
          return (
               <section className="py-12 md:py-16">
                    <div className="flex justify-center items-center py-16">
                         <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
               </section>
          );
     }

     if (categories.length === 0) {
          return null;
     }

     return (
          <section className="py-12 md:py-16">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-8">
                         <div className="inline-flex items-center gap-2 text-primary mb-2">
                              <Layers size={20} />
                              <span className="text-sm font-semibold uppercase tracking-wider">Ngành nghề</span>
                         </div>
                         <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                              Khám phá theo kỹ năng
                         </h2>
                         <p className="mt-2 text-muted-foreground">
                              Chọn tech stack bạn yêu thích để tìm việc phù hợp
                         </p>
                    </div>

                    {/* Category Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                         {categories.map((cat) => (
                              <CategoryCard
                                   key={cat.id}
                                   category={cat}
                                   onClick={handleCategoryClick}
                              />
                         ))}
                    </div>
               </div>
          </section>
     );
};

export default CategoriesSection;
