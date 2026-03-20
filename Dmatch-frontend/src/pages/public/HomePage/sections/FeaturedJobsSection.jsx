import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flame, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobCard from '@/features/jobs/components/JobCard';
import { getJobs } from '@/services/job.service';

const FeaturedJobsSection = () => {
     // Fetch jobs từ API
     const { data: jobsResponse, isLoading } = useQuery({
          queryKey: ['featured-jobs'],
          queryFn: () => getJobs({ limit: 12, status: 'ACTIVE' }),
          staleTime: 5 * 60 * 1000, // 5 phút
     });

     const jobs = jobsResponse?.data?.data?.content || [];

     // Filter jobs by category tabs
     const latestJobs = useMemo(
          () => [...jobs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
          [jobs]
     );

     const internFresherJobs = useMemo(
          () => jobs.filter((j) =>
               ['INTERN', 'FRESHER'].includes(j.job_level?.code)
          ),
          [jobs]
     );

     const seniorJobs = useMemo(
          () => jobs.filter((j) => j.job_level?.code === 'SENIOR'),
          [jobs]
     );

     const renderJobGrid = (jobList) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {jobList.map((job) => (
                    <JobCard key={job.id} job={job} />
               ))}
          </div>
     );

     if (isLoading) {
          return (
               <section className="py-12 md:py-16 bg-muted/30">
                    <div className="flex justify-center items-center py-16">
                         <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
               </section>
          );
     }

     if (jobs.length === 0) {
          return null;
     }

     return (
          <section className="py-12 md:py-16 bg-muted/30">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-8">
                         <div className="inline-flex items-center gap-2 text-primary mb-2">
                              <Flame size={20} />
                              <span className="text-sm font-semibold uppercase tracking-wider">Việc làm nổi bật</span>
                         </div>
                         <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                              Cơ hội việc làm hấp dẫn
                         </h2>
                         <p className="mt-2 text-muted-foreground">
                              Cập nhật mỗi ngày từ các công ty hàng đầu
                         </p>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="latest" className="w-full">
                         <div className="flex justify-center mb-6">
                              <TabsList>
                                   <TabsTrigger value="latest">Mới nhất</TabsTrigger>
                                   <TabsTrigger value="intern-fresher">Thực tập / Fresher</TabsTrigger>
                                   <TabsTrigger value="senior">Senior</TabsTrigger>
                              </TabsList>
                         </div>

                         <TabsContent value="latest">
                              {renderJobGrid(latestJobs)}
                         </TabsContent>

                         <TabsContent value="intern-fresher">
                              {internFresherJobs.length > 0 ? (
                                   renderJobGrid(internFresherJobs)
                              ) : (
                                   <p className="text-center text-muted-foreground py-8">
                                        Chưa có việc làm Thực tập/Fresher nào.
                                   </p>
                              )}
                         </TabsContent>

                         <TabsContent value="senior">
                              {seniorJobs.length > 0 ? (
                                   renderJobGrid(seniorJobs)
                              ) : (
                                   <p className="text-center text-muted-foreground py-8">
                                        Chưa có việc làm Senior nào.
                                   </p>
                              )}
                         </TabsContent>
                    </Tabs>
               </div>
          </section>
     );
};

export default FeaturedJobsSection;
