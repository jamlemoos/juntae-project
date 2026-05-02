import { useQuery } from '@tanstack/react-query';
import { getProjectDetails } from '../api/endpoints';

export function useProjectDetailQuery(projectId: string) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => getProjectDetails(projectId),
    enabled: Boolean(projectId),
  });
}
