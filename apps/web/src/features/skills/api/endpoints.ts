import { http } from '../../../shared/api/http';
import { mapSkill, type SkillApiResponse } from '../../../shared/api/mappers';
import type { SkillResponse } from '../../../shared/api/types';

export async function getSkills(): Promise<SkillResponse[]> {
  const raw = await http.get<SkillApiResponse[]>('/skills');
  return raw.map(mapSkill);
}
