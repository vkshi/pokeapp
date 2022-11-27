import { prependOnceListener } from "process";
import React, { useState, useEffect } from "react";
import './SearchBar.css'

interface SearchBarProps {
    setPokemon: () => void;
}

//props.setPokemon is not a function???

const SearchBar: React.FC<SearchBarProps> = (setPokemon, props) => {
    const [query, setQuery] = useState("");

    async function getPokemonQuery() {
        const resp = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${query}`
        );
        if (!resp.ok) {
          const message = await resp.text().catch(() => "Unknown error");
          throw Error(`Failed to fetch: ${message}`);
        }
        return await resp.json();
      }

      useEffect(() => {
        (async () => {
          try {
            const resp = await getPokemonQuery();
            setTimeout(function () {
              //setLoading(true);
              props.setPokemon({ status: "ready", value: resp.results });
            }, 1000);
            //setLoading(false);
          } catch (e) {
            props.setPokemon({
              status: "error",
              message: e instanceof Error ? e.message : String(e),
            });
          }
        })();
      }, [query]);

    return (
        <div className="search">
        <span className="search-inputs">
          <input
            type="text"
            placeholder="Search Pokemon"
            onSubmit={(e) => setQuery((e.target as HTMLInputElement).value)}
          />
          <span className="search-icon"></span>
        </span>
        </div>
    );
}

export default SearchBar;