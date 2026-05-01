import { mapSkill, type SkillApiResponse } from '../../../shared/api/mappers';
import type { UserResponse } from './types';

type UserApiResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  city: string;
  skills: SkillApiResponse[];
  created_at: string;
  updated_at: string;
};

export function mapUser(raw: UserApiResponse): UserResponse {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    bio: raw.bio,
    city: raw.city,
    skills: raw.skills.map(mapSkill),
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export type { UserApiResponse };
