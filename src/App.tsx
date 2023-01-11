import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import Loader from "./components/Loader/loader";
import SearchBar from "./components/SearchBar/SearchBar";
import { AsyncValue } from "./Models/common";
import { PokemonDetail, PokemonListResp, PokemonRef } from "./Models/pokemon";

export function onKeyDownCallBack(
  onEnter: (text: string) => void,
  onEscape: () => void,
  ): (event: React.KeyboardEvent<HTMLDivElement>) => void {
  return (event): void => {
  if (event.key === "Enter" && event.target instanceof HTMLInputElement) {
  onEnter(event.target.value);
  } else if (event.key === "Escape" && event.target instanceof HTMLInputElement) {
  onEscape();
  // eslint-disable-next-line no-param-reassign
  event.target.value = "";
  }
  event.stopPropagation();
  };
  }

function App() {
  async function getPokemon(url: string): Promise<PokemonDetail> {
    return await fetch(url).then((resp) => resp.json());
  }

  const [pokemonRefs, setPokemonRefs] = useState<AsyncValue<PokemonRef[]>>({ status: "pending" });
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetail[]>([]);
  const [offset, setOffset] = useState(0);
  const limit = 898;
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const filteredPokemonDetails = useMemo(() => pokemonDetails.filter(pokemonDetail => pokemonDetail.name.includes(query)), [query, pokemonDetails]);

  const getPokemonList = useCallback(
    async (): Promise<PokemonListResp> => {
      const resp = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      );
      if (!resp.ok) {
        const message = await resp.text().catch(() => "Unknown error");
        throw Error(`Failed to fetch: ${message}`);
      }
      return await resp.json();
    }, []
  );

  useEffect(() => {
    (async () => {
      if (pokemonRefs.status === "ready") {
        // Array<Promise<PokemonDetail>>
        const detailPromises = pokemonRefs.value.filter(pokemonRef => {
          return pokemonRef.name.includes(query);
        })
        .map((elem) => {
          return getPokemon(elem.url);
        });
        // Promise<array<details>>
        const detailsPromise = Promise.all(detailPromises);
        // array<details>; await gets rid of (collapses) promises
        setLoading(true);
        const details = await detailsPromise;
        setPokemonDetails([...pokemonDetails, ...details]); //how to append new details?
        setLoading(false);
      }
    })();
  }, [pokemonRefs]);

  //set loading

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const resp = await getPokemonList();
        // pass query to getPokemonList() to update SearchBar
        setPokemonRefs({ status: "ready", value: [...resp.results] });
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
        onQueryChange={e => setQuery(e.target.value)} />
        <div className="data-result">
          <div className="pokedex-container">
            {pokemonRefs.status === "error" && pokemonRefs.message}
            {filteredPokemonDetails &&
              filteredPokemonDetails.map((pokemonDetail) => (
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
          </div>
        </div>
        <button
              className="more"
              onClick={() => {
                setOffset(offset + limit);
              }}
            >
              Click here for more Pokemon!
            </button>
      </div>
  );
}

export default App;
