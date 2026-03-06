import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
     User, GraduationCap, Wrench, Briefcase, FileText,
     Save, Loader2, CheckCircle2, AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Form } from '@/components/ui/form';
import useAuthStore from '@/store/useAuthStore';
import { getMyProfileApi, updateMyProfileApi } from '@/services/user.service';

import PersonalInfoSection from './CandidateProfilePage/sections/PersonalInfoSection';
import EducationSection from './CandidateProfilePage/sections/EducationSection';
import SkillsSection from './CandidateProfilePage/sections/SkillsSection';
import ExperienceSection from './CandidateProfilePage/sections/ExperienceSection';
import DocumentsSection from './CandidateProfilePage/sections/DocumentsSection';

// ==================== Zod Schema ====================
const profileSchema = z.object({
     full_name: z.string().max(255, 'Tối đa 255 ký tự').optional().or(z.literal('')),
     email: z.string().optional(),
     phone_number: z
          .string()
          .regex(/^(\+?\d{9,15})?$/, 'Số điện thoại không hợp lệ')
          .optional()
          .or(z.literal('')),
     date_of_birth: z.string().optional().or(z.literal('')),
     gender: z.string().optional().or(z.literal('')),
     address: z.string().max(500, 'Tối đa 500 ký tự').optional().or(z.literal('')),
     bio: z.string().max(5000, 'Tối đa 5000 ký tự').optional().or(z.literal('')),
     skills: z.string().optional().or(z.literal('')),
     education: z.string().optional().or(z.literal('')),
     experience: z.string().optional().or(z.literal('')),
     github_url: z.string().url('URL GitHub không hợp lệ').optional().or(z.literal('')),
     linkedin_url: z.string().url('URL LinkedIn không hợp lệ').optional().or(z.literal('')),
     portfolio_url: z.string().url('URL Portfolio không hợp lệ').optional().or(z.literal('')),
     cv_file_url: z.string().url('URL CV không hợp lệ').optional().or(z.literal('')),
});

// ==================== Tab Config ====================
const TABS = [
     { value: 'info', label: 'Thông tin cá nhân', icon: User },
     { value: 'education', label: 'Học vấn', icon: GraduationCap },
     { value: 'skills', label: 'Kỹ năng', icon: Wrench },
     { value: 'experience', label: 'Kinh nghiệm', icon: Briefcase },
     { value: 'documents', label: 'Tài liệu', icon: FileText },
];

