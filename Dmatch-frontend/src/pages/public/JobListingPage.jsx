import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
     Sheet,
     SheetContent,
     SheetHeader,
     SheetTitle,
     SheetTrigger,
} from '@/components/ui/sheet';
import JobFilterSidebar from '@/features/jobs/components/JobFilterSidebar';
import JobListContent from '@/features/jobs/components/JobListContent';
import { SAMPLE_JOBS } from '@/data/sampleData';

/**
 * Số lượng job mỗi trang — match backend default `limit=10`.
 */
const JOBS_PER_PAGE = 6;

/**
 * Default filters — dùng khi clear hoặc init.
 */
const DEFAULT_FILTERS = {
     locations: [],
     levels: [],
     skills: [],
     salaryRange: [0, 100],
};

/**
 * Parse search params thành filters object.
 * Giữ state trên URL để người dùng có thể share link.
 */
const parseFiltersFromParams = (searchParams) => ({
     keyword: searchParams.get('keyword') || '',
     locations: searchParams.getAll('location'),
     levels: searchParams.getAll('level'),
     skills: searchParams.getAll('skill'),
     salaryRange: [
          Number(searchParams.get('salary_min')) || DEFAULT_FILTERS.salaryRange[0],
          Number(searchParams.get('salary_max')) || DEFAULT_FILTERS.salaryRange[1],
     ],
     sortBy: searchParams.get('sort') || 'newest',
     page: Number(searchParams.get('page')) || 1,
});

/**
 * Serialize filters thành URLSearchParams.
 */
const buildSearchParams = (filters) => {
     const params = new URLSearchParams();

     if (filters.keyword) params.set('keyword', filters.keyword);

     filters.locations.forEach((v) => params.append('location', v));
     filters.levels.forEach((v) => params.append('level', v));
     filters.skills.forEach((v) => params.append('skill', v));

     if (filters.salaryRange[0] !== DEFAULT_FILTERS.salaryRange[0]) {
          params.set('salary_min', String(filters.salaryRange[0]));
     }
     if (filters.salaryRange[1] !== DEFAULT_FILTERS.salaryRange[1]) {
          params.set('salary_max', String(filters.salaryRange[1]));
     }

     if (filters.sortBy && filters.sortBy !== 'newest') params.set('sort', filters.sortBy);
     if (filters.page > 1) params.set('page', String(filters.page));

     return params;
};

/**
 * Client-side filter logic trên fake data.
 * Sau này sẽ thay bằng API call với React Query.
 */
const filterJobs = (jobs, filters) => {
     let result = [...jobs];

     // Keyword search (title hoặc company_name)
     if (filters.keyword) {
          const kw = filters.keyword.toLowerCase();
          result = result.filter(
               (j) =>
                    j.title.toLowerCase().includes(kw) ||
                    (j.company_name && j.company_name.toLowerCase().includes(kw))
          );
     }

     // Location filter
     if (filters.locations.length > 0) {
          result = result.filter((j) => filters.locations.includes(j.location));
     }

     // Level filter
     if (filters.levels.length > 0) {
          result = result.filter((j) => j.job_level && filters.levels.includes(j.job_level.code));
     }

     // Skill/category filter
     if (filters.skills.length > 0) {
          result = result.filter((j) =>
               j.categories?.some((cat) => filters.skills.includes(cat.code))
          );
     }

     // Salary range filter (đơn vị slider là triệu, data là đồng)
     const salaryMin = filters.salaryRange[0] * 1000000;
     const salaryMax = filters.salaryRange[1] * 1000000;
     if (filters.salaryRange[0] > 0 || filters.salaryRange[1] < 100) {
          result = result.filter(
               (j) => j.salary_max >= salaryMin && j.salary_min <= salaryMax
          );
     }

     return result;
};

/**
 * Client-side sort logic.
 */
const sortJobs = (jobs, sortBy) => {
     const sorted = [...jobs];
     switch (sortBy) {
          case 'salary_desc':
               return sorted.sort((a, b) => b.salary_max - a.salary_max);
          case 'salary_asc':
               return sorted.sort((a, b) => a.salary_min - b.salary_min);
          case 'newest':
          default:
               return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
     }
};

/**
 * Trang danh sách việc làm với bộ lọc, tìm kiếm, sắp xếp và phân trang.
 * State được sync lên URL thông qua useSearchParams.
 */
