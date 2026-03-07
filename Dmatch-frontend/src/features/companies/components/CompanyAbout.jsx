import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * CompanyAbout — render nội dung giới thiệu công ty từ HTML description.
 *
 * Sử dụng dangerouslySetInnerHTML để render HTML content.
 * Lưu ý: Ở production cần sanitize HTML bằng DOMPurify trước khi render.
 *
 * @param {{ description: string }} props
 */
const CompanyAbout = ({ description }) => {
     if (!description) {
          return (
               <Card>
                    <CardHeader>
                         <CardTitle className="text-lg">Về chúng tôi</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground italic">
                              Công ty chưa cập nhật mô tả.
                         </p>
                    </CardContent>
               </Card>
          );
     }

     return (
          <Card>
               <CardHeader>
                    <CardTitle className="text-lg">Về chúng tôi</CardTitle>
               </CardHeader>
               <CardContent>
                    <div
                         className="prose prose-sm max-w-none text-foreground
                              prose-headings:text-foreground prose-headings:font-semibold
                              prose-p:text-muted-foreground prose-p:leading-relaxed
                              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                              prose-li:text-muted-foreground
                              prose-strong:text-foreground"
                         dangerouslySetInnerHTML={{ __html: description }}
                    />
               </CardContent>
          </Card>
     );
};

export default CompanyAbout;
