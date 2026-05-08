import { http } from '../../../shared/api/http';
import { mapSkill, type SkillApiResponse } from '../../../shared/api/mappers';
import type { SkillResponse } from '../../../shared/api/types';

export async function getSkills(): Promise<SkillResponse[]> {
  const raw = await http.get<SkillApiResponse[]>('/skills');
  return raw.map(mapSkill);
}

export async function createSkill(name: string): Promise<SkillResponse> {
  const raw = await http.post<SkillApiResponse>('/skills', { name });
  return mapSkill(raw);
}
