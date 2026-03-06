import { useFormContext } from 'react-hook-form';
import {
     User, Phone, MapPin, Calendar, Globe, Github, Linkedin,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage,
} from '@/components/ui/form';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const PersonalInfoSection = () => {
     const form = useFormContext();

     return (
          <div className="space-y-6">
               {/* Header */}
               <div>
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                         <User size={20} className="text-primary" />
                         Thông tin cá nhân
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                         Cập nhật thông tin cơ bản để nhà tuyển dụng hiểu rõ hơn về bạn.
                    </p>
               </div>
               <Separator />

               {/* Họ tên + Email */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                         control={form.control}
                         name="full_name"
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
                         control={form.control}
                         name="email"
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel>Email</FormLabel>
                                   <FormControl>
                                        <Input
                                             type="email"
                                             disabled
                                             className="bg-muted cursor-not-allowed"
                                             {...field}
                                        />
                                   </FormControl>
                                   <p className="text-xs text-muted-foreground">
                                        Email không thể thay đổi.
                                   </p>
                              </FormItem>
                         )}
                    />
               </div>

               {/* Phone + DOB + Gender */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                         control={form.control}
                         name="phone_number"
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel className="flex items-center gap-1.5">
                                        <Phone size={14} />
                                        Số điện thoại
                                   </FormLabel>
                                   <FormControl>
                                        <Input placeholder="0912345678" {...field} />
                                   </FormControl>
                                   <FormMessage />
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name="date_of_birth"
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        Ngày sinh
                                   </FormLabel>
                                   <FormControl>
                                        <Input type="date" {...field} />
                                   </FormControl>
                                   <FormMessage />
                              </FormItem>
                         )}
                    />
                    <FormField
                         control={form.control}
                         name="gender"
                         render={({ field }) => (
                              <FormItem>
                                   <FormLabel>Giới tính</FormLabel>
                                   <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                   >
                                        <FormControl>
                                             <SelectTrigger className="w-full">
                                                  <SelectValue placeholder="Chọn giới tính" />
                                             </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                             <SelectItem value="MALE">Nam</SelectItem>
                                             <SelectItem value="FEMALE">Nữ</SelectItem>
                                             <SelectItem value="OTHER">Khác</SelectItem>
                                        </SelectContent>
                                   </Select>
                                   <FormMessage />
                              </FormItem>
                         )}
                    />
               </div>

               {/* Địa chỉ */}
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
                                   <Input placeholder="Quận 1, TP. Hồ Chí Minh" {...field} />
                              </FormControl>
                              <FormMessage />
                         </FormItem>
                    )}
               />

               {/* Bio */}
               <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                         <FormItem>
                              <FormLabel>Giới thiệu bản thân</FormLabel>
                              <FormControl>
                                   <Textarea
                                        placeholder="Viết vài dòng giới thiệu về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
                                        rows={4}
                                        className="resize-none"
                                        {...field}
                                   />
                              </FormControl>
                              <FormMessage />
                         </FormItem>
                    )}
               />

               {/* Social Links */}
               <div>
                    <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
                         <Globe size={14} className="text-primary" />
                         Liên kết mạng xã hội
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <FormField
                              control={form.control}
                              name="github_url"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel className="flex items-center gap-1.5">
                                             <Github size={14} />
                                             GitHub
                                        </FormLabel>
                                        <FormControl>
                                             <Input
                                                  placeholder="https://github.com/username"
                                                  {...field}
                                             />
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />
                         <FormField
                              control={form.control}
                              name="linkedin_url"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel className="flex items-center gap-1.5">
                                             <Linkedin size={14} />
                                             LinkedIn
                                        </FormLabel>
                                        <FormControl>
                                             <Input
                                                  placeholder="https://linkedin.com/in/username"
                                                  {...field}
                                             />
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />
                         <FormField
                              control={form.control}
                              name="portfolio_url"
                              render={({ field }) => (
                                   <FormItem>
                                        <FormLabel className="flex items-center gap-1.5">
                                             <Globe size={14} />
                                             Portfolio
                                        </FormLabel>
                                        <FormControl>
                                             <Input
                                                  placeholder="https://myportfolio.com"
                                                  {...field}
                                             />
                                        </FormControl>
                                        <FormMessage />
                                   </FormItem>
                              )}
                         />
                    </div>
               </div>
          </div>
     );
};

export default PersonalInfoSection;
