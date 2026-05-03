import { useQuery } from '@tanstack/react-query';
import { fetchIbgeCities } from '../api/endpoints';
import { mapIbgeMunicipio } from '../api/mappers';

export function useCitiesQuery() {
  return useQuery({
    queryKey: ['ibge', 'cities'],
    queryFn: async () => {
      const raw = await fetchIbgeCities();
      return raw.map(mapIbgeMunicipio);
    },
    staleTime: 24 * 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
