import { useMutation } from '@tanstack/react-query';
import { updateUser } from '../api/endpoints';
import { useAuthStore } from '../../auth/store/authStore';
import type { UpdateUserRequest } from '../api/types';

export function useUpdateUserMutation() {
  const refreshUser = useAuthStore((s) => s.refreshUser);
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => updateUser(id, data),
    onSuccess: () => {
      void refreshUser();
    },
  });
}
