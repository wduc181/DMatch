import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage,
} from '@/components/ui/form';

// Schema Ứng viên: fullName bắt buộc (match AuthRegisterRequest.fullName)
const candidateSchema = z.object({
     fullName: z.string().min(2, 'Họ và tên tối thiểu 2 ký tự'),
     phone: z.string().optional(),
});

// Schema Nhà tuyển dụng: fullName + company info
const recruiterSchema = z.object({
     fullName: z.string().min(2, 'Họ và tên tối thiểu 2 ký tự'),
     companyName: z.string().min(1, 'Tên công ty không được để trống'),
     companyAddress: z.string().optional(),
});

const OnboardingPage = () => {
     const location = useLocation();
     const navigate = useNavigate();
     const [activeTab, setActiveTab] = useState('candidate');

     const { email, password } = location.state || {};

     // Guard: nếu không có state → redirect về /register
     useEffect(() => {
          if (!email || !password) {
               navigate('/register', { replace: true });
          }
     }, [email, password, navigate]);

     const candidateForm = useForm({
          resolver: zodResolver(candidateSchema),
          defaultValues: { fullName: '', phone: '' },
     });

     const recruiterForm = useForm({
          resolver: zodResolver(recruiterSchema),
          defaultValues: { fullName: '', companyName: '', companyAddress: '' },
     });

     const handleCandidateSubmit = (data) => {
          // Gom DTO giống AuthRegisterRequest
          const registerPayload = {
               email,
               password,
               fullName: data.fullName,
               role: 'USER',
          };
          console.log('[Register - Candidate]', registerPayload);
          // TODO: Gọi API auth/register
          navigate('/login', { replace: true });
     };

     const handleRecruiterSubmit = (data) => {
          const registerPayload = {
               email,
               password,
               fullName: data.fullName,
               role: 'COMPANY',
          };
          // CompanyCreateRequest (sẽ gọi sau khi register thành công)
          const companyPayload = {
               name: data.companyName,
               address: data.companyAddress || '',
          };
          console.log('[Register - Recruiter]', registerPayload, companyPayload);
          // TODO: Gọi API auth/register → rồi POST company
          navigate('/login', { replace: true });
     };

     // Guard render
     if (!email || !password) return null;

     return (
          <Card className="border-0 shadow-none">
               <CardHeader className="space-y-1 px-0">
                    <CardTitle className="text-2xl font-bold text-foreground">
                         Hoàn tất đăng ký
                    </CardTitle>
                    <CardDescription>
                         Cho chúng tôi biết thêm về bạn
                    </CardDescription>
               </CardHeader>
               <CardContent className="px-0">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                         <TabsList className="grid w-full grid-cols-2 mb-6">
                              <TabsTrigger value="candidate" className="gap-2">
                                   <User size={16} />
                                   Tôi là Ứng viên
                              </TabsTrigger>
                              <TabsTrigger value="recruiter" className="gap-2">
                                   <Building2 size={16} />
                                   Tôi là NTD
                              </TabsTrigger>
                         </TabsList>

                         {/* ===== Tab Ứng viên ===== */}
                         <TabsContent value="candidate">
                              <Form {...candidateForm}>
                                   <form onSubmit={candidateForm.handleSubmit(handleCandidateSubmit)} className="space-y-4">
                                        <FormField
                                             control={candidateForm.control}
                                             name="fullName"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Họ và tên</FormLabel>
                                                       <FormControl>
                                                            <Input placeholder="Nguyễn Văn A" {...field} />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={candidateForm.control}
                                             name="phone"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>
                                                            Số điện thoại{' '}
                                                            <span className="text-muted-foreground font-normal">(tùy chọn)</span>
                                                       </FormLabel>
                                                       <FormControl>
                                                            <Input
                                                                 type="tel"
                                                                 placeholder="0912 345 678"
                                                                 {...field}
                                                            />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <Button type="submit" className="w-full" size="lg">
                                             <CheckCircle2 size={18} />
                                             Hoàn tất đăng ký
                                        </Button>
                                   </form>
                              </Form>
                         </TabsContent>

                         {/* ===== Tab Nhà tuyển dụng ===== */}
                         <TabsContent value="recruiter">
                              <Form {...recruiterForm}>
                                   <form onSubmit={recruiterForm.handleSubmit(handleRecruiterSubmit)} className="space-y-4">
                                        <FormField
                                             control={recruiterForm.control}
                                             name="fullName"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Họ và tên</FormLabel>
                                                       <FormControl>
                                                            <Input placeholder="Trần Thị B" {...field} />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={recruiterForm.control}
                                             name="companyName"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>Tên công ty</FormLabel>
                                                       <FormControl>
                                                            <Input placeholder="Công ty ABC" {...field} />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <FormField
                                             control={recruiterForm.control}
                                             name="companyAddress"
                                             render={({ field }) => (
                                                  <FormItem>
                                                       <FormLabel>
                                                            Địa chỉ công ty{' '}
                                                            <span className="text-muted-foreground font-normal">(tùy chọn)</span>
                                                       </FormLabel>
                                                       <FormControl>
                                                            <Input placeholder="Quận 1, TP. HCM" {...field} />
                                                       </FormControl>
                                                       <FormMessage />
                                                  </FormItem>
                                             )}
                                        />
                                        <Button type="submit" className="w-full" size="lg">
                                             <CheckCircle2 size={18} />
                                             Hoàn tất đăng ký
                                        </Button>
                                   </form>
                              </Form>
                         </TabsContent>
                    </Tabs>

                    {/* Back link */}
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                         <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                              ← Quay lại bước trước
                         </Link>
                    </p>
               </CardContent>
          </Card>
     );
};

export default OnboardingPage;
