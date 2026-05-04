import { useQuery } from '@tanstack/react-query';
import { getMyLinks } from '../api/endpoints';

export function useLinksQuery() {
  return useQuery({
    queryKey: ['links'],
    queryFn: getMyLinks,
  });
}
