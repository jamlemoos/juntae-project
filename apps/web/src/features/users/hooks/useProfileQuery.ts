import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, upsertMyProfile } from '../api/profileEndpoints';
import type { UpsertProfileRequest } from '../api/profileEndpoints';

export function useMyProfileQuery() {
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: getMyProfile,
  });
}

export function useUpsertProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpsertProfileRequest) => upsertMyProfile(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['my-profile'] });
    },
  });
}
