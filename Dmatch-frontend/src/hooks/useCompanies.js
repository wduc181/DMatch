import { useQuery } from '@tanstack/react-query';
import { getCompanyById } from '@/services/company.service';

/**
 * Hook lấy chi tiết 1 company.
 * @param {number} id
 * @param {Object} options - React Query options
 */
export const useCompany = (id, options = {}) => {
     return useQuery({
          queryKey: ['company', id],
          queryFn: () => getCompanyById(id).then((res) => res.data.data),
          enabled: !!id,
          ...options,
     });
};
