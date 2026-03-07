import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
     Building2, Save, Loader2, CheckCircle2, AlertCircle,
     Globe, MapPin, Users, Factory, ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
     Form,
     FormField,
     FormItem,
     FormLabel,
     FormControl,
     FormMessage,
} from '@/components/ui/form';
import useAuthStore from '@/store/useAuthStore';
import { getCompanyByOwnerId, createCompany, updateCompany } from '@/services/company.service';

// ==================== Zod Schema ====================
const companySchema = z.object({
     name: z.string().min(1, 'Tên công ty là bắt buộc').max(255, 'Tối đa 255 ký tự'),
     industry: z.string().max(255, 'Tối đa 255 ký tự').optional().or(z.literal('')),
     employee_size: z
          .union([z.string(), z.number()])
          .transform((val) => (val === '' || val === null || val === undefined ? null : Number(val)))
          .pipe(z.number().min(1, 'Quy mô phải ít nhất 1').nullable())
          .optional(),
     address: z.string().max(255, 'Tối đa 255 ký tự').optional().or(z.literal('')),
     website: z
          .string()
          .url('URL website không hợp lệ')
          .optional()
          .or(z.literal('')),
     description: z.string().optional().or(z.literal('')),
     logo_key: z.string().optional().or(z.literal('')),
     cover_key: z.string().optional().or(z.literal('')),
});

const INDUSTRY_OPTIONS = [
     'Công nghệ thông tin',
     'Tài chính - Ngân hàng',
     'Giáo dục - Đào tạo',
     'Y tế - Dược phẩm',
     'Thương mại điện tử',
     'Xây dựng - Bất động sản',
     'Sản xuất - Vận hành',
     'Marketing - Truyền thông',
     'Du lịch - Khách sạn',
     'Logistics - Vận tải',
     'Khác',
];

