import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAdminUsersApi, toggleAdminUserStatusApi } from '@/services/admin.service';

export const useAdminUsers = (options = {}) => {
     return useQuery({
          queryKey: ['admin', 'users'],
          queryFn: () => getAdminUsersApi().then((response) => response.data),
          ...options,
     });
};

export const useToggleAdminUserStatus = () => {
     const queryClient = useQueryClient();

     return useMutation({
          mutationFn: (userId) => toggleAdminUserStatusApi(userId).then((response) => response.data),
          onSuccess: () => {
               queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
          },
     });
};