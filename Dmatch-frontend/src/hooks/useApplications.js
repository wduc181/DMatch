import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
     applyToJob,
     getCompanyApplications,
     getMyApplicationForJob,
     getMyApplications,
     updateApplicationStatus,
     withdrawApplication,
} from '@/services/application.service';

export const useMyApplications = (params = {}, options = {}) => {
     return useQuery({
          queryKey: ['applications', 'me', params],
          queryFn: () => getMyApplications(params).then((res) => res.data.data),
          ...options,
     });
};

export const useMyApplicationForJob = (jobId, options = {}) => {
     return useQuery({
          queryKey: ['applications', 'me', 'job', jobId],
          queryFn: () => getMyApplicationForJob(jobId)
               .then((res) => res.data.data)
               .catch((error) => {
                    if (error.response?.status === 404) return null;
                    throw error;
               }),
          enabled: !!jobId,
          retry: false,
          ...options,
     });
};

export const useCompanyApplications = (companyId, params = {}, options = {}) => {
     const cleanParams = Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
     );

     return useQuery({
          queryKey: ['applications', 'company', companyId, cleanParams],
          queryFn: () => getCompanyApplications(companyId, cleanParams).then((res) => res.data.data),
          enabled: !!companyId,
          ...options,
     });
};

export const useApplyToJob = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationFn: ({ jobId, data }) => applyToJob(jobId, data).then((res) => res.data.data),
          onSuccess: (_data, variables) => {
               queryClient.invalidateQueries({ queryKey: ['applications'] });
               queryClient.invalidateQueries({ queryKey: ['applications', 'me', 'job', variables.jobId] });
          },
     });
};

export const useUpdateApplicationStatus = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationFn: ({ applicationId, status }) => updateApplicationStatus(applicationId, status).then((res) => res.data.data),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['applications'] });
          },
     });
};

export const useWithdrawApplication = () => {
     const queryClient = useQueryClient();
     return useMutation({
          mutationFn: (applicationId) => withdrawApplication(applicationId).then((res) => res.data.data),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['applications'] });
          },
     });
};
