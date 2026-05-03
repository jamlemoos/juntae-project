import type { IbgeMunicipioRaw } from './types';

const IBGE_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome';

export async function fetchIbgeCities(): Promise<IbgeMunicipioRaw[]> {
  const res = await fetch(IBGE_URL);
  if (!res.ok) throw new Error(`IBGE API error: ${res.status}`);
  return res.json() as Promise<IbgeMunicipioRaw[]>;
}
