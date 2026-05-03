import { useQuery } from '@tanstack/react-query';
import { getSkills } from '../api/endpoints';

export function useSkillsQuery() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: getSkills,
    staleTime: 5 * 60 * 1000, // skills change infrequently
  });
}
