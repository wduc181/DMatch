import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Wrench, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const SkillsSection = () => {
     const form = useFormContext();
     const [inputValue, setInputValue] = useState('');

     const getSkills = () => {
          try {
               const raw = form.getValues('skills');
               return raw ? JSON.parse(raw) : [];
          } catch {
               return [];
          }
     };

     const saveSkills = (skills) => {
          form.setValue('skills', JSON.stringify(skills), { shouldDirty: true });
     };

     const handleAdd = () => {
          const trimmed = inputValue.trim();
          if (!trimmed) return;
          const skills = getSkills();
          if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
               setInputValue('');
               return;
          }
          skills.push(trimmed);
          saveSkills(skills);
          setInputValue('');
     };

     const handleKeyDown = (e) => {
          if (e.key === 'Enter') {
               e.preventDefault();
               handleAdd();
          }
     };

     const handleRemove = (index) => {
          const skills = getSkills();
          skills.splice(index, 1);
          saveSkills(skills);
     };

     const skills = getSkills();

     return (
          <div className="space-y-6">
               <div>
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                         <Wrench size={20} className="text-primary" />
                         Kỹ năng
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                         Thêm các kỹ năng chuyên môn của bạn. Nhấn Enter hoặc bấm nút để thêm.
                    </p>
               </div>
               <Separator />

               {/* Input */}
               <div className="flex gap-2">
                    <Input
                         value={inputValue}
                         onChange={(e) => setInputValue(e.target.value)}
                         onKeyDown={handleKeyDown}
                         placeholder="Nhập kỹ năng (ví dụ: React, Java, SQL...)"
                         className="flex-1"
                    />
                    <Button
                         type="button"
                         variant="outline"
                         size="sm"
                         onClick={handleAdd}
                         disabled={!inputValue.trim()}
                         className="gap-1.5 shrink-0"
                    >
                         <Plus size={16} />
                         Thêm
                    </Button>
               </div>

               {/* Tags */}
               {skills.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                         <Wrench size={40} className="mx-auto mb-3 opacity-30" />
                         <p className="text-sm">Chưa có kỹ năng nào.</p>
                         <p className="text-xs mt-1">Nhập và nhấn Enter để thêm kỹ năng.</p>
                    </div>
               ) : (
                    <div className="flex flex-wrap gap-2">
                         {skills.map((skill, idx) => (
                              <Badge
                                   key={idx}
                                   variant="secondary"
                                   className="px-3 py-1.5 text-sm gap-1.5 group hover:bg-destructive/10 transition-colors"
                              >
                                   {skill}
                                   <button
                                        type="button"
                                        onClick={() => handleRemove(idx)}
                                        className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
                                   >
                                        <X size={14} />
                                   </button>
                              </Badge>
                         ))}
                    </div>
               )}

               {skills.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                         {skills.length} kỹ năng
                    </p>
               )}
          </div>
     );
};

export default SkillsSection;
