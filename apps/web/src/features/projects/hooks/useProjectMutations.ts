import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject, updateProject } from '../api/endpoints';
import type { CreateProjectRequest, UpdateProjectRequest } from '../api/types';

export function useCreateProjectMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectRequest) => createProject(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
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
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
