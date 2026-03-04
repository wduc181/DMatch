import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
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

     const form = useForm({
          resolver: zodResolver(loginSchema),
          defaultValues: {
               email: '',
               password: '',
          },
     });

     const onSubmit = (data) => {
          // DTO match AuthLoginRequest: { email, password }
          console.log('[Login]', data);
          // TODO: Gọi API auth/login → lưu accessToken
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
                              <Button type="submit" className="w-full" size="lg">
                                   <LogIn size={18} />
                                   Đăng nhập
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
