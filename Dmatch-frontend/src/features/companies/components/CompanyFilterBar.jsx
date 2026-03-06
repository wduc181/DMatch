import { Search, MapPin, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '@/components/ui/select';
import { LOCATIONS, COMPANY_SIZES } from '@/data/sampleData';

/**
 * CompanyFilterBar — thanh lọc nằm ngang cho trang CompanyListing.
 *
 * @param {object} props
 * @param {object} props.filters - { search, location, size }
 * @param {function} props.onFilterChange - (field, value) => void
 * @param {function} props.onSearch - () => void (trigger khi nhấn "Tìm kiếm")
 */
const CompanyFilterBar = ({ filters, onFilterChange, onSearch }) => {
     const handleKeyDown = (e) => {
          if (e.key === 'Enter') {
               onSearch?.();
          }
     };

     return (
          <div className="w-full max-w-5xl mx-auto">
               <div className="flex flex-col sm:flex-row items-stretch gap-3 p-3 bg-background rounded-xl border shadow-lg">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                         <Search
                              size={18}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                         />
                         <Input
                              placeholder="Tìm kiếm tên công ty..."
                              value={filters.search}
                              onChange={(e) => onFilterChange('search', e.target.value)}
                              onKeyDown={handleKeyDown}
                              className="pl-10 border-0 shadow-none focus-visible:ring-0 h-11"
                         />
                    </div>

                    {/* Location Select */}
                    <div className="sm:w-48">
                         <Select
                              value={filters.location}
                              onValueChange={(val) => onFilterChange('location', val)}
                         >
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

                    {/* Company Size Select */}
                    <div className="sm:w-52">
                         <Select
                              value={filters.size}
                              onValueChange={(val) => onFilterChange('size', val)}
                         >
                              <SelectTrigger className="border-0 shadow-none focus:ring-0 h-11 sm:border-l sm:rounded-l-none sm:border-border">
                                   <Users size={16} className="text-muted-foreground shrink-0 mr-1" />
                                   <SelectValue placeholder="Quy mô" />
                              </SelectTrigger>
                              <SelectContent>
                                   {COMPANY_SIZES.map((s) => (
                                        <SelectItem key={s.value} value={s.value}>
                                             {s.label}
                                        </SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>
                    </div>

                    {/* Search Button */}
                    <Button size="lg" className="h-11 px-6 shrink-0" onClick={onSearch}>
                         <Search size={18} />
                         <span className="hidden sm:inline ml-1">Tìm kiếm</span>
                    </Button>
               </div>
          </div>
     );
};

export default CompanyFilterBar;
