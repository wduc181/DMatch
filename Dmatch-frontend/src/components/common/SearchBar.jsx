import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '@/components/ui/select';
import { LOCATIONS } from '@/constants/filters';

const SearchBar = () => {
     return (
          <div className="w-full max-w-3xl mx-auto">
               <div className="flex flex-col sm:flex-row items-stretch gap-3 p-2 bg-background rounded-xl border shadow-lg">
                    {/* Keyword Input */}
                    <div className="flex-1 relative">
                         <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                         <Input
                              placeholder="Tìm kiếm việc làm, công ty, kỹ năng..."
                              className="pl-10 border-0 shadow-none focus-visible:ring-0 h-11"
                         />
                    </div>

                    {/* Location Select */}
                    <div className="sm:w-48">
                         <Select defaultValue="all">
                              <SelectTrigger className="border-0 shadow-none focus:ring-0 h-11 sm:border-l sm:rounded-l-none sm:border-border">
                                   <MapPin size={16} className="text-muted-foreground shrink-0 mr-1" />
                                   <SelectValue placeholder="Địa điểm" />
                              </SelectTrigger>
                              <SelectContent>
                                   {LOCATIONS.map((loc) => (
                                        <SelectItem key={loc.value} value={loc.value}>
                                             {loc.label}
                                        </SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>
                    </div>

                    {/* Search Button */}
                    <Button size="lg" className="h-11 px-6 shrink-0">
                         <Search size={18} />
                         <span className="hidden sm:inline">Tìm kiếm</span>
                    </Button>
               </div>
          </div>
     );
};

export default SearchBar;
