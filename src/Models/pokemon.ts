export interface PokemonDetail {
  name: string;
  //what do when more than one type
  types: {
    0: {
      type: {
        name: string,
      },
    },
    1: {
      type: {
        name: string,
      },
    },
  };

  sprites: {
    other: {
      "official-artwork": {
        front_default: string,
      },
    },
  };
}

export interface PokemonRef {
  name: string;
  url: string;
}

export interface PokemonListResp {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonRef[];
}