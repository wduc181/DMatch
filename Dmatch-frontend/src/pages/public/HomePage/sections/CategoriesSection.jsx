import { Layers } from 'lucide-react';
import CategoryCard from '@/components/common/CategoryCard';
import { SAMPLE_CATEGORIES } from '@/data/sampleData';

const CategoriesSection = () => {
     const handleCategoryClick = (category) => {
          // TODO: Khi tích hợp API, navigate đến /jobs?category=category.code
          console.log('Filter by category:', category.code);
     };

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
                         {SAMPLE_CATEGORIES.map((cat) => (
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
