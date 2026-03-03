import { useMemo } from 'react';
import { Flame } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import JobCard from '@/features/jobs/components/JobCard';
import { SAMPLE_JOBS } from '@/data/sampleData';

const FeaturedJobsSection = () => {
     // Filter jobs by category tabs
     const latestJobs = useMemo(
          () => [...SAMPLE_JOBS].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
          []
     );

     const internFresherJobs = useMemo(
          () => SAMPLE_JOBS.filter((j) =>
               ['INTERN', 'FRESHER'].includes(j.job_level?.code)
          ),
          []
     );

     const seniorJobs = useMemo(
          () => SAMPLE_JOBS.filter((j) => j.job_level?.code === 'SENIOR'),
          []
     );

     const renderJobGrid = (jobs) => (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
               ))}
          </div>
     );

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
