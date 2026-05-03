import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getProjectApplications, updateApplicationStatus } from '../api/endpoints';

export function useProjectApplicationsQuery(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId, 'applications'],
    queryFn: () => getProjectApplications(projectId),
    enabled: Boolean(projectId),
  });
}

export function useUpdateApplicationStatusMutation(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACCEPTED' | 'REJECTED' }) =>
      updateApplicationStatus(id, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['project', projectId, 'applications'] });
      void queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
}
