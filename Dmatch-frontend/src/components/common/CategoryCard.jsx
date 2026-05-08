import {
     Code2, Leaf, Network, Atom, Terminal,
     Database, Container, Cloud
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const iconMap = {
     Code2, Leaf, Network, Atom, Terminal,
     Database, Container, Cloud,
};

const CategoryCard = ({ category, onClick }) => {
     const IconComp = iconMap[category.icon] || Code2;

     return (
          <button
               onClick={() => onClick?.(category)}
               className="block w-full text-left group"
          >
               <Card className="h-full transition-all duration-300 hover:shadow-md hover:border-primary/30 group-hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="flex items-center gap-3 py-4">
                         <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                              <IconComp size={20} />
                         </div>
                         <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                              {category.name}
                         </span>
                    </CardContent>
               </Card>
          </button>
     );
};

export default CategoryCard;
