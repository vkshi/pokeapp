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

interface Pokemon {
    name: string;
    sprites: {
        back_default: string;
    }
}

interface PokemonListResp {
    count: number;
    next: string | null;
    previous: string | null;
    results: Pokemon[];
}

async function getPokemonList(): Promise<PokemonListResp> {
    return await fetch("https://pokeapi.co/api/v2/pokemon").then((resp) => resp.json())
}

async function getPokemon(): Promise<Pokemon> {
    return await fetch("https://pokeapi.co/api/v2/pokemon/1").then((resp) => resp.json())
}

/*
 * const resp = await fetch("https://pokeapi.co/api/v2/pokemon/ditto")
 * const resp_json = await resp.json()
 */
function App() {
    const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

    useEffect(() => {
        (async () => {
            const resp = await getPokemonList();
            setPokemonList(resp.results);
        })();
        (async () => {
            const resp = await getPokemon();
            setSelectedPokemon(resp);
        })();
    }, []);

    return (
        <div className="App">
            {/*{pokemonList.map((pokemon) =>*/}
            {/*  <span>{ pokemon.name } </span>*/}
            {/*) }*/}
            {pokemonList.map((pokemon) => pokemon.name).join(", ")}
            {selectedPokemon && (
                <img src={selectedPokemon.sprites.back_default} />
            )}
        </div>
    );
}

export default App;
