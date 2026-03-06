import { useState, useMemo } from 'react';
import { Building2, Sparkles } from 'lucide-react';
import CompanyCard from '@/features/companies/components/CompanyCard';
import CompanyFilterBar from '@/features/companies/components/CompanyFilterBar';
import {
     Pagination,
     PaginationContent,
     PaginationItem,
     PaginationLink,
     PaginationNext,
     PaginationPrevious,
     PaginationEllipsis,
} from '@/components/ui/pagination';
import { SAMPLE_COMPANIES, COMPANY_SIZES } from '@/data/sampleData';

const ITEMS_PER_PAGE = 8;

/**
 * Kiểm tra address có match với filter location không.
 * Location filter value: 'ho-chi-minh', 'ha-noi', 'da-nang', 'can-tho', 'all'
 */
const matchLocation = (address, locationFilter) => {
     if (!locationFilter || locationFilter === 'all') return true;
     const map = {
          'ho-chi-minh': 'hồ chí minh',
          'ha-noi': 'hà nội',
          'da-nang': 'đà nẵng',
          'can-tho': 'cần thơ',
     };
     const keyword = map[locationFilter];
     if (!keyword) return true;
     return address?.toLowerCase().includes(keyword) ?? false;
};

/**
 * Kiểm tra employee_size có nằm trong khoảng filter không.
 */
const matchSize = (employeeSize, sizeFilter) => {
     if (!sizeFilter || sizeFilter === 'all') return true;
     const sizeOption = COMPANY_SIZES.find((s) => s.value === sizeFilter);
     if (!sizeOption || sizeOption.min == null) return true;
     return employeeSize >= sizeOption.min && employeeSize <= sizeOption.max;
};

