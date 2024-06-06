import React, { useState } from "react";
import './Popup.css';

const EditProductPopup = ({ product, closePopup, editSubmit }) => {
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.unitPrice);
    const [quantity, setQuantity] = useState(product.quantity);

    const handleDescChange = (event) => {
        setDescription(event.target.value);
    };

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
        if (regex.test(value)) {
            setQuantity(parseInt(value));
        } else {
            alert("Invalid quantity format. Please enter a number.");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        editSubmit(product.id, description, price, quantity);
    }

    return (
        <div className="popup">
            <div className={`popup-inner ${product.type === 1 ? 'crops' : 'poultry' }`}>
                <h2>Edit Product</h2>
                <form className='edit-form' onSubmit={handleSubmit}>
                    <label>
                        Description:
                        <input 
                            type="text" 
                            defaultValue={product.description}
                            onChange={handleDescChange} 
                            className="input-field"
                            required    
                        />
                    </label>
                    <label>
                        Price:
                        <input 
                            type="number" 
                            defaultValue={product.unitPrice}
                            min={0}
                            step={0.01}
                            onChange={handlePriceChange} 
                            required
                        />
                    </label>
                    <label>
                        Quantity:
                        <input 
                            type="number" 
                            defaultValue={product.quantity}
                            min={1}
                            step={1}
                            onChange={handleQuantityChange} 
                            required
                        />
                    </label>
                    <div className='popup-buttons'>
                        <button className='confirm-btn' type="submit" onClick={(e) => handleSubmit(e)}>Confirm</button>
                        <button className='cancel-btn'  type="button" onClick={closePopup}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )

}

export default EditProductPopup;