import { useFormContext } from 'react-hook-form';
import { FileText, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
     FormControl,
     FormField,
     FormItem,
     FormLabel,
     FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

const DocumentsSection = () => {
     const form = useFormContext();
     const cvUrl = form.watch('cv_file_url');

     return (
          <div className="space-y-6">
               <div>
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                         <FileText size={20} className="text-primary" />
                         Tài liệu
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                         Quản lý CV và các tài liệu liên quan.
                    </p>
               </div>
               <Separator />

               {/* CV URL */}
               <FormField
                    control={form.control}
                    name="cv_file_url"
                    render={({ field }) => (
                         <FormItem>
                              <FormLabel>Link CV (URL)</FormLabel>
                              <FormControl>
                                   <Input
                                        placeholder="https://drive.google.com/file/d/... hoặc link CV online"
                                        {...field}
                                   />
                              </FormControl>
                              <FormMessage />
                              <p className="text-xs text-muted-foreground">
                                   Dán link CV từ Google Drive, Dropbox hoặc trang CV online.
                                   Tính năng tải file trực tiếp sẽ được hỗ trợ trong phiên bản tiếp theo.
                              </p>
                         </FormItem>
                    )}
               />

               {/* Preview link */}
               {cvUrl && (
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                         <p className="text-sm font-medium text-foreground mb-2">CV hiện tại</p>
                         <a
                              href={cvUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
                         >
                              <FileText size={14} />
                              Xem CV
                              <ExternalLink size={12} />
                         </a>
                    </div>
               )}

               {!cvUrl && (
                    <div className="text-center py-12 text-muted-foreground">
                         <FileText size={40} className="mx-auto mb-3 opacity-30" />
                         <p className="text-sm">Chưa có CV.</p>
                         <p className="text-xs mt-1">Dán link CV ở ô phía trên.</p>
                    </div>
               )}
          </div>
     );
};

export default DocumentsSection;
