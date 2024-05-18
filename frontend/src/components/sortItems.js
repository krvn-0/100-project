import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";

export default function SortedList(props){
    const options = props.options;

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [sortOrder, setOrder] = useState("ascending");

    useEffect(() => {
        sortItems();
    }, [sortOrder, selectedOption]);

    useEffect(() => {
        console.log("Sorted by:", selectedOption, sortOrder);
    }, [sortOrder, selectedOption]);

    const sortItems = () => {
        // Create a copy of the original items
        const itemsCopy = [...props.item_list];

        // Sort the items based on the selected criteria and order
        switch(selectedOption) {
            case "Name":
                itemsCopy.sort((a, b) => {
                    return sortOrder === "ascending" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
                });
                break;
            case "Price":
                itemsCopy.sort((a, b) => {
                    return sortOrder === "ascending" ? a.price - b.price : b.price - a.price;
                });
                break;
            case "Quantity":
                itemsCopy.sort((a, b) => {
                    return sortOrder === "ascending" ? a.quantity - b.quantity : b.quantity - a.quantity;
                });
                break;
            case "Type":
                itemsCopy.sort((a, b) => {
                    return sortOrder === "ascending" ? a.type - b.type : b.type - a.type;
                });
                break;
            default:
                break;
        }
        props.setItems(itemsCopy);
    }

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        let newOrder = sortOrder;
        if(option === selectedOption) {
            newOrder = (sortOrder === "ascending" ? "descending" : "ascending") ;
        } else {
            newOrder = "ascending";
        }
        setSelectedOption(option);
        setOrder(newOrder);
        setIsOpen(false);
    };

    return (
        <div className="custom_dropdown">
            <label htmlFor="label_dropdown" className="label">Sort By:</label>
            <div className="dropdown_header" onClick={handleToggleDropdown}>
                {selectedOption ? (
                    <div className="sort_by_option">
                        {selectedOption}
                        <p>{sortOrder === "ascending" ? <ArrowUp /> : <ArrowDown /> }</p>
                    </div>
                    ) : (
                    <div className="sort_by_option">
                        <p>Select an option </p> 
                        <ArrowDown />
                    </div>
                )}
            </div>
            {isOpen && (
                <div className="dropdown_options">
                    {options.map((option) => (
                        <div key={option} className="dropdown_option" onClick={() => handleOptionClick(option)}>
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}