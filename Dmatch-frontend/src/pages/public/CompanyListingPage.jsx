import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Building2, Loader2 } from 'lucide-react';
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
import { getCompanies } from '@/services/company.service';
import { pageContent, pageTotalElements, pageTotalPages, unwrapApiResponse } from '@/lib/apiResponse';

const ITEMS_PER_PAGE = 8;

/**
 * Map location filter value sang keyword search địa điểm.
 */
const LOCATION_MAP = {
     'ho-chi-minh': 'Hồ Chí Minh',
     'ha-noi': 'Hà Nội',
     'da-nang': 'Đà Nẵng',
     'can-tho': 'Cần Thơ',
};

/**
 * Size ranges cho filter.
 */
const SIZE_RANGES = {
     '1-50': { min: 1, max: 50 },
     '51-200': { min: 51, max: 200 },
     '201-500': { min: 201, max: 500 },
     '501-1000': { min: 501, max: 1000 },
     '1000+': { min: 1001, max: 999999 },
};

const CompanyListingPage = () => {
     const [searchParams, setSearchParams] = useSearchParams();

     // Filter state
     const [filters, setFilters] = useState({
          search: searchParams.get('keyword') || '',
          location: searchParams.get('location') || 'all',
          size: searchParams.get('size') || 'all',
     });

     // Bản sao filters đã "áp dụng" khi user nhấn Tìm kiếm
     const [appliedFilters, setAppliedFilters] = useState({ ...filters });
     const currentPage = Number(searchParams.get('page')) || 1;

     // Build API params
     const apiParams = useMemo(() => {
          const params = {
               page: currentPage,
               limit: ITEMS_PER_PAGE,
          };

          if (appliedFilters.search) {
               params.keyword = appliedFilters.search;
          }

          if (appliedFilters.location && appliedFilters.location !== 'all') {
               params.location = LOCATION_MAP[appliedFilters.location] || '';
          }

          if (appliedFilters.size && appliedFilters.size !== 'all') {
               const range = SIZE_RANGES[appliedFilters.size];
               if (range) {
                    params.min_size = range.min;
                    params.max_size = range.max;
               }
          }

          return params;
     }, [appliedFilters, currentPage]);

     // Fetch companies từ API
     const { data: companiesResponse, isLoading, isError } = useQuery({
          queryKey: ['companies', apiParams],
          queryFn: () => getCompanies(apiParams),
          staleTime: 2 * 60 * 1000, // 2 phút
          keepPreviousData: true,
     });

     const companiesPage = unwrapApiResponse(companiesResponse);
     const companies = pageContent(companiesPage);
     const totalElements = pageTotalElements(companiesPage);
     const totalPages = pageTotalPages(companiesPage);

     const handleFilterChange = (field, value) => {
          setFilters((prev) => ({ ...prev, [field]: value }));
     };

     const handleSearch = useCallback(() => {
          setAppliedFilters({ ...filters });
          // Reset to page 1 và update URL
          const params = new URLSearchParams();
          if (filters.search) params.set('keyword', filters.search);
          if (filters.location !== 'all') params.set('location', filters.location);
          if (filters.size !== 'all') params.set('size', filters.size);
          setSearchParams(params, { replace: true });
     }, [filters, setSearchParams]);

     const handlePageChange = (page) => {
          if (page >= 1 && page <= totalPages) {
               const params = new URLSearchParams(searchParams);
               if (page > 1) {
                    params.set('page', String(page));
               } else {
                    params.delete('page');
               }
               setSearchParams(params, { replace: true });
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
                                   {totalElements}
                              </span>{' '}
                              công ty
                         </p>
                    </div>

                    {isLoading ? (
                         <div className="flex justify-center items-center py-16">
                              <Loader2 className="w-8 h-8 animate-spin text-primary" />
                         </div>
                    ) : isError ? (
                         <div className="text-center py-16">
                              <p className="text-destructive">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.</p>
                         </div>
                    ) : companies.length > 0 ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {companies.map((company) => (
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
