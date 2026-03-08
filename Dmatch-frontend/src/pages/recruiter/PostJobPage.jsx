import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
     Briefcase, Save, Loader2, CheckCircle2, AlertCircle,
     ArrowLeft, MapPin, DollarSign, Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
     Form,
     FormField,
     FormItem,
     FormLabel,
     FormControl,
     FormMessage,
     FormDescription,
} from '@/components/ui/form';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '@/components/ui/select';
import useAuthStore from '@/store/useAuthStore';
import { useCompanyByOwner } from '@/hooks/useCompanies';
import {
     useJob,
     useJobLevels,
     useJobCategories,
     useCreateJob,
     useUpdateJob,
} from '@/hooks/useJobs';
import {
     SAMPLE_RECRUITER_COMPANY,
     SAMPLE_RECRUITER_JOBS,
     SAMPLE_JOB_LEVELS,
     SAMPLE_JOB_CATEGORIES,
} from '@/data/sampleData';

// ==================== Constants ====================
const JOB_TYPES = [
     { value: 'FULL_TIME', label: 'Toàn thời gian' },
     { value: 'PART_TIME', label: 'Bán thời gian' },
     { value: 'CONTRACT', label: 'Hợp đồng' },
     { value: 'INTERNSHIP', label: 'Thực tập' },
     { value: 'REMOTE', label: 'Từ xa' },
];

// ==================== Zod Schema ====================
const jobSchema = z.object({
     title: z.string().min(1, 'Tiêu đề là bắt buộc').max(255, 'Tối đa 255 ký tự'),
     description: z.string().min(1, 'Mô tả công việc là bắt buộc'),
     requirements: z.string().optional().or(z.literal('')),
     location: z.string().max(255, 'Tối đa 255 ký tự').optional().or(z.literal('')),
     job_type: z.string().min(1, 'Vui lòng chọn loại hình công việc'),
     salary_min: z
          .union([z.string(), z.number()])
          .transform((val) => (val === '' || val === null || val === undefined ? null : Number(val)))
          .pipe(z.number().min(0, 'Lương tối thiểu phải >= 0').nullable())
          .optional(),
     salary_max: z
          .union([z.string(), z.number()])
          .transform((val) => (val === '' || val === null || val === undefined ? null : Number(val)))
          .pipe(z.number().min(0, 'Lương tối đa phải >= 0').nullable())
          .optional(),
     currency: z.string().optional(),
     job_level_id: z.string().optional().or(z.literal('')),
     category_ids: z.array(z.number()).optional(),
}).refine(
     (data) => {
          if (data.salary_min != null && data.salary_max != null) {
               return data.salary_max >= data.salary_min;
          }
          return true;
     },
     { message: 'Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu', path: ['salary_max'] },
);

