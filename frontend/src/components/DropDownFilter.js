import React from "react";
import './DropDownFilter.css';
const DropDownFilter = ({ name, options, handleOnChange, value, setSortOrder }) => {

    const handleOrderChange = (value) => {
        setSortOrder(value);
    }

    return (
        <div className="dropdown-filters">
            <div className="sub-filter">
                <label className="filter-label">Sort by: </label>
                <select
                    className="dropdown-filter"
                    id={name}
                    name={name}
                    value={value}
                    onChange={(e) => handleOnChange(e.target.value)}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="sub-filter">
                <label className="filter-label">Order: </label>
                <select className="filter-order" onChange={(e) => handleOrderChange(e.target.value)}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
        </div>
    )
}

export default DropDownFilter;