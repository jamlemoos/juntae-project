import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getMyProjects, getProjects } from '../api/endpoints';
import type { GetProjectsFilter, ProjectsPagination } from '../api/types';

const PROJECTS_PAGE_LIMIT_MAX = 50;

function normalizeProjectsLimit(limit: number): number {
  return Math.min(Math.max(limit, 1), PROJECTS_PAGE_LIMIT_MAX);
}

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
  const normalizedLimit = normalizeProjectsLimit(limit);
  return useInfiniteQuery({
    queryKey: ['projects', 'infinite', { limit: normalizedLimit }],
    queryFn: ({ pageParam }) => getProjects({ page: pageParam, limit: normalizedLimit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === normalizedLimit ? lastPageParam + 1 : undefined,
  });
}

export function useInfiniteMyProjectsQuery(limit = 20) {
  const normalizedLimit = normalizeProjectsLimit(limit);
  return useInfiniteQuery({
    queryKey: ['projects', 'me', 'infinite', { limit: normalizedLimit }],
    queryFn: ({ pageParam }) => getMyProjects({ page: pageParam, limit: normalizedLimit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === normalizedLimit ? lastPageParam + 1 : undefined,
  });
}
