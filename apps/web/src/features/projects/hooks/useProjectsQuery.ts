import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getMyProjects, getProjects } from '../api/endpoints';
import type { GetProjectsFilter, ProjectsPagination } from '../api/types';

export function useProjectsQuery(filters?: GetProjectsFilter) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => getProjects(filters),
  });
}

export function useMyProjectsQuery(pagination?: ProjectsPagination) {
  return useQuery({
    queryKey: ['projects', 'me', pagination],
    queryFn: () => getMyProjects(pagination),
  });
}

export function useInfiniteProjectsQuery(limit = 20) {
  return useInfiniteQuery({
    queryKey: ['projects', 'infinite', { limit }],
    queryFn: ({ pageParam }) => getProjects({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === limit ? lastPageParam + 1 : undefined,
  });
}

export function useInfiniteMyProjectsQuery(limit = 20) {
  return useInfiniteQuery({
    queryKey: ['projects', 'me', 'infinite', { limit }],
    queryFn: ({ pageParam }) => getMyProjects({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === limit ? lastPageParam + 1 : undefined,
  });
}
