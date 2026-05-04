import type { CityOption } from './api/types';

export type { CityOption };

export const FALLBACK_CITIES: CityOption[] = [
  { id: 'rn-natal', name: 'Natal', state: 'RN', label: 'Natal, RN' },
  { id: 'rn-parnamirim', name: 'Parnamirim', state: 'RN', label: 'Parnamirim, RN' },
  { id: 'rn-mossoro', name: 'Mossoró', state: 'RN', label: 'Mossoró, RN' },
  {
    id: 'rn-sga',
    name: 'São Gonçalo do Amarante',
    state: 'RN',
    label: 'São Gonçalo do Amarante, RN',
  },
  { id: 'rn-macaiba', name: 'Macaíba', state: 'RN', label: 'Macaíba, RN' },
  { id: 'rn-ceara-mirim', name: 'Ceará-Mirim', state: 'RN', label: 'Ceará-Mirim, RN' },
  { id: 'rn-caico', name: 'Caicó', state: 'RN', label: 'Caicó, RN' },
  { id: 'rn-currais-novos', name: 'Currais Novos', state: 'RN', label: 'Currais Novos, RN' },
  { id: 'rn-assu', name: 'Assú', state: 'RN', label: 'Assú, RN' },
  { id: 'rn-pau-dos-ferros', name: 'Pau dos Ferros', state: 'RN', label: 'Pau dos Ferros, RN' },
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '');
}

export function searchCities(cities: CityOption[], query: string, limit = 8): CityOption[] {
  if (!query.trim()) return cities.slice(0, limit);
  const q = normalize(query);
  const prefix: CityOption[] = [];
  const contains: CityOption[] = [];

  for (const c of cities) {
    if (prefix.length + contains.length >= limit * 2) break;
    const n = normalize(c.name);
    if (n.startsWith(q)) prefix.push(c);
    else if (n.includes(q)) contains.push(c);
  }

  return [...prefix, ...contains].slice(0, limit);
}