const CompanyProfileEditPage = () => {
     const user = useAuthStore((s) => s.user);
     const [isLoading, setIsLoading] = useState(true);
     const [isSaving, setIsSaving] = useState(false);
     const [isNewCompany, setIsNewCompany] = useState(false);
     const [toast, setToast] = useState(null);

     const form = useForm({
          resolver: zodResolver(companySchema),
          defaultValues: {
               name: '',
               industry: '',
               employee_size: '',
               address: '',
               website: '',
               description: '',
               logo_key: '',
               cover_key: '',
          },
     });

     // Fetch company on mount
     useEffect(() => {
          const fetchCompany = async () => {
               if (!user?.id) return;
               try {
                    const res = await getCompanyByOwnerId(user.id);
                    const data = res.data.data;
                    form.reset({
                         name: data.name || '',
                         industry: data.industry || '',
                         employee_size: data.employee_size ?? data.employeeSize ?? '',
                         address: data.address || '',
                         website: data.website || '',
                         description: data.description || '',
                         logo_key: data.logo_key ?? data.logoKey ?? '',
                         cover_key: data.cover_key ?? data.coverKey ?? '',
                    });
               } catch (err) {
                    if (err.response?.status === 404) {
                         setIsNewCompany(true);
                    } else {
                         console.error('Failed to fetch company:', err);
                    }
               } finally {
                    setIsLoading(false);
               }
          };
          fetchCompany();
     }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

     // Auto-hide toast
     useEffect(() => {
          if (toast) {
               const timer = setTimeout(() => setToast(null), 4000);
               return () => clearTimeout(timer);
          }
     }, [toast]);

     const onSubmit = async (data) => {
          setIsSaving(true);
          setToast(null);
          try {
               const payload = {
                    name: data.name,
                    description: data.description || null,
                    address: data.address || null,
                    logo_key: data.logo_key || null,
                    cover_key: data.cover_key || null,
                    website: data.website || null,
                    industry: data.industry || null,
                    employee_size: data.employee_size || null,
               };

               if (isNewCompany) {
                    await createCompany({ ...payload, ownerId: user.id });
                    setIsNewCompany(false);
                    setToast({ type: 'success', message: 'Tạo hồ sơ công ty thành công!' });
               } else {
                    await updateCompany(user.id, payload);
                    setToast({ type: 'success', message: 'Cập nhật hồ sơ công ty thành công!' });
               }
               form.reset(data);
          } catch (err) {
               const msg = err.response?.data?.message || 'Lưu thất bại. Vui lòng thử lại.';
               setToast({ type: 'error', message: msg });
          } finally {
               setIsSaving(false);
          }
     };

     if (isLoading) {
          return (
               <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                         <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                         <p className="text-sm text-muted-foreground">Đang tải hồ sơ công ty...</p>
                    </div>
               </div>
          );
     }

     return (
          <div className="max-w-4xl mx-auto">
               {/* Page Header */}
               <div className="mb-6">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                         <Building2 size={24} className="text-primary" />
                         {isNewCompany ? 'Tạo hồ sơ công ty' : 'Chỉnh sửa hồ sơ công ty'}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                         {isNewCompany
                              ? 'Vui lòng điền thông tin công ty trước khi đăng tin tuyển dụng.'
                              : 'Cập nhật thông tin công ty để thu hút ứng viên tốt hơn.'}
                    </p>
               </div>

               {/* Toast */}
               {toast && (
                    <div
                         className={`flex items-center gap-2 p-3 mb-6 rounded-lg text-sm transition-all ${
                              toast.type === 'success'
                                   ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                   : 'bg-destructive/10 text-destructive border border-destructive/20'
                         }`}
                    >
                         {toast.type === 'success' ? (
                              <CheckCircle2 size={16} className="shrink-0" />
                         ) : (
                              <AlertCircle size={16} className="shrink-0" />
                         )}
                         {toast.message}
                    </div>
               )}

               <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                         {/* Thông tin cơ bản */}
                         <Card>
                              <CardHeader>
                                   <CardTitle className="text-lg">Thông tin cơ bản</CardTitle>
                                   <CardDescription>Thông tin chính về công ty của bạn</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                             <FormItem>
                                                  <FormLabel>Tên công ty *</FormLabel>
                                                  <FormControl>
                                                       <Input placeholder="VD: Công ty TNHH ABC" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                             </FormItem>
                                        )}
                                   />

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                             control={form.control}
                                             name="industry"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel className="flex items-center gap-1.5">
                                                            <Factory size={14} />
                                                            Ngành nghề
                                                       </FormLabel>
                                                       <FormControl>
                                                            <select
                                                                 {...field}
                                                                 className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                            >
                                                                 <option value="">Chọn ngành nghề</option>
                                                                 {INDUSTRY_OPTIONS.map((opt) => (
                                                                      <option key={opt} value={opt}>
                                                                           {opt}
                                                                      </option>
                                                                 ))}
                                                            </select>
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />

                                        <FormField
                                             control={form.control}
                                             name="employee_size"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel className="flex items-center gap-1.5">
                                                            <Users size={14} />
                                                            Quy mô nhân sự
                                                       </FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 type="number"
                                                                 min={1}
                                                                 placeholder="VD: 50"
                                                                 {...field}
                                                            />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                   </div>

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                             control={form.control}
                                             name="address"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel className="flex items-center gap-1.5">
                                                            <MapPin size={14} />
                                                            Địa chỉ
                                                       </FormLabel>
                                                       <FormControl>
                                                            <Input placeholder="VD: 123 Nguyễn Huệ, Q.1, TP.HCM" {...field} />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />

                                        <FormField
                                             control={form.control}
                                             name="website"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel className="flex items-center gap-1.5">
                                                            <Globe size={14} />
                                                            Website
                                                       </FormLabel>
                                                       <FormControl>
                                                            <Input placeholder="https://example.com" {...field} />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                   </div>
                              </CardContent>
                         </Card>

                         {/* Mô tả */}
                         <Card>
                              <CardHeader>
                                   <CardTitle className="text-lg">Giới thiệu công ty</CardTitle>
                                   <CardDescription>Mô tả về công ty, văn hóa, sứ mệnh...</CardDescription>
                              </CardHeader>
                              <CardContent>
                                   <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                             <FormItem>
                                                  <FormControl>
                                                       <Textarea
                                                            placeholder="Hãy viết vài dòng giới thiệu về công ty..."
                                                            className="min-h-32"
                                                            {...field}
                                                       />
                                                  </FormControl>
                                                  <FormMessage />
                                             </FormItem>
                                        )}
                                   />
                              </CardContent>
                         </Card>

                         {/* Hình ảnh */}
                         <Card>
                              <CardHeader>
                                   <CardTitle className="text-lg flex items-center gap-2">
                                        <ImageIcon size={18} />
                                        Hình ảnh
                                   </CardTitle>
                                   <CardDescription>Logo và ảnh bìa công ty (nhập key từ file-storage)</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                             control={form.control}
                                             name="logo_key"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Logo Key</FormLabel>
                                                       <FormControl>
                                                            <Input placeholder="VD: companies/logo-abc.png" {...field} />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />

                                        <FormField
                                             control={form.control}
                                             name="cover_key"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Cover Key</FormLabel>
                                                       <FormControl>
                                                            <Input placeholder="VD: companies/cover-abc.png" {...field} />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                   </div>
                                   <p className="text-xs text-muted-foreground">
                                        * Upload file qua File Storage Service, sau đó dán key vào đây. (Sẽ hỗ trợ upload trực tiếp trong phiên bản tới)
                                   </p>
                              </CardContent>
                         </Card>

                         {/* Submit */}
                         <div className="flex justify-end">
                              <Button
                                   type="submit"
                                   className="gap-2"
                                   disabled={isSaving || !form.formState.isDirty}
                              >
                                   {isSaving ? (
                                        <Loader2 size={16} className="animate-spin" />
                                   ) : (
                                        <Save size={16} />
                                   )}
                                   {isSaving ? 'Đang lưu...' : isNewCompany ? 'Tạo hồ sơ' : 'Lưu thay đổi'}
                              </Button>
                         </div>
                    </form>
               </Form>
          </div>
     );
};

export default CompanyProfileEditPage;