const CandidateProfilePage = () => {
     const user = useAuthStore((s) => s.user);
     const [isLoading, setIsLoading] = useState(true);
     const [isSaving, setIsSaving] = useState(false);
     const [toast, setToast] = useState(null); // { type: 'success'|'error', message }

     const form = useForm({
          resolver: zodResolver(profileSchema),
          defaultValues: {
               full_name: '',
               email: '',
               phone_number: '',
               date_of_birth: '',
               gender: '',
               address: '',
               bio: '',
               skills: '',
               education: '',
               experience: '',
               github_url: '',
               linkedin_url: '',
               portfolio_url: '',
               cv_file_url: '',
          },
     });

     // Fetch profile on mount
     useEffect(() => {
          const fetchProfile = async () => {
               try {
                    const res = await getMyProfileApi();
                    const data = res.data;
                    form.reset({
                         full_name: data.full_name || '',
                         email: data.email || '',
                         phone_number: data.phone_number || '',
                         date_of_birth: data.date_of_birth || '',
                         gender: data.gender || '',
                         address: data.address || '',
                         bio: data.bio || '',
                         skills: data.skills || '',
                         education: data.education || '',
                         experience: data.experience || '',
                         github_url: data.github_url || '',
                         linkedin_url: data.linkedin_url || '',
                         portfolio_url: data.portfolio_url || '',
                         cv_file_url: data.cv_file_url || '',
                    });
               } catch (err) {
                    console.error('Failed to fetch profile:', err);
                    // Fallback: điền email từ store
                    form.reset({
                         ...form.getValues(),
                         full_name: user?.fullName || '',
                         email: user?.email || '',
                    });
               } finally {
                    setIsLoading(false);
               }
          };
          fetchProfile();
     }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
               // Loại bỏ email (readonly) khỏi payload
               const { email, ...payload } = data;
               await updateMyProfileApi(payload);
               setToast({ type: 'success', message: 'Cập nhật hồ sơ thành công!' });
               form.reset(data); // reset dirty state
          } catch (err) {
               const msg = err.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
               setToast({ type: 'error', message: msg });
          } finally {
               setIsSaving(false);
          }
     };

     // Loading state
     if (isLoading) {
          return (
               <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                         <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                         <p className="text-sm text-muted-foreground">Đang tải hồ sơ...</p>
                    </div>
               </div>
          );
     }

     const initials = (form.getValues('full_name') || 'U')
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);

     return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               {/* Page Header */}
               <div className="flex items-center gap-4 mb-8">
                    <Avatar className="size-16 border-2 border-primary/20">
                         <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                              {initials}
                         </AvatarFallback>
                    </Avatar>
                    <div>
                         <h1 className="text-2xl font-bold text-foreground">
                              Hồ sơ ứng viên
                         </h1>
                         <p className="text-sm text-muted-foreground">
                              Cập nhật thông tin để tăng cơ hội được nhà tuyển dụng tìm thấy.
                         </p>
                    </div>
               </div>

               {/* Toast */}
               {toast && (
                    <div
                         className={`flex items-center gap-2 p-3 mb-6 rounded-lg text-sm transition-all ${toast.type === 'success'
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

               {/* Main Content */}
               <FormProvider {...form}>
                    <Form {...form}>
                         <form onSubmit={form.handleSubmit(onSubmit)}>
                              <Tabs defaultValue="info" orientation="vertical" className="md:flex-row">
                                   {/* Sidebar Navigation */}
                                   <TabsList
                                        variant="line"
                                        className="md:flex-col md:w-56 md:items-stretch md:h-auto shrink-0 overflow-x-auto md:overflow-visible bg-transparent p-0"
                                   >
                                        {TABS.map(({ value, label, icon: Icon }) => (
                                             <TabsTrigger
                                                  key={value}
                                                  value={value}
                                                  className="justify-start gap-2 px-3 py-2.5 text-sm rounded-lg data-[state=active]:bg-primary/5 data-[state=active]:text-primary"
                                             >
                                                  <Icon size={16} />
                                                  <span className="hidden md:inline">{label}</span>
                                             </TabsTrigger>
                                        ))}

                                        {/* Save button on sidebar (desktop) */}
                                        <Separator className="my-3 hidden md:block" />
                                        <Button
                                             type="submit"
                                             className="hidden md:flex gap-2 w-full"
                                             disabled={isSaving || !form.formState.isDirty}
                                        >
                                             {isSaving ? (
                                                  <Loader2 size={16} className="animate-spin" />
                                             ) : (
                                                  <Save size={16} />
                                             )}
                                             {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </Button>
                                   </TabsList>

                                   {/* Content Area */}
                                   <div className="flex-1 min-w-0">
                                        <Card className="border shadow-sm">
                                             <CardContent className="p-6">
                                                  <TabsContent value="info">
                                                       <PersonalInfoSection />
                                                  </TabsContent>
                                                  <TabsContent value="education">
                                                       <EducationSection />
                                                  </TabsContent>
                                                  <TabsContent value="skills">
                                                       <SkillsSection />
                                                  </TabsContent>
                                                  <TabsContent value="experience">
                                                       <ExperienceSection />
                                                  </TabsContent>
                                                  <TabsContent value="documents">
                                                       <DocumentsSection />
                                                  </TabsContent>
                                             </CardContent>
                                        </Card>

                                        {/* Mobile save button */}
                                        <div className="mt-4 md:hidden">
                                             <Button
                                                  type="submit"
                                                  className="w-full gap-2"
                                                  disabled={isSaving || !form.formState.isDirty}
                                             >
                                                  {isSaving ? (
                                                       <Loader2 size={16} className="animate-spin" />
                                                  ) : (
                                                       <Save size={16} />
                                                  )}
                                                  {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                             </Button>
                                        </div>
                                   </div>
                              </Tabs>
                         </form>
                    </Form>
               </FormProvider>
          </div>
     );
};

export default CandidateProfilePage;