const JobListingPage = () => {
     const [searchParams, setSearchParams] = useSearchParams();
     const filters = useMemo(() => parseFiltersFromParams(searchParams), [searchParams]);

     /**
      * Cập nhật URL params khi thay đổi filter.
      * Reset về page 1 khi filter thay đổi.
      */
     const updateFilters = useCallback(
          (updates) => {
               const newFilters = { ...filters, ...updates, page: 1 };
               setSearchParams(buildSearchParams(newFilters), { replace: true });
          },
          [filters, setSearchParams]
     );

     /**
      * Handler cho sidebar filter change.
      */
     const handleFilterChange = useCallback(
          (key, value) => {
               updateFilters({ [key]: value });
          },
          [updateFilters]
     );

     /**
      * Xóa tất cả bộ lọc.
      */
     const handleClearFilters = useCallback(() => {
          const cleared = {
               ...DEFAULT_FILTERS,
               keyword: filters.keyword,
               sortBy: filters.sortBy,
               page: 1,
          };
          setSearchParams(buildSearchParams(cleared), { replace: true });
     }, [filters.keyword, filters.sortBy, setSearchParams]);

     /**
      * Handler cho sort change.
      */
     const handleSortChange = useCallback(
          (value) => {
               updateFilters({ sortBy: value });
          },
          [updateFilters]
     );

     /**
      * Handler cho page change.
      */
     const handlePageChange = useCallback(
          (page) => {
               const newFilters = { ...filters, page };
               setSearchParams(buildSearchParams(newFilters), { replace: true });
               // Scroll to top khi đổi trang
               window.scrollTo({ top: 0, behavior: 'smooth' });
          },
          [filters, setSearchParams]
     );

     /**
      * Handler cho keyword search submit.
      */
     const handleKeywordSubmit = useCallback(
          (e) => {
               e.preventDefault();
               const formData = new FormData(e.target);
               const keyword = formData.get('keyword')?.toString().trim() || '';
               updateFilters({ keyword });
          },
          [updateFilters]
     );

     // ===== Derived state: filter, sort, paginate =====
     const filteredJobs = useMemo(() => filterJobs(SAMPLE_JOBS, filters), [filters]);
     const sortedJobs = useMemo(() => sortJobs(filteredJobs, filters.sortBy), [filteredJobs, filters.sortBy]);

     const totalJobs = sortedJobs.length;
     const totalPages = Math.max(1, Math.ceil(totalJobs / JOBS_PER_PAGE));
     const currentPage = Math.min(filters.page, totalPages);

     const paginatedJobs = useMemo(
          () => sortedJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE),
          [sortedJobs, currentPage]
     );

     // Filter props dùng chung cho sidebar (desktop & mobile sheet)
     const sidebarFilters = {
          locations: filters.locations,
          levels: filters.levels,
          skills: filters.skills,
          salaryRange: filters.salaryRange,
     };

     return (
          <div className="bg-background min-h-screen">
               {/* ===== Top Bar: Search ===== */}
               <div className="border-b bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                         {/* Page heading */}
                         <div className="flex items-center gap-2 mb-4">
                              <Briefcase size={24} className="text-primary" />
                              <h1 className="text-2xl font-bold text-foreground">Tìm việc làm</h1>
                         </div>

                         {/* Search bar */}
                         <form onSubmit={handleKeywordSubmit} className="flex gap-2">
                              <div className="relative flex-1">
                                   <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                   <Input
                                        name="keyword"
                                        defaultValue={filters.keyword}
                                        placeholder="Tìm kiếm theo chức danh, công ty, kỹ năng..."
                                        className="pl-10"
                                   />
                              </div>
                              <Button type="submit">Tìm kiếm</Button>

                              {/* Mobile filter trigger */}
                              <Sheet>
                                   <SheetTrigger asChild>
                                        <Button variant="outline" size="icon" className="lg:hidden shrink-0">
                                             <SlidersHorizontal size={18} />
                                        </Button>
                                   </SheetTrigger>
                                   <SheetContent side="left" className="overflow-y-auto">
                                        <SheetHeader>
                                             <SheetTitle>Bộ lọc tìm kiếm</SheetTitle>
                                        </SheetHeader>
                                        <div className="px-4 pb-4">
                                             <JobFilterSidebar
                                                  filters={sidebarFilters}
                                                  onFilterChange={handleFilterChange}
                                                  onClearFilters={handleClearFilters}
                                             />
                                        </div>
                                   </SheetContent>
                              </Sheet>
                         </form>
                    </div>
               </div>

               {/* ===== Main Content: 2 column layout ===== */}
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                         {/* Cột trái: Sidebar Filter (ẩn trên mobile) */}
                         <aside className="hidden lg:block lg:col-span-1">
                              <div className="sticky top-24">
                                   <JobFilterSidebar
                                        filters={sidebarFilters}
                                        onFilterChange={handleFilterChange}
                                        onClearFilters={handleClearFilters}
                                   />
                              </div>
                         </aside>

                         {/* Cột phải: Danh sách Job + Pagination */}
                         <main className="lg:col-span-3">
                              <JobListContent
                                   jobs={paginatedJobs}
                                   totalJobs={totalJobs}
                                   currentPage={currentPage}
                                   totalPages={totalPages}
                                   sortBy={filters.sortBy}
                                   onSortChange={handleSortChange}
                                   onPageChange={handlePageChange}
                              />
                         </main>
                    </div>
               </div>
          </div>
     );
};

export default JobListingPage;
