import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Building2, Loader2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCompany } from '@/hooks/useCompanies';
import { useJobsByCompany } from '@/hooks/useJobs';
import CompanyAbout from '@/features/companies/components/CompanyAbout';
import CompanySidebarInfo from '@/features/companies/components/CompanySidebarInfo';
import CompanyJobList from '@/features/companies/components/CompanyJobList';

// ==================== SAMPLE DATA FALLBACK (xóa khi kết nối API thật) ====================
import { SAMPLE_COMPANIES } from '@/data/sampleData';
import { SAMPLE_JOBS } from '@/data/sampleData';

const CompanyDetailPage = () => {
     const { id } = useParams();

     // ==================== SAMPLE DATA FALLBACK ====================
     const sampleCompany = SAMPLE_COMPANIES.find((c) => c.id === Number(id));
     const sampleJobs = SAMPLE_JOBS.filter((j) => j.company_id === Number(id));

     // Fetch company detail — fallback sample data khi API chưa sẵn sàng
     const {
          data: apiCompany,
          isLoading: isCompanyLoading,
          error: companyError,
     } = useCompany(id, {
          retry: false,
     });

     // Fetch jobs của company — gọi sang job-service (Microservices pattern)
     const {
          data: apiJobs,
          isLoading: isJobsLoading,
     } = useJobsByCompany(id, {}, {
          retry: false,
     });

     // Ưu tiên API data, fallback sang sample data khi API lỗi
     const company = apiCompany ?? sampleCompany;
     const jobs = apiJobs ?? sampleJobs;

     // Loading state
     if (isCompanyLoading && !company) {
          return (
               <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 size={32} className="animate-spin text-primary" />
               </div>
          );
     }

     // Error / Not found — chỉ khi cả API lẫn sample đều không có data
     if (!isCompanyLoading && !company) {
          return (
               <div className="max-w-3xl mx-auto px-4 py-20 text-center">
                    <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                         <Building2 size={28} className="text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                         Không tìm thấy công ty
                    </h2>
                    <p className="text-sm text-muted-foreground mb-6">
                         Công ty này không tồn tại hoặc đã bị xóa.
                    </p>
                    <Button asChild variant="outline">
                         <Link to="/companies">
                              <ArrowLeft size={16} />
                              Quay lại danh sách
                         </Link>
                    </Button>
               </div>
          );
     }

     const initials = company.name
          ?.split(' ')
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase();

     return (
          <>
               {/* ===== Phase 1: Hero Banner ===== */}
               <section className="relative">
                    {/* Cover Image / Gradient fallback */}
                    <div
                         className="h-48 md:h-64 bg-linear-to-br from-primary/20 via-primary/10 to-accent/20 bg-cover bg-center"
                         style={
                              company.cover_url
                                   ? { backgroundImage: `url(${company.cover_url})` }
                                   : undefined
                         }
                    >
                         {/* Decorative blurs khi không có ảnh cover */}
                         {!company.cover_url && (
                              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                   <div className="absolute top-6 right-16 size-32 bg-primary/15 rounded-full blur-3xl" />
                                   <div className="absolute bottom-4 left-12 size-24 bg-primary/10 rounded-full blur-2xl" />
                                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 bg-primary/5 rounded-full blur-3xl" />
                              </div>
                         )}
                    </div>

                    {/* Profile Card — đè lên cover và nền trắng */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                         <div className="relative -mt-16 md:-mt-20 bg-background rounded-xl border border-border shadow-sm p-4 md:p-6">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                   {/* Logo */}
                                   <Avatar className="size-20 md:size-24 rounded-xl border-4 border-background shadow-md shrink-0">
                                        {company.logo_url ? (
                                             <AvatarImage
                                                  src={company.logo_url}
                                                  alt={company.name}
                                                  className="object-cover"
                                             />
                                        ) : null}
                                        <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-2xl md:text-3xl">
                                             {initials}
                                        </AvatarFallback>
                                   </Avatar>

                                   {/* Info */}
                                   <div className="flex-1 min-w-0">
                                        <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
                                             {company.name}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                             {company.industry && (
                                                  <Badge variant="secondary">
                                                       {company.industry}
                                                  </Badge>
                                             )}
                                             {company.address && (
                                                  <span className="text-sm text-muted-foreground">
                                                       {company.address}
                                                  </span>
                                             )}
                                        </div>
                                   </div>

                                   {/* Actions */}
                                   <div className="flex items-center gap-2 shrink-0 sm:self-start">
                                        {company.website && (
                                             <Button variant="outline" size="sm" asChild>
                                                  <a
                                                       href={company.website}
                                                       target="_blank"
                                                       rel="noopener noreferrer"
                                                  >
                                                       <Globe size={16} />
                                                       Website
                                                  </a>
                                             </Button>
                                        )}
                                   </div>
                              </div>
                         </div>
                    </div>
               </section>

               {/* ===== Phase 2: Main Content (2 cột Desktop) ===== */}
               <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {/* Cột trái — Nội dung chính (70%) */}
                         <div className="md:col-span-2 space-y-8">
                              <CompanyAbout description={company.description} />
                              <CompanyJobList jobs={jobs} isLoading={isJobsLoading} />
                         </div>

                         {/* Cột phải — Sidebar thông tin (30%) */}
                         <div className="space-y-6">
                              <CompanySidebarInfo company={company} />
                         </div>
                    </div>
               </section>
          </>
     );
};

export default CompanyDetailPage;