const CompanyListingPage = () => {
     // Filter state
     const [filters, setFilters] = useState({
          search: '',
          location: 'all',
          size: 'all',
     });

     // Bản sao filters đã "áp dụng" khi user nhấn Tìm kiếm
     const [appliedFilters, setAppliedFilters] = useState({ ...filters });

     const [currentPage, setCurrentPage] = useState(1);

     const handleFilterChange = (field, value) => {
          setFilters((prev) => ({ ...prev, [field]: value }));
     };

     const handleSearch = () => {
          setAppliedFilters({ ...filters });
          setCurrentPage(1);
     };

     // Lọc dữ liệu
     const filteredCompanies = useMemo(() => {
          return SAMPLE_COMPANIES.filter((company) => {
               // Search by name
               if (
                    appliedFilters.search &&
                    !company.name.toLowerCase().includes(appliedFilters.search.toLowerCase())
               ) {
                    return false;
               }
               // Filter by location
               if (!matchLocation(company.address, appliedFilters.location)) {
                    return false;
               }
               // Filter by size
               if (!matchSize(company.employee_size, appliedFilters.size)) {
                    return false;
               }
               return true;
          });
     }, [appliedFilters]);

     // Pagination
     const totalPages = Math.max(1, Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE));
     const paginatedCompanies = filteredCompanies.slice(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE
     );

     const handlePageChange = (page) => {
          if (page >= 1 && page <= totalPages) {
               setCurrentPage(page);
               // Scroll to top of grid
               window.scrollTo({ top: 280, behavior: 'smooth' });
          }
     };

     return (
          <>
               {/* ===== Hero Banner nhỏ ===== */}
               <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-12 md:py-16">
                    {/* Decorative blurs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                         <div className="absolute -top-20 -right-20 size-72 bg-primary/10 rounded-full blur-3xl" />
                         <div className="absolute -bottom-20 -left-20 size-72 bg-primary/5 rounded-full blur-3xl" />
                    </div>

                    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                         {/* Badge */}
                         <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                              <Building2 size={14} />
                              Công ty IT hàng đầu
                         </div>

                         {/* Heading */}
                         <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
                              Khám phá văn hóa của{' '}
                              <span className="text-primary">các công ty IT hàng đầu</span>
                         </h1>

                         {/* Subtitle */}
                         <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                              Tìm hiểu môi trường làm việc, quy mô và cơ hội nghề nghiệp tại các doanh nghiệp công nghệ
                         </p>
                    </div>
               </section>

               {/* ===== Filter Bar ===== */}
               <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
                    <CompanyFilterBar
                         filters={filters}
                         onFilterChange={handleFilterChange}
                         onSearch={handleSearch}
                    />
               </section>

               {/* ===== Company Grid ===== */}
               <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    {/* Kết quả count */}
                    <div className="flex items-center justify-between mb-6">
                         <p className="text-sm text-muted-foreground">
                              Hiển thị{' '}
                              <span className="font-semibold text-foreground">
                                   {filteredCompanies.length}
                              </span>{' '}
                              công ty
                         </p>
                    </div>

                    {paginatedCompanies.length > 0 ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {paginatedCompanies.map((company) => (
                                   <CompanyCard key={company.id} company={company} />
                              ))}
                         </div>
                    ) : (
                         /* Empty state */
                         <div className="text-center py-16">
                              <div className="inline-flex items-center justify-center size-16 rounded-full bg-muted mb-4">
                                   <Building2 size={28} className="text-muted-foreground" />
                              </div>
                              <h3 className="text-lg font-semibold text-foreground mb-1">
                                   Không tìm thấy công ty nào
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                   Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                              </p>
                         </div>
                    )}

                    {/* ===== Pagination ===== */}
                    {totalPages > 1 && (
                         <div className="mt-10 flex justify-center">
                              <Pagination>
                                   <PaginationContent>
                                        <PaginationItem>
                                             <PaginationPrevious
                                                  onClick={() => handlePageChange(currentPage - 1)}
                                                  className={
                                                       currentPage === 1
                                                            ? 'pointer-events-none opacity-50'
                                                            : 'cursor-pointer'
                                                  }
                                             />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                             (page) => {
                                                  // Hiển thị tối đa 5 trang, nếu nhiều hơn thì dùng ellipsis
                                                  if (
                                                       totalPages <= 5 ||
                                                       page === 1 ||
                                                       page === totalPages ||
                                                       Math.abs(page - currentPage) <= 1
                                                  ) {
                                                       return (
                                                            <PaginationItem key={page}>
                                                                 <PaginationLink
                                                                      isActive={page === currentPage}
                                                                      onClick={() =>
                                                                           handlePageChange(page)
                                                                      }
                                                                      className="cursor-pointer"
                                                                 >
                                                                      {page}
                                                                 </PaginationLink>
                                                            </PaginationItem>
                                                       );
                                                  }
                                                  // Ellipsis chỉ render 1 lần mỗi bên
                                                  if (
                                                       page === 2 && currentPage > 3
                                                  ) {
                                                       return (
                                                            <PaginationItem key="start-ellipsis">
                                                                 <PaginationEllipsis />
                                                            </PaginationItem>
                                                       );
                                                  }
                                                  if (
                                                       page === totalPages - 1 &&
                                                       currentPage < totalPages - 2
                                                  ) {
                                                       return (
                                                            <PaginationItem key="end-ellipsis">
                                                                 <PaginationEllipsis />
                                                            </PaginationItem>
                                                       );
                                                  }
                                                  return null;
                                             }
                                        )}

                                        <PaginationItem>
                                             <PaginationNext
                                                  onClick={() => handlePageChange(currentPage + 1)}
                                                  className={
                                                       currentPage === totalPages
                                                            ? 'pointer-events-none opacity-50'
                                                            : 'cursor-pointer'
                                                  }
                                             />
                                        </PaginationItem>
                                   </PaginationContent>
                              </Pagination>
                         </div>
                    )}
               </section>
          </>
     );
};

export default CompanyListingPage;
