import type { SkillResponse } from '../../../shared/api/types';

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  city: string;
  skills: SkillResponse[];
  createdAt: string;
  updatedAt: string;
};

export type UpdateUserRequest = {
  name: string;
  email: string;
  bio?: string;
  city: string;
  skillNames?: string[];
};
