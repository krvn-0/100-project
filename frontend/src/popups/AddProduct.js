import React, { useState } from "react";
import './Popup.css';
import './AddProduct.css';

function AddProductPopup({closePopup, addSubmit}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [unit, setUnit] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [type, setType] = useState(1);

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleDescChange = (event) => {
        setDescription(event.target.value);
    }

    const handlePriceChange = (event) => {
        const value = event.target.value;
        const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
        if (regex.test(value)) {
            setPrice(parseFloat(value));
        } else {
            alert("Invalid price format. Please enter a number.");
        }
    }

    const handleQuantityChange = (event) => {
        const value = event.target.value;
        const regex = /^[0-9]+$/;
        if(regex.test(value)) {
            setQuantity(parseInt(event.target.value));
        } else {
            alert("Invalid quantity format. Please enter a number.");
        }
    }

    const handleUnitChange = (event) => {
        setUnit(event.target.value);
    }

    const handleTypeChange = (event) => {
        setType(parseInt(event.target.value));
    }

    const handleImageUrlChange = (event) => {
        setImageUrl(event.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        closePopup()
        addSubmit(name, description, price, quantity, type, unit, imageUrl);
    }

    return (
        <div className="popup add-product-popup">
            <div className="popup-inner add-product-inner">
                <h1>Add Product</h1>
                <form className="edit-form" onSubmit={handleSubmit}> 
                    <label className="add-input">
                        Name:
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Enter product name"
                            onChange={handleNameChange}
                            value={name}
                            name="name" 
                            required 
                        />
                    </label>
                    <label className="add-input">
                        Description:
                        <input 
                            type="text" 
                            id="description" 
                            placeholder="Enter product description"
                            onChange={handleDescChange}
                            value={description}
                            name="description" 
                        />
                    </label>
                    <label className="add-input">
                        Price:
                        <input 
                            type="number" 
                            id="price" 
                            placeholder="Enter product price (up to 2 decimal places)"
                            onChange={handlePriceChange}
                            value={price}
                            name="price" 
                            required 
                        />
                    </label>
                    <label className="add-input">
                        Quantity: 
                        <input 
                            type="number" 
                            id="quantity" 
                            placeholder="Enter product quantity (whole numbers only)"
                            onChange={handleQuantityChange}
                            value={quantity}
                            min={1}
                            step={1}
                            name="quantity" 
                            required 
                        />
                    </label>
                    <label className="add-input">
                        Unit:
                        <input 
                            type="text" 
                            id="unit" 
                            placeholder="Enter product unit (kg, lbs, etc.)"
                            onChange={handleUnitChange}
                            value={unit}
                            name="unit" 
                            required
                        />
                    </label>
                    <label className="add-input">
                        Type:
                        <select 
                            id="type" 
                            name="type" 
                            placeholder={'Choose product type'}
                            value={type}
                            onChange={handleTypeChange}
                            required
                        >
                            <option value={1}>Crops</option>
                            <option value={2}>Poultry</option>
                        </select>
                    </label>
                    <label className="add-input">
                        Image URL:
                        <input 
                            type="text" 
                            id="imageUrl" 
                            placeholder="Enter image URL"
                            onChange={handleImageUrlChange}
                            value={imageUrl}
                            name="imageUrl" 
                            required
                        />
                    </label>
                    <div className="button-container">
                        <button type="submit" className="confirm-btn">Add</button>
                        <button type="button" className="cancel-btn" onClick={closePopup}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductPopup;