import { useQuery } from '@tanstack/react-query';
import { getJobs, getJobById, getJobsByCompany, getJobLevels, getJobCategories } from '@/services/job.service';

/**
 * Hook lấy danh sách jobs với filter/sort/pagination.
 * @param {Object} filters - { keyword, location, job_type, status, job_level_id,
 *   category_ids, salary_min, salary_max, company_id, sort, page, limit }
 * @param {Object} options - React Query options (enabled, etc.)
 */
export const useJobs = (filters = {}, options = {}) => {
     // Loại bỏ params undefined/null/empty để URL sạch
     const cleanParams = Object.fromEntries(
          Object.entries(filters).filter(
               ([, v]) => v !== undefined && v !== null && v !== ''
          )
     );

     return useQuery({
          queryKey: ['jobs', cleanParams],
          queryFn: () => getJobs(cleanParams).then((res) => res.data.data),
          ...options,
     });
};

/**
 * Hook lấy chi tiết 1 job.
 * @param {number} id
 * @param {Object} options
 */
export const useJob = (id, options = {}) => {
     return useQuery({
          queryKey: ['job', id],
          queryFn: () => getJobById(id).then((res) => res.data.data),
          enabled: !!id,
          ...options,
     });
};

/**
 * Hook lấy jobs theo company.
 * @param {number} companyId
 * @param {Object} params - { page, limit }
 * @param {Object} options
 */
export const useJobsByCompany = (companyId, params = {}, options = {}) => {
     return useQuery({
          queryKey: ['jobs', 'company', companyId, params],
          queryFn: () => getJobsByCompany(companyId, params).then((res) => res.data.data),
          enabled: !!companyId,
          ...options,
     });
};

/**
 * Hook lấy job levels (ít thay đổi → staleTime dài).
 */
export const useJobLevels = (options = {}) => {
     return useQuery({
          queryKey: ['jobLevels'],
          queryFn: () => getJobLevels().then((res) => res.data.data),
          staleTime: 1000 * 60 * 30, // 30 phút
          ...options,
     });
};

/**
 * Hook lấy job categories (ít thay đổi → staleTime dài).
 */
export const useJobCategories = (options = {}) => {
     return useQuery({
          queryKey: ['jobCategories'],
          queryFn: () => getJobCategories().then((res) => res.data.data),
          staleTime: 1000 * 60 * 30,
          ...options,
     });
};
