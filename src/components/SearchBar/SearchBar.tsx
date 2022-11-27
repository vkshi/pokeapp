import React from "react";
import './SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


interface SearchBarProps {
  onQueryChange: React.ChangeEventHandler<HTMLInputElement>;   
}

//props.setPokemon is not a function???

function SearchBar({onQueryChange}: SearchBarProps) {
  //const {setPokemon} = props;

  return (
    <div className="search">
      <input
        className="search-inputs"
        type="text"
        placeholder="Search Pokemon"
        onChange={onQueryChange}
      />
      <button className="search-icon"><FontAwesomeIcon icon={faMagnifyingGlass} color="white" /></button>
    </div>
  );
}

export default SearchBar;