import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProjectRole, deleteProjectRole, updateProjectRole } from '../api/roleEndpoints';
import type { CreateProjectRoleRequest, UpdateProjectRoleRequest } from '../api/types';

export function useCreateProjectRoleMutation(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProjectRoleRequest) => createProjectRole(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
}

export function useUpdateProjectRoleMutation(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRoleRequest }) =>
      updateProjectRole(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
}

export function useDeleteProjectRoleMutation(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProjectRole(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['project', projectId] });
    },
  });
}
