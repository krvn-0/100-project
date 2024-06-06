import React from "react";
import './SortBar.css';

const SortBar = ({ value, handleSearchClick, handleOnChange, handleClearClick, children}) => {
    return (
        <div className="sort-bar">
        <div className="sort-bar-search">
            <input type="text" className="searchbox" placeholder="Search" value={value} onChange={handleOnChange} />
            <button className='search-btn' type="submit" onClick={handleSearchClick}>Search</button>
            <button className='clear-btn' onClick={handleClearClick}>Clear</button>
        </div>
        {children}
        </div>
    );
}

export default SortBar;