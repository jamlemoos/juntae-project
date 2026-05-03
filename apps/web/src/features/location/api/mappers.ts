import type { CityOption, IbgeMunicipioRaw } from './types';

export function mapIbgeMunicipio(raw: IbgeMunicipioRaw): CityOption {
  const state = raw.microrregiao.mesorregiao.UF.sigla;
  return {
    id: String(raw.id),
    name: raw.nome,
    state,
    label: `${raw.nome}, ${state}`,
  };
}
