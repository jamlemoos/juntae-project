import type { PublicUserResponse, SkillResponse } from './types';

type SkillApiResponse = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type PublicUserApiResponse = {
  id: string;
  name: string;
  city: string;
  skills: SkillApiResponse[];
  created_at: string;
};

export function mapSkill(raw: SkillApiResponse): SkillResponse {
  return {
    id: raw.id,
    name: raw.name,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

export function mapPublicUser(raw: PublicUserApiResponse): PublicUserResponse {
  return {
    id: raw.id,
    name: raw.name,
    city: raw.city,
    skills: raw.skills.map(mapSkill),
    createdAt: raw.created_at,
  };
}

export type { SkillApiResponse, PublicUserApiResponse };
