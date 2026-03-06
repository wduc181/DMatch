import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { GraduationCap, Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const EMPTY_EDUCATION = {
     school: '',
     major: '',
     degree: '',
     start_year: '',
     end_year: '',
};

const EducationSection = () => {
     const form = useFormContext();
     const [dialogOpen, setDialogOpen] = useState(false);
     const [editIndex, setEditIndex] = useState(null);
     const [formData, setFormData] = useState(EMPTY_EDUCATION);

     // Parse education JSON string from form
     const getItems = () => {
          try {
               const raw = form.getValues('education');
               return raw ? JSON.parse(raw) : [];
          } catch {
               return [];
          }
     };

     const saveItems = (items) => {
          form.setValue('education', JSON.stringify(items), { shouldDirty: true });
     };

     const handleOpen = (index = null) => {
          if (index !== null) {
               const items = getItems();
               setFormData(items[index]);
               setEditIndex(index);
          } else {
               setFormData(EMPTY_EDUCATION);
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
                              <GraduationCap size={20} className="text-primary" />
                              Học vấn
                         </h2>
                         <p className="text-sm text-muted-foreground mt-1">
                              Thông tin về quá trình học tập.
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
                         <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
                         <p className="text-sm">Chưa có thông tin học vấn.</p>
                         <p className="text-xs mt-1">Bấm &ldquo;Thêm&rdquo; để bổ sung.</p>
                    </div>
               ) : (
                    <div className="space-y-3">
                         {items.map((item, idx) => (
                              <Card key={idx} className="group hover:border-primary/30 transition-colors">
                                   <CardContent className="flex items-start justify-between p-4">
                                        <div className="space-y-1">
                                             <p className="font-medium text-foreground">{item.school}</p>
                                             <p className="text-sm text-muted-foreground">
                                                  {item.major}
                                                  {item.degree && (
                                                       <Badge variant="secondary" className="ml-2 text-xs">
                                                            {item.degree}
                                                       </Badge>
                                                  )}
                                             </p>
                                             <p className="text-xs text-muted-foreground">
                                                  {item.start_year}{item.end_year ? ` – ${item.end_year}` : ' – Hiện tại'}
                                             </p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                   {editIndex !== null ? 'Chỉnh sửa học vấn' : 'Thêm học vấn'}
                              </DialogTitle>
                         </DialogHeader>
                         <div className="space-y-4">
                              <div>
                                   <label className="text-sm font-medium">Tên trường</label>
                                   <Input
                                        value={formData.school}
                                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                        placeholder="Đại học Bách Khoa"
                                   />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                   <div>
                                        <label className="text-sm font-medium">Chuyên ngành</label>
                                        <Input
                                             value={formData.major}
                                             onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                                             placeholder="Khoa học máy tính"
                                        />
                                   </div>
                                   <div>
                                        <label className="text-sm font-medium">Bằng cấp</label>
                                        <Input
                                             value={formData.degree}
                                             onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                             placeholder="Cử nhân"
                                        />
                                   </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                   <div>
                                        <label className="text-sm font-medium">Năm bắt đầu</label>
                                        <Input
                                             value={formData.start_year}
                                             onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                                             placeholder="2020"
                                        />
                                   </div>
                                   <div>
                                        <label className="text-sm font-medium">Năm kết thúc</label>
                                        <Input
                                             value={formData.end_year}
                                             onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                                             placeholder="2024 (để trống nếu đang học)"
                                        />
                                   </div>
                              </div>
                         </div>
                         <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                   Hủy
                              </Button>
                              <Button type="button" onClick={handleSave} disabled={!formData.school}>
                                   {editIndex !== null ? 'Cập nhật' : 'Thêm'}
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </div>
     );
};

export default EducationSection;
