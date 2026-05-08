import { useQuery } from '@tanstack/react-query';
import { getCompanyById, getCompanyByOwnerId } from '@/services/company.service';

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

/**
 * Hook lấy company theo owner ID (cho recruiter dashboard).
 * @param {number} ownerId
 * @param {Object} options
 */
export const useCompanyByOwner = (ownerId, options = {}) => {
     return useQuery({
          queryKey: ['company', 'owner', ownerId],
          queryFn: () => getCompanyByOwnerId(ownerId).then((res) => res.data.data),
          enabled: !!ownerId,
          ...options,
     });
};
