import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Briefcase, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogFooter,
} from '@/components/ui/dialog';

const EMPTY_EXPERIENCE = {
     company: '',
     position: '',
     description: '',
     start_year: '',
     end_year: '',
};

const ExperienceSection = () => {
     const form = useFormContext();
     const [dialogOpen, setDialogOpen] = useState(false);
     const [editIndex, setEditIndex] = useState(null);
     const [formData, setFormData] = useState(EMPTY_EXPERIENCE);

     const getItems = () => {
          try {
               const raw = form.getValues('experience');
               return raw ? JSON.parse(raw) : [];
          } catch {
               return [];
          }
     };

     const saveItems = (items) => {
          form.setValue('experience', JSON.stringify(items), { shouldDirty: true });
     };

     const handleOpen = (index = null) => {
          if (index !== null) {
               const items = getItems();
               setFormData(items[index]);
               setEditIndex(index);
          } else {
               setFormData(EMPTY_EXPERIENCE);
               setEditIndex(null);
          }
          setDialogOpen(true);
     };

     const handleSave = () => {
          const items = getItems();
          if (editIndex !== null) {
               items[editIndex] = formData;
          } else {
               items.push(formData);
          }
          saveItems(items);
          setDialogOpen(false);
     };

     const handleDelete = (index) => {
          const items = getItems();
          items.splice(index, 1);
          saveItems(items);
     };

     const items = getItems();

     return (
          <div className="space-y-6">
               <div className="flex items-center justify-between">
                    <div>
                         <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <Briefcase size={20} className="text-primary" />
                              Kinh nghiệm làm việc
                         </h2>
                         <p className="text-sm text-muted-foreground mt-1">
                              Liệt kê các vị trí bạn đã từng đảm nhận.
                         </p>
                    </div>
                    <Button
                         type="button"
                         variant="outline"
                         size="sm"
                         onClick={() => handleOpen()}
                         className="gap-1.5"
                    >
                         <Plus size={16} />
                         Thêm
                    </Button>
               </div>
               <Separator />

               {items.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                         <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
                         <p className="text-sm">Chưa có kinh nghiệm làm việc.</p>
                         <p className="text-xs mt-1">Bấm &ldquo;Thêm&rdquo; để bổ sung.</p>
                    </div>
               ) : (
                    <div className="space-y-3">
                         {items.map((item, idx) => (
                              <Card key={idx} className="group hover:border-primary/30 transition-colors">
                                   <CardContent className="flex items-start justify-between p-4">
                                        <div className="space-y-1 flex-1 min-w-0">
                                             <p className="font-medium text-foreground">{item.position}</p>
                                             <p className="text-sm text-muted-foreground flex items-center gap-2">
                                                  {item.company}
                                                  <Badge variant="outline" className="text-xs">
                                                       {item.start_year}{item.end_year ? ` – ${item.end_year}` : ' – Hiện tại'}
                                                  </Badge>
                                             </p>
                                             {item.description && (
                                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                       {item.description}
                                                  </p>
                                             )}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                             <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => handleOpen(idx)}>
                                                  <Pencil size={14} />
                                             </Button>
                                             <Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => handleDelete(idx)}>
                                                  <Trash2 size={14} />
                                             </Button>
                                        </div>
                                   </CardContent>
                              </Card>
                         ))}
                    </div>
               )}

               {/* Dialog thêm/sửa */}
               <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>
                                   {editIndex !== null ? 'Chỉnh sửa kinh nghiệm' : 'Thêm kinh nghiệm'}
                              </DialogTitle>
                         </DialogHeader>
                         <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3">
                                   <div>
                                        <label className="text-sm font-medium">Công ty</label>
                                        <Input
                                             value={formData.company}
                                             onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                             placeholder="Tên công ty"
                                        />
                                   </div>
                                   <div>
                                        <label className="text-sm font-medium">Vị trí</label>
                                        <Input
                                             value={formData.position}
                                             onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                             placeholder="Frontend Developer"
                                        />
                                   </div>
                              </div>
                              <div>
                                   <label className="text-sm font-medium">Mô tả công việc</label>
                                   <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Mô tả ngắn gọn về vai trò và thành tích..."
                                        rows={3}
                                        className="resize-none"
                                   />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                   <div>
                                        <label className="text-sm font-medium">Năm bắt đầu</label>
                                        <Input
                                             value={formData.start_year}
                                             onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                                             placeholder="2022"
                                        />
                                   </div>
                                   <div>
                                        <label className="text-sm font-medium">Năm kết thúc</label>
                                        <Input
                                             value={formData.end_year}
                                             onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                                             placeholder="để trống nếu đang làm"
                                        />
                                   </div>
                              </div>
                         </div>
                         <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                   Hủy
                              </Button>
                              <Button type="button" onClick={handleSave} disabled={!formData.company || !formData.position}>
                                   {editIndex !== null ? 'Cập nhật' : 'Thêm'}
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </div>
     );
};

export default ExperienceSection;
