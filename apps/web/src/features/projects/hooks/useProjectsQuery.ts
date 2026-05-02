import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../api/endpoints';
import type { GetProjectsFilter } from '../api/types';

export function useProjectsQuery(filters?: GetProjectsFilter) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => getProjects(filters),
  });
}
