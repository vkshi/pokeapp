import React, { useEffect, useState } from "react";
import { InvalidatedProjectKind } from "typescript";
import "./App.css";
import Loader from "./components/Loader/loader";
import SearchBar from "./components/SearchBar/SearchBar";

type AsyncValue<T, E = string> =
  | {
      status: "pending",
    }
  | {
      status: "ready",
      value: T,
    }
  | {
      status: "error",
      message: E,
    };

interface PokemonDetail {
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

interface PokemonRef {
  name: string;
  url: string;
}

interface PokemonListResp {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonRef[];
}

function App() {
  async function getPokemonList(): Promise<PokemonListResp> {
    const resp = await fetch(
      `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    );
    if (!resp.ok) {
      const message = await resp.text().catch(() => "Unknown error");
      throw Error(`Failed to fetch: ${message}`);
    }
    return await resp.json();
  }

  async function getPokemon(url: string): Promise<PokemonDetail> {
    return await fetch(url).then((resp) => resp.json());
  }

  const [pokemonRefs, setPokemonRefs] = useState<AsyncValue<PokemonRef[]>>({ status: "pending" });
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetail[]>([]);
  const [offset, setOffset] = useState(0);
  const limit = 20;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (pokemonRefs.status === "ready") {
        // Array<Promise<PokemonDetail>>
        const detailPromises = pokemonRefs.value.map((elem) => {
          return getPokemon(elem.url);
        });
        // Promise<array<details>>
        const detailsPromise = Promise.all(detailPromises);
        // array<details>; await gets rid of (collapses) promises
        const details = await detailsPromise;
        setLoading(true);
        setPokemonDetails([...pokemonDetails, ...details]); //how to append new details?
        setLoading(false);
      }
    })();
  }, [pokemonRefs]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await getPokemonList();
        setTimeout(function () {
          setLoading(true);
          setPokemonRefs({ status: "ready", value: [...resp.results] });
        }, 1000);
        setLoading(false);
      } catch (e) {
        setPokemonRefs({
          status: "error",
          message: e instanceof Error ? e.message : String(e),
        });
      }
    })();
  }, [offset]);

  return (
    <div className="App">
      <div>{loading == true ? <Loader /> : ""}</div>
      <h1 className="header">Pokedex App</h1>
      <SearchBar
        setPokemon={() => setPokemonRefs(pokemonRefs)} />
        <div className="data-result">
          <div className="pokedex-container">
            {pokemonRefs.status === "error" && pokemonRefs.message}
            {pokemonDetails &&
              pokemonDetails.map((pokemonDetail) => (
                <div className="container">
                  <h1 className="name">{pokemonDetail.name}</h1>
                  <p className="type">
                    {Object.values(pokemonDetail.types).map((x) => (
                      <span className="type">{x.type.name} </span>
                    ))}
                  </p>
                  <img
                    width="200px"
                    src={
                      pokemonDetail.sprites.other["official-artwork"].front_default}
                  />
                </div>
              ))}
            <button
              className="more"
              onClick={() => {
                setOffset(offset + limit);
              }}
            >
              Click here for more Pokemon!
            </button>
          </div>
        </div>
      </div>
  );
}

export default App;
