import { http } from '../../../shared/api/http';

export type UserProfileApiResponse = {
  id?: string;
  user_id: string;
  headline: string;
  availability: string;
  created_at?: string;
  updated_at?: string;
};

export type UserProfileResponse = {
  userId: string;
  headline: string;
  availability: string;
};

export type UpsertProfileRequest = {
  headline: string;
  availability: string;
};

export function mapUserProfile(raw: UserProfileApiResponse): UserProfileResponse {
  return {
    userId: raw.user_id,
    headline: raw.headline ?? '',
    availability: raw.availability ?? 'available',
  };
}

export async function getMyProfile(): Promise<UserProfileResponse> {
  const raw = await http.get<UserProfileApiResponse>('/users/me/profile');
  return mapUserProfile(raw);
}

export async function upsertMyProfile(data: UpsertProfileRequest): Promise<UserProfileResponse> {
  const raw = await http.put<UserProfileApiResponse>('/users/me/profile', data);
  return mapUserProfile(raw);
}
