import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
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

const registerSchema = z.object({
     email: z
          .string()
          .min(1, 'Email không được để trống')
          .email('Email không hợp lệ'),
     password: z
          .string()
          .min(8, 'Mật khẩu tối thiểu 8 ký tự')
          .regex(/[A-Z]/, 'Cần ít nhất 1 chữ hoa')
          .regex(/[0-9]/, 'Cần ít nhất 1 chữ số'),
     confirmPassword: z
          .string()
          .min(1, 'Xác nhận mật khẩu không được để trống'),
}).refine((data) => data.password === data.confirmPassword, {
     message: 'Mật khẩu xác nhận không khớp',
     path: ['confirmPassword'],
});

const RegisterPage = () => {
     const navigate = useNavigate();
     const [showPassword, setShowPassword] = useState(false);
     const [showConfirmPassword, setShowConfirmPassword] = useState(false);

     const form = useForm({
          resolver: zodResolver(registerSchema),
          defaultValues: {
               email: '',
               password: '',
               confirmPassword: '',
          },
     });

     const onSubmit = (data) => {
          // Chuyển sang Onboarding kèm email + password
          navigate('/onboarding', {
               state: { email: data.email, password: data.password },
          });
     };

     return (
          <Card className="border-0 shadow-none">
               <CardHeader className="space-y-1 px-0">
                    <CardTitle className="text-2xl font-bold text-foreground">
                         Tạo tài khoản
                    </CardTitle>
                    <CardDescription>
                         Nhập email và mật khẩu để bắt đầu
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
                                             <FormLabel>Mật khẩu</FormLabel>
                                             <FormControl>
                                                  <div className="relative">
                                                       <Input
                                                            type={showPassword ? 'text' : 'password'}
                                                            placeholder="Tối thiểu 8 ký tự"
                                                            autoComplete="new-password"
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

                              {/* Confirm Password */}
                              <FormField
                                   control={form.control}
                                   name="confirmPassword"
                                   render={({ field }) => (
                                        <FormItem>
                                             <FormLabel>Xác nhận mật khẩu</FormLabel>
                                             <FormControl>
                                                  <div className="relative">
                                                       <Input
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            placeholder="Nhập lại mật khẩu"
                                                            autoComplete="new-password"
                                                            {...field}
                                                       />
                                                       <button
                                                            type="button"
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                       >
                                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                       </button>
                                                  </div>
                                             </FormControl>
                                             <FormMessage />
                                        </FormItem>
                                   )}
                              />

                              {/* Submit */}
                              <Button type="submit" className="w-full" size="lg">
                                   <UserPlus size={18} />
                                   Tiếp tục
                              </Button>
                         </form>
                    </Form>

                    {/* Login link */}
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                         Đã có tài khoản?{' '}
                         <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                              Đăng nhập
                         </Link>
                    </p>
               </CardContent>
          </Card>
     );
};

export default RegisterPage;
