import { SearchX } from 'lucide-react';
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from '@/components/ui/select';
import {
     Pagination,
     PaginationContent,
     PaginationEllipsis,
     PaginationItem,
     PaginationLink,
     PaginationNext,
     PaginationPrevious,
} from '@/components/ui/pagination';
import JobCard from '@/features/jobs/components/JobCard';

/**
 * Các option sắp xếp — sau này match với backend sort params.
 */
const SORT_OPTIONS = [
     { value: 'newest', label: 'Mới cập nhật' },
     { value: 'salary_desc', label: 'Lương cao đến thấp' },
     { value: 'salary_asc', label: 'Lương thấp đến cao' },
];

/**
 * Component hiển thị danh sách kết quả tìm kiếm việc làm,
 * bao gồm toolbar (count + sort), list/grid JobCard, empty state, và pagination.
 *
 * @param {Object} props
 * @param {Array} props.jobs - Mảng job objects (đã qua filter/sort)
 * @param {number} props.totalJobs - Tổng số job (trước phân trang)
 * @param {number} props.currentPage - Trang hiện tại (1-based)
 * @param {number} props.totalPages - Tổng số trang
 * @param {string} props.sortBy - Giá trị sort hiện tại
 * @param {Function} props.onSortChange - (value: string) => void
 * @param {Function} props.onPageChange - (page: number) => void
 */
const JobListContent = ({
     jobs,
     totalJobs,
     currentPage,
     totalPages,
     sortBy,
     onSortChange,
     onPageChange,
}) => {
     /**
      * Tạo mảng số trang hiển thị cho pagination.
      * Hiển thị tối đa 5 pages + ellipsis.
      */
     const getPageNumbers = () => {
          const pages = [];
          if (totalPages <= 5) {
               for (let i = 1; i <= totalPages; i++) pages.push(i);
          } else {
               // Luôn hiển thị page 1
               pages.push(1);

               if (currentPage > 3) pages.push('ellipsis-start');

               // Pages xung quanh current
               const start = Math.max(2, currentPage - 1);
               const end = Math.min(totalPages - 1, currentPage + 1);
               for (let i = start; i <= end; i++) pages.push(i);

               if (currentPage < totalPages - 2) pages.push('ellipsis-end');

               // Luôn hiển thị page cuối
               pages.push(totalPages);
          }
          return pages;
     };

     return (
          <div className="space-y-6">
               {/* ===== Toolbar: Count + Sort ===== */}
               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                         Tìm thấy{' '}
                         <span className="font-semibold text-foreground">{totalJobs}</span>{' '}
                         việc làm
                    </p>

                    <Select value={sortBy} onValueChange={onSortChange}>
                         <SelectTrigger className="w-50">
                              <SelectValue placeholder="Sắp xếp" />
                         </SelectTrigger>
                         <SelectContent>
                              {SORT_OPTIONS.map((opt) => (
                                   <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                   </SelectItem>
                              ))}
                         </SelectContent>
                    </Select>
               </div>

               {/* ===== Job List ===== */}
               {jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {jobs.map((job) => (
                              <JobCard key={job.id} job={job} />
                         ))}
                    </div>
               ) : (
                    /* ===== Empty State ===== */
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                         <div className="rounded-full bg-muted p-4 mb-4">
                              <SearchX size={32} className="text-muted-foreground" />
                         </div>
                         <h3 className="text-lg font-semibold text-foreground mb-1">
                              Không tìm thấy việc làm phù hợp
                         </h3>
                         <p className="text-sm text-muted-foreground max-w-md">
                              Hãy thử thay đổi từ khóa hoặc điều chỉnh bộ lọc để tìm thấy nhiều cơ hội hơn.
                         </p>
                    </div>
               )}

               {/* ===== Pagination ===== */}
               {totalPages > 1 && (
                    <Pagination>
                         <PaginationContent>
                              {/* Nút Trước */}
                              <PaginationItem>
                                   <PaginationPrevious
                                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                                        className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                                   />
                              </PaginationItem>

                              {/* Số trang */}
                              {getPageNumbers().map((page) => {
                                   if (typeof page === 'string') {
                                        return (
                                             <PaginationItem key={page}>
                                                  <PaginationEllipsis />
                                             </PaginationItem>
                                        );
                                   }
                                   return (
                                        <PaginationItem key={page}>
                                             <PaginationLink
                                                  isActive={page === currentPage}
                                                  onClick={() => onPageChange(page)}
                                             >
                                                  {page}
                                             </PaginationLink>
                                        </PaginationItem>
                                   );
                              })}

                              {/* Nút Sau */}
                              <PaginationItem>
                                   <PaginationNext
                                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                                        className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                                   />
                              </PaginationItem>
                         </PaginationContent>
                    </Pagination>
               )}
          </div>
     );
};

export default JobListContent;