const PostJobPage = () => {
     const navigate = useNavigate();
     const [searchParams] = useSearchParams();
     const editJobId = searchParams.get('edit');
     const isEditMode = !!editJobId;

     const user = useAuthStore((s) => s.user);
     const [toast, setToast] = useState(null);

     // Fetch company
     const { data: apiCompany, isLoading: isLoadingCompany } = useCompanyByOwner(user?.id);

     // Fetch existing job if edit mode
     const { data: existingJob, isLoading: isLoadingJob } = useJob(editJobId);

     // Fetch reference data
     const { data: apiJobLevels = [] } = useJobLevels();
     const { data: apiJobCategories = [] } = useJobCategories();

     // Sample data fallback
     const company = apiCompany || SAMPLE_RECRUITER_COMPANY;
     const jobLevels = apiJobLevels.length > 0 ? apiJobLevels : SAMPLE_JOB_LEVELS;
     const jobCategories = apiJobCategories.length > 0 ? apiJobCategories : SAMPLE_JOB_CATEGORIES;
     // Khi edit mode và API chưa có, fallback sample job
     const sampleEditJob = isEditMode ? SAMPLE_RECRUITER_JOBS.find((j) => j.id === Number(editJobId)) : null;

     // Mutations
     const createJobMutation = useCreateJob();
     const updateJobMutation = useUpdateJob();
     const isSaving = createJobMutation.isPending || updateJobMutation.isPending;

     const form = useForm({
          resolver: zodResolver(jobSchema),
          defaultValues: {
               title: '',
               description: '',
               requirements: '',
               location: '',
               job_type: '',
               salary_min: '',
               salary_max: '',
               currency: 'VND',
               job_level_id: '',
               category_ids: [],
          },
     });

     // Pre-fill form when editing
     useEffect(() => {
          const jobToEdit = existingJob || sampleEditJob;
          if (isEditMode && jobToEdit) {
               form.reset({
                    title: jobToEdit.title || '',
                    description: jobToEdit.description || '',
                    requirements: jobToEdit.requirements || '',
                    location: jobToEdit.location || '',
                    job_type: jobToEdit.jobType || jobToEdit.job_type || '',
                    salary_min: jobToEdit.salaryMin ?? jobToEdit.salary_min ?? '',
                    salary_max: jobToEdit.salaryMax ?? jobToEdit.salary_max ?? '',
                    currency: jobToEdit.currency || 'VND',
                    job_level_id: (jobToEdit.jobLevel?.id || jobToEdit.job_level?.id)?.toString() || '',
                    category_ids: jobToEdit.categories?.map((c) => c.id) || [],
               });
          }
     }, [isEditMode, existingJob, sampleEditJob]); // eslint-disable-line react-hooks/exhaustive-deps

     // Auto-hide toast
     useEffect(() => {
          if (toast) {
               const timer = setTimeout(() => setToast(null), 4000);
               return () => clearTimeout(timer);
          }
     }, [toast]);

     const onSubmit = async (data) => {
          setToast(null);

          const payload = {
               title: data.title,
               description: data.description,
               requirements: data.requirements || null,
               location: data.location || null,
               job_type: data.job_type,
               salary_min: data.salary_min || null,
               salary_max: data.salary_max || null,
               currency: data.currency || 'VND',
               job_level_id: data.job_level_id ? Number(data.job_level_id) : null,
               category_ids: data.category_ids?.length ? data.category_ids : null,
          };

          try {
               if (isEditMode) {
                    await updateJobMutation.mutateAsync({
                         jobId: editJobId,
                         companyId: company.id,
                         data: payload,
                    });
                    setToast({ type: 'success', message: 'Cập nhật tin tuyển dụng thành công!' });
               } else {
                    await createJobMutation.mutateAsync({
                         companyId: company.id,
                         data: payload,
                    });
                    setToast({ type: 'success', message: 'Tạo tin tuyển dụng thành công!' });
                    form.reset();
               }
               // Redirect after short delay
               setTimeout(() => navigate('/recruiter/manage-jobs'), 1200);
          } catch (err) {
               const msg = err.response?.data?.message || 'Lưu thất bại. Vui lòng thử lại.';
               setToast({ type: 'error', message: msg });
          }
     };

     // Loading (chỉ khi có API thật)
     if (apiCompany && (isLoadingCompany || (isEditMode && isLoadingJob))) {
          return (
               <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                         <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                         <p className="text-sm text-muted-foreground">
                              {isEditMode ? 'Đang tải thông tin việc làm...' : 'Đang tải...'}
                         </p>
                    </div>
               </div>
          );
     }

     // No company (chỉ khi API trả về rõ ràng không có)
     if (apiCompany === null) {
          return (
               <div className="min-h-[60vh] flex items-center justify-center">
                    <Card className="max-w-md w-full text-center">
                         <CardContent className="pt-8 pb-6 flex flex-col items-center gap-4">
                              <Building2 size={48} className="text-muted-foreground" />
                              <h2 className="text-lg font-semibold">Chưa có hồ sơ công ty</h2>
                              <p className="text-sm text-muted-foreground">
                                   Vui lòng tạo hồ sơ công ty trước khi đăng tin tuyển dụng.
                              </p>
                              <Button asChild>
                                   <Link to="/recruiter/company-profile">Tạo hồ sơ công ty</Link>
                              </Button>
                         </CardContent>
                    </Card>
               </div>
          );
     }

     return (
          <div className="max-w-4xl mx-auto">
               {/* Back button + Header */}
               <div className="mb-6">
                    <Button
                         variant="ghost"
                         size="sm"
                         className="gap-1.5 mb-3 -ml-2 text-muted-foreground"
                         onClick={() => navigate('/recruiter/manage-jobs')}
                    >
                         <ArrowLeft size={16} />
                         Quay lại danh sách
                    </Button>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                         <Briefcase size={24} className="text-primary" />
                         {isEditMode ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng mới'}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                         {isEditMode
                              ? 'Cập nhật thông tin tin tuyển dụng của bạn.'
                              : 'Điền thông tin bên dưới để đăng tin tuyển dụng mới.'}
                    </p>
               </div>

               {/* Toast */}
               {toast && (
                    <div
                         className={`flex items-center gap-2 p-3 mb-6 rounded-lg text-sm ${
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
                                   <CardDescription>Tiêu đề, loại hình và địa điểm làm việc</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                             <FormItem>
                                                  <FormLabel>Tiêu đề *</FormLabel>
                                                  <FormControl>
                                                       <Input placeholder="VD: Senior Java Backend Developer" {...field} />
                                                  </FormControl>
                                                  <FormMessage />
                                             </FormItem>
                                        )}
                                   />

                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                             control={form.control}
                                             name="job_type"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Loại hình *</FormLabel>
                                                       <Select
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                       >
                                                            <FormControl>
                                                                 <SelectTrigger className="w-full">
                                                                      <SelectValue placeholder="Chọn loại hình" />
                                                                 </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                 {JOB_TYPES.map((t) => (
                                                                      <SelectItem key={t.value} value={t.value}>
                                                                           {t.label}
                                                                      </SelectItem>
                                                                 ))}
                                                            </SelectContent>
                                                       </Select>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />

                                        <FormField
                                             control={form.control}
                                             name="location"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel className="flex items-center gap-1.5">
                                                            <MapPin size={14} />
                                                            Địa điểm
                                                       </FormLabel>
                                                       <FormControl>
                                                            <Input placeholder="VD: Hồ Chí Minh" {...field} />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                   </div>

                                   <FormField
                                        control={form.control}
                                        name="job_level_id"
                                        render={({ field }) => (
                                             <FormItem>
                                                  <FormLabel>Cấp bậc</FormLabel>
                                                  <Select
                                                       value={field.value}
                                                       onValueChange={field.onChange}
                                                  >
                                                       <FormControl>
                                                            <SelectTrigger className="w-full md:w-64">
                                                                 <SelectValue placeholder="Chọn cấp bậc" />
                                                            </SelectTrigger>
                                                       </FormControl>
                                                       <SelectContent>
                                                            {jobLevels.map((level) => (
                                                                 <SelectItem key={level.id} value={level.id.toString()}>
                                                                      {level.name}
                                                                 </SelectItem>
                                                            ))}
                                                       </SelectContent>
                                                  </Select>
                                                  <FormMessage />
                                             </FormItem>
                                        )}
                                   />
                              </CardContent>
                         </Card>

                         {/* Mô tả & Yêu cầu */}
                         <Card>
                              <CardHeader>
                                   <CardTitle className="text-lg">Mô tả công việc</CardTitle>
                                   <CardDescription>Mô tả chi tiết và yêu cầu tuyển dụng</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                   <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                             <FormItem>
                                                  <FormLabel>Mô tả *</FormLabel>
                                                  <FormControl>
                                                       <Textarea
                                                            placeholder="Mô tả chi tiết về vị trí, trách nhiệm, quyền lợi..."
                                                            className="min-h-40"
                                                            {...field}
                                                       />
                                                  </FormControl>
                                                  <FormMessage />
                                             </FormItem>
                                        )}
                                   />

                                   <FormField
                                        control={form.control}
                                        name="requirements"
                                        render={({ field }) => (
                                             <FormItem>
                                                  <FormLabel>Yêu cầu ứng viên</FormLabel>
                                                  <FormControl>
                                                       <Textarea
                                                            placeholder="Kinh nghiệm, kỹ năng, bằng cấp cần thiết..."
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

                         {/* Mức lương */}
                         <Card>
                              <CardHeader>
                                   <CardTitle className="text-lg flex items-center gap-2">
                                        <DollarSign size={18} />
                                        Mức lương
                                   </CardTitle>
                                   <CardDescription>Khoảng lương cho vị trí này (VND)</CardDescription>
                              </CardHeader>
                              <CardContent>
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                             control={form.control}
                                             name="salary_min"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Lương tối thiểu</FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 type="number"
                                                                 min={0}
                                                                 placeholder="VD: 15000000"
                                                                 {...field}
                                                            />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />

                                        <FormField
                                             control={form.control}
                                             name="salary_max"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Lương tối đa</FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 type="number"
                                                                 min={0}
                                                                 placeholder="VD: 30000000"
                                                                 {...field}
                                                            />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />

                                        <FormField
                                             control={form.control}
                                             name="currency"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Đơn vị tiền tệ</FormLabel>
                                                       <Select
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                       >
                                                            <FormControl>
                                                                 <SelectTrigger className="w-full">
                                                                      <SelectValue placeholder="VND" />
                                                                 </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                 <SelectItem value="VND">VND</SelectItem>
                                                                 <SelectItem value="USD">USD</SelectItem>
                                                            </SelectContent>
                                                       </Select>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                   </div>
                                   <p className="text-xs text-muted-foreground mt-2">
                                        Để trống nếu muốn hiển thị "Thỏa thuận"
                                   </p>
                              </CardContent>
                         </Card>

                         {/* Danh mục */}
                         <Card>
                              <CardHeader>
                                   <CardTitle className="text-lg">Ngành nghề / Danh mục</CardTitle>
                                   <CardDescription>Chọn các danh mục phù hợp với vị trí tuyển dụng</CardDescription>
                              </CardHeader>
                              <CardContent>
                                   <FormField
                                        control={form.control}
                                        name="category_ids"
                                        render={({ field }) => (
                                             <FormItem>
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                       {jobCategories.map((cat) => {
                                                            const isChecked = field.value?.includes(cat.id);
                                                            return (
                                                                 <label
                                                                      key={cat.id}
                                                                      className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer has-[data-state=checked]:border-primary has-[data-state=checked]:bg-primary/5"
                                                                 >
                                                                      <Checkbox
                                                                           checked={isChecked}
                                                                           onCheckedChange={(checked) => {
                                                                                const next = checked
                                                                                     ? [...(field.value || []), cat.id]
                                                                                     : (field.value || []).filter((id) => id !== cat.id);
                                                                                field.onChange(next);
                                                                           }}
                                                                      />
                                                                      <span className="text-sm">{cat.name}</span>
                                                                 </label>
                                                            );
                                                       })}
                                                  </div>
                                                  <FormMessage />
                                                  {jobCategories.length === 0 && (
                                                       <p className="text-sm text-muted-foreground mt-2">
                                                            Đang tải danh mục...
                                                       </p>
                                                  )}
                                             </FormItem>
                                        )}
                                   />
                              </CardContent>
                         </Card>

                         {/* Actions */}
                         <div className="flex items-center justify-between">
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={() => navigate('/recruiter/manage-jobs')}
                              >
                                   Hủy
                              </Button>
                              <Button
                                   type="submit"
                                   className="gap-2"
                                   disabled={isSaving}
                              >
                                   {isSaving ? (
                                        <Loader2 size={16} className="animate-spin" />
                                   ) : (
                                        <Save size={16} />
                                   )}
                                   {isSaving
                                        ? 'Đang lưu...'
                                        : isEditMode
                                             ? 'Cập nhật tin'
                                             : 'Đăng tin tuyển dụng'}
                              </Button>
                         </div>
                    </form>
               </Form>
          </div>
     );
};

export default PostJobPage;
