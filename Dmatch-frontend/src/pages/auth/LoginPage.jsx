import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
     Form,
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage,
} from '@/components/ui/form';
import { loginApi, getMeApi } from '@/services/auth.service';
import useAuthStore from '@/store/useAuthStore';

const loginSchema = z.object({
     email: z
          .string()
          .min(1, 'Email không được để trống')
          .email('Email không hợp lệ'),
     password: z
          .string()
          .min(1, 'Mật khẩu không được để trống'),
});

const LoginPage = () => {
     const [showPassword, setShowPassword] = useState(false);
     const [serverError, setServerError] = useState('');
     const [isSubmitting, setIsSubmitting] = useState(false);
     const navigate = useNavigate();
     const login = useAuthStore((s) => s.login);

     const form = useForm({
          resolver: zodResolver(loginSchema),
          defaultValues: {
               email: '',
               password: '',
          },
     });

     const onSubmit = async (data) => {
          setServerError('');
          setIsSubmitting(true);
          try {
               // 1. Login → lấy accessToken
               const authRes = await loginApi(data);
               const token = authRes.data?.accessToken ?? authRes.accessToken;
               if (!token) {
                    throw new Error('Missing access token');
               }

               // 2. Tạm lưu token → gọi getMeApi (interceptor sẽ tự gắn)
               useAuthStore.getState().login({ fullName: '' }, token);

               // 3. Lấy user info
               const userRes = await getMeApi();
               const userData = userRes.data ?? userRes;

               // 4. Cập nhật store với full user data
               login(userData, token);

               // 5. Redirect theo role
               if (userData.roles?.includes('ADMIN')) {
                    navigate('/admin/dashboard', { replace: true });
               } else if (userData.roles?.includes('COMPANY')) {
                    navigate('/recruiter/dashboard', { replace: true });
               } else {
                    navigate('/', { replace: true });
               }
          } catch (err) {
               const msg =
                    err.response?.data?.message ||
                    'Đăng nhập thất bại. Vui lòng thử lại.';
               setServerError(msg);
          } finally {
               setIsSubmitting(false);
          }
     };

     return (
          <Card className="border-0 shadow-none">
               <CardHeader className="space-y-1 px-0">
                    <CardTitle className="text-2xl font-bold text-foreground">
                         Đăng nhập
                    </CardTitle>
                    <CardDescription>
                         Nhập email và mật khẩu để tiếp tục
                    </CardDescription>
               </CardHeader>
               <CardContent className="px-0">
                    {/* Server Error */}
                    {serverError && (
                         <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                              <AlertCircle size={16} className="shrink-0" />
                              {serverError}
                         </div>
                    )}

                    <Form {...form}>
                         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                              {/* Email */}
                              <FormField
                                   control={form.control}
                                   name="email"
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel>Email</FormLabel>
                                             <FormControl>
                                                  <Input
                                                       type="email"
                                                       placeholder="name@company.com"
                                                       autoComplete="email"
                                                       {...field}
                                                  />
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />

                              {/* Password */}
                              <FormField
                                   control={form.control}
                                   name="password"
                                   render={({ field }) => (
                                        <FormItem>
                                             <div className="flex items-center justify-between">
                                                  <FormLabel>Mật khẩu</FormLabel>
                                                  <Link
                                                       to="#"
                                                       className="text-xs text-primary hover:text-primary/80 transition-colors"
                                                  >
                                                       Quên mật khẩu?
                                                  </Link>
                                             </div>
                                             <FormControl>
                                                  <div className="relative">
                                                       <Input
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Nhập mật khẩu"
                                                            autoComplete="current-password"
                                                            {...field}
                                                       />
                                                       <button
                                                            type="button"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                       >
                                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                       </button>
                                                  </div>
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />

                              {/* Submit */}
                              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                   {isSubmitting ? (
                                        <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                   ) : (
                                        <LogIn size={18} />
                                   )}
                                   {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
                              </Button>
                         </form>
                    </Form>

                    {/* Register link */}
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                         Chưa có tài khoản?{' '}
                         <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                              Đăng ký ngay
                         </Link>
                    </p>
               </CardContent>
          </Card>
     );
};

export default LoginPage;
