import React from "react";
import './loader.css'

interface LoaderProps {

}

const Loader: React.FC<LoaderProps> = () => {
    return (
        <div className="wrapper">
            <div className="pokeball"></div>
        </div>
    );
}

export default Loader;