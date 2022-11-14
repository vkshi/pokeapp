import React, { useEffect, useState } from 'react';
import './App.css';

type AsyncValue<T, E = string> =
    | {
    status: "pending";
}
    | {
    status: "ready";
    value: T;
}
    | {
    status: "error";
    message: E;
};

interface PokemonDetail {
    name: string;
    sprites: {
        back_default: string;
    }
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

async function getPokemonList(): Promise<PokemonListResp> {
    const resp = await fetch("https://pokeapi.co/api/v2/pokemon")
    if (!resp.ok) {
        const message = await resp.text().catch(() => "Unknown error")
        throw Error(`Failed to fetch: ${message}`)
    }
    return await resp.json()
}

async function getPokemon(url: string): Promise<PokemonDetail> {
    return await fetch(url).then((resp) => resp.json())
}

/*
 * const resp = await fetch("https://pokeapi.co/api/v2/pokemon/ditto")
 * const resp_json = await resp.json()
 */
function App() {
    const [pokemonRefs, setPokemonRefs] = useState<AsyncValue<PokemonRef[]>>({ status: "pending" });
    const [pokemonDetails, setPokemonDetails] = useState<PokemonDetail[] | null>(null);

    useEffect(() => {
        (async () => {
            if (pokemonRefs.status === "ready") {
                // Array<Promise<PokemonDetail>>
                const detailPromises = pokemonRefs.value.map((elem) => {
                    return getPokemon(elem.url)
                })
                // Promise<array<details>>
                const detailsPromise = Promise.all(detailPromises)
                // array<details>; await gets rid of (collapses) promises
                const details = await detailsPromise
                setPokemonDetails(details)
            }
        })();
    }, [pokemonRefs]);

    useEffect(() => {
        (async () => {
            try {
                const resp = await getPokemonList();
                setPokemonRefs({ status: "ready", value: resp.results });
            } catch (e) {
                setPokemonRefs( {status: "error", message: e instanceof Error ? e.message : String(e)})
            }
        })();
    }, []);

    return (
        <div className="App">
            {/*{pokemonList.map((pokemon) =>*/}
            {/*  <span>{ pokemon.name } </span>*/}
            {/*) }*/}
            {pokemonRefs.status === "error" && pokemonRefs.message}
            {pokemonDetails && pokemonDetails.map((pokemonDetail) => (
                <div>
                    {pokemonDetail.name}
                    <img src={pokemonDetail.sprites.back_default} />
                </div>

            ))}

            {/*{pokemonDetails && (*/}
            {/*    <img src={pokemonDetails.sprites.back_default} />*/}
            {/*)}*/}
        </div>
    );
}

export default App;
