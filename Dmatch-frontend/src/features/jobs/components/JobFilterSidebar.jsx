import { MapPin, GraduationCap, Code2, DollarSign, RotateCcw } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
     Accordion,
     AccordionContent,
     AccordionItem,
     AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * Danh sách địa điểm cho bộ lọc — match backend location values.
 */
const FILTER_LOCATIONS = [
     { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
     { value: 'Hà Nội', label: 'Hà Nội' },
     { value: 'Đà Nẵng', label: 'Đà Nẵng' },
];

/**
 * Cấp bậc — match JobLevelResponse codes từ backend.
 */
const FILTER_LEVELS = [
     { value: 'INTERN', label: 'Thực tập sinh' },
     { value: 'FRESHER', label: 'Fresher' },
     { value: 'JUNIOR', label: 'Junior' },
     { value: 'MIDDLE', label: 'Middle' },
     { value: 'SENIOR', label: 'Senior' },
];

/**
 * Kỹ năng phổ biến — match JobCategoryResponse codes.
 */
const FILTER_SKILLS = [
     { value: 'BACKEND', label: 'Backend' },
     { value: 'FRONTEND', label: 'Frontend' },
     { value: 'FULLSTACK', label: 'Fullstack' },
     { value: 'JAVA', label: 'Java' },
     { value: 'SPRING_BOOT', label: 'Spring Boot' },
     { value: 'REACT', label: 'React' },
     { value: 'PYTHON', label: 'Python' },
     { value: 'NODEJS', label: 'Node.js' },
     { value: 'MICROSERVICES', label: 'Microservices' },
     { value: 'DATA_ENGINEERING', label: 'Data Engineering' },
     { value: 'DEVOPS', label: 'DevOps' },
     { value: 'AWS', label: 'AWS' },
];

/**
 * Config cho salary slider (đơn vị: triệu VND).
 */
const SALARY_MIN = 0;
const SALARY_MAX = 100;
const SALARY_STEP = 5;

/**
 * Format giá trị slider thành label hiển thị.
 */
const formatSalaryLabel = (value) => `${value}M`;

/**
 * Bộ lọc sidebar cho trang danh sách việc làm.
 * Nhận filters & setFilters từ parent, state được sync lên URL.
 *
 * @param {Object} props
 * @param {Object} props.filters - { locations: string[], levels: string[], skills: string[], salaryRange: [number, number] }
 * @param {Function} props.onFilterChange - (key, value) => void
 * @param {Function} props.onClearFilters - () => void
 */
const JobFilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
     const { locations = [], levels = [], skills = [], salaryRange = [SALARY_MIN, SALARY_MAX] } = filters;

     /**
      * Toggle một giá trị trong mảng checkbox (locations, levels).
      */
     const handleCheckboxToggle = (key, value) => {
          const current = filters[key] || [];
          const next = current.includes(value)
               ? current.filter((v) => v !== value)
               : [...current, value];
          onFilterChange(key, next);
     };

     /**
      * Toggle skill tag.
      */
     const handleSkillToggle = (skillValue) => {
          handleCheckboxToggle('skills', skillValue);
     };

     /**
      * Salary slider change.
      */
     const handleSalaryChange = (value) => {
          onFilterChange('salaryRange', value);
     };

     /**
      * Kiểm tra có filter nào đang active không.
      */
     const hasActiveFilters =
          locations.length > 0 ||
          levels.length > 0 ||
          skills.length > 0 ||
          salaryRange[0] !== SALARY_MIN ||
          salaryRange[1] !== SALARY_MAX;

     return (
          <div className="space-y-1">
               {/* Header + Clear */}
               <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">Bộ lọc</h2>
                    {hasActiveFilters && (
                         <Button
                              variant="ghost"
                              size="sm"
                              onClick={onClearFilters}
                              className="text-muted-foreground hover:text-foreground gap-1"
                         >
                              <RotateCcw size={14} />
                              Xóa bộ lọc
                         </Button>
                    )}
               </div>

               <Separator />

               <Accordion type="multiple" defaultValue={['locations', 'levels', 'skills', 'salary']} className="w-full">
                    {/* ===== Địa điểm ===== */}
                    <AccordionItem value="locations">
                         <AccordionTrigger className="hover:no-underline">
                              <span className="inline-flex items-center gap-2 text-sm font-medium">
                                   <MapPin size={16} className="text-primary" />
                                   Địa điểm
                              </span>
                         </AccordionTrigger>
                         <AccordionContent>
                              <div className="space-y-3">
                                   {FILTER_LOCATIONS.map((loc) => (
                                        <div key={loc.value} className="flex items-center gap-2">
                                             <Checkbox
                                                  id={`loc-${loc.value}`}
                                                  checked={locations.includes(loc.value)}
                                                  onCheckedChange={() => handleCheckboxToggle('locations', loc.value)}
                                             />
                                             <Label
                                                  htmlFor={`loc-${loc.value}`}
                                                  className="text-sm font-normal cursor-pointer"
                                             >
                                                  {loc.label}
                                             </Label>
                                        </div>
                                   ))}
                              </div>
                         </AccordionContent>
                    </AccordionItem>

                    {/* ===== Cấp bậc ===== */}
                    <AccordionItem value="levels">
                         <AccordionTrigger className="hover:no-underline">
                              <span className="inline-flex items-center gap-2 text-sm font-medium">
                                   <GraduationCap size={16} className="text-primary" />
                                   Cấp bậc
                              </span>
                         </AccordionTrigger>
                         <AccordionContent>
                              <div className="space-y-3">
                                   {FILTER_LEVELS.map((lvl) => (
                                        <div key={lvl.value} className="flex items-center gap-2">
                                             <Checkbox
                                                  id={`lvl-${lvl.value}`}
                                                  checked={levels.includes(lvl.value)}
                                                  onCheckedChange={() => handleCheckboxToggle('levels', lvl.value)}
                                             />
                                             <Label
                                                  htmlFor={`lvl-${lvl.value}`}
                                                  className="text-sm font-normal cursor-pointer"
                                             >
                                                  {lvl.label}
                                             </Label>
                                        </div>
                                   ))}
                              </div>
                         </AccordionContent>
                    </AccordionItem>

                    {/* ===== Kỹ năng (Tags) ===== */}
                    <AccordionItem value="skills">
                         <AccordionTrigger className="hover:no-underline">
                              <span className="inline-flex items-center gap-2 text-sm font-medium">
                                   <Code2 size={16} className="text-primary" />
                                   Kỹ năng
                              </span>
                         </AccordionTrigger>
                         <AccordionContent>
                              <div className="flex flex-wrap gap-2">
                                   {FILTER_SKILLS.map((skill) => {
                                        const isActive = skills.includes(skill.value);
                                        return (
                                             <Badge
                                                  key={skill.value}
                                                  variant={isActive ? 'default' : 'outline'}
                                                  className="cursor-pointer text-xs transition-colors"
                                                  onClick={() => handleSkillToggle(skill.value)}
                                             >
                                                  {skill.label}
                                             </Badge>
                                        );
                                   })}
                              </div>
                         </AccordionContent>
                    </AccordionItem>

                    {/* ===== Mức lương ===== */}
                    <AccordionItem value="salary">
                         <AccordionTrigger className="hover:no-underline">
                              <span className="inline-flex items-center gap-2 text-sm font-medium">
                                   <DollarSign size={16} className="text-primary" />
                                   Mức lương
                              </span>
                         </AccordionTrigger>
                         <AccordionContent>
                              <div className="space-y-4 px-1">
                                   <Slider
                                        value={salaryRange}
                                        onValueChange={handleSalaryChange}
                                        min={SALARY_MIN}
                                        max={SALARY_MAX}
                                        step={SALARY_STEP}
                                   />
                                   <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                             {formatSalaryLabel(salaryRange[0])}
                                        </span>
                                        <span className="text-xs">đến</span>
                                        <span className="font-medium text-foreground">
                                             {formatSalaryLabel(salaryRange[1])}
                                        </span>
                                   </div>
                                   <p className="text-xs text-muted-foreground">Đơn vị: triệu VND/tháng</p>
                              </div>
                         </AccordionContent>
                    </AccordionItem>
               </Accordion>
          </div>
     );
};

export default JobFilterSidebar;
