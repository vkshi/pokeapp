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
    //what do when more than one type
    types: {
        0: {
            type: {
                name: string
            }
        1: {
            type: {
                name: string
            }
        }
    }
};
    sprites: {
        other: {
            "official-artwork": {
                front_default: string
            }
        }
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

function App() {

    async function getPokemonList(): Promise<PokemonListResp> {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
        if (!resp.ok) {
            const message = await resp.text().catch(() => "Unknown error")
            throw Error(`Failed to fetch: ${message}`)
        }
        return await resp.json()
    }
    
    async function getPokemon(url: string): Promise<PokemonDetail> {
        return await fetch(url).then((resp) => resp.json())
    }

    const [pokemonRefs, setPokemonRefs] = useState<AsyncValue<PokemonRef[]>>({ status: "pending" });
    const [pokemonDetails, setPokemonDetails] = useState<PokemonDetail[] | null>(null);
    const [offset, setOffset] = useState(0);
    const limit = 20;

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
                setPokemonDetails([...details]) //how to append new details?
            }
        })();
    }, [[pokemonRefs]]);

    useEffect(() => {
        (async () => {
            try {
                const resp = await getPokemonList();
                setPokemonRefs({ status: "ready", value: [...resp.results] });
            } catch (e) {
                setPokemonRefs( {status: "error", message: e instanceof Error ? e.message : String(e)})
            }
        })();
    }, [offset]);


    return (
        <div className="App">
            {pokemonRefs.status === "error" && pokemonRefs.message}
            {pokemonDetails && pokemonDetails.map((pokemonDetail) => (
                <div>
                    <h1>{pokemonDetail.name}</h1>
                    <p>{pokemonDetail.types[0].type.name}</p>
                    <img width="200px" src={pokemonDetail.sprites.other["official-artwork"].front_default} />
                </div>
            ))}
            <button
                onClick={() => {setOffset(offset + limit)}}
            >Click Here for more Pokemon!</button>
        </div>
    );
}

export default App;
