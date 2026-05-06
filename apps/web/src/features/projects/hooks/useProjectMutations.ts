import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject, updateProject } from '../api/endpoints';
import type { CreateProjectRequest, UpdateProjectRequest } from '../api/types';

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),
    onSuccess: () => {
      // Only the owner's lists need refreshing. Explore lists are not invalidated
      // because the new project may not be OPEN, and the user is navigated away
      // from explore on creation. The ['projects', 'me'] prefix covers both
      // useMyProjectsQuery and useInfiniteMyProjectsQuery.
      void queryClient.invalidateQueries({ queryKey: ['projects', 'me'] });
    },
  });
}

export function useUpdateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      updateProject(id, data),
    onSuccess: (_result, { id }) => {
      void queryClient.invalidateQueries({ queryKey: ['project', id] });
      // Owner's lists — project may change position or visibility
      void queryClient.invalidateQueries({ queryKey: ['projects', 'me'] });
      // Explore infinite lists — title/status/description changes must be reflected
      // in public browsing. ['projects', 'infinite'] covers useInfiniteProjectsQuery.
      void queryClient.invalidateQueries({ queryKey: ['projects', 'infinite'] });
    },
  });
}
