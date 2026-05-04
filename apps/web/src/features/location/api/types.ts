export type IbgeMunicipioRaw = {
  id: number;
  nome: string;
  microrregiao: {
    mesorregiao: {
      UF: {
        sigla: string;
      };
    };
  };
};

export type CityOption = {
  id: string;
  name: string;
  state: string;
  label: string; // "Natal, RN"
};
