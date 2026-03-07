import { Briefcase, SearchX } from 'lucide-react';
import JobCard from '@/features/jobs/components/JobCard';

/**
 * CompanyJobList — hiển thị danh sách job đang tuyển của công ty.
 *
 * Lưu ý Microservices: Component này nhận jobs từ bên ngoài (fetched từ job-service),
 * KHÔNG query trực tiếp từ company-service.
 *
 * @param {{ jobs: Array, isLoading: boolean }} props
 */
const CompanyJobList = ({ jobs, isLoading }) => {
     if (isLoading) {
          return (
               <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                         <Briefcase size={20} className="text-primary" />
                         Việc làm đang tuyển
                    </h2>
                    {/* Skeleton loading */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {Array.from({ length: 4 }).map((_, i) => (
                              <div
                                   key={i}
                                   className="h-48 rounded-xl bg-muted animate-pulse"
                              />
                         ))}
                    </div>
               </div>
          );
     }

     return (
          <div>
               <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Briefcase size={20} className="text-primary" />
                    Việc làm đang tuyển
                    {jobs?.length > 0 && (
                         <span className="text-sm font-normal text-muted-foreground">
                              ({jobs.length})
                         </span>
                    )}
               </h2>

               {jobs?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {jobs.map((job) => (
                              <JobCard key={job.id} job={job} />
                         ))}
                    </div>
               ) : (
                    <div className="text-center py-12 rounded-xl border border-dashed border-border">
                         <div className="inline-flex items-center justify-center size-12 rounded-full bg-muted mb-3">
                              <SearchX size={20} className="text-muted-foreground" />
                         </div>
                         <p className="text-sm text-muted-foreground">
                              Công ty chưa có việc làm nào đang tuyển
                         </p>
                    </div>
               )}
          </div>
     );
};

export default CompanyJobList;
