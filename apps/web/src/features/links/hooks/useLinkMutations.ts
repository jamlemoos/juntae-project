import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLink, deleteLink, updateLink } from '../api/endpoints';
import type { CreateLinkRequest, UpdateLinkRequest } from '../api/types';

export function useCreateLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLinkRequest) => createLink(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}

export function useUpdateLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLinkRequest }) => updateLink(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}

export function useDeleteLinkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteLink(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['links'] });
    },
  });
}
