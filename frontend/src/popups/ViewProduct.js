import React from 'react';
import './Popup.css';
import './ViewProduct.css';

const ViewProductPopup = ({ product, handleAddClick, handleClose }) => {
    return (
        <div className='popup'>
            <div className={`popup-inner ${product.type === 1 ? 'crops' : 'animals'} `}>
                <div className="product-image"><img src={product.image} alt={product.name} /></div>
                <div className='product-info'>
                    <h2 className="product-name">{product.name}</h2>
                    <p className='product-type'>{product.type === 1 ? 'Crop' : 'Animal'}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">Price: P{product.price} per {product.qty_type}</p>
                    <p className="product-stock">Stock: {product.quantity} {product.qty_type}</p>
                </div>
                <div className="popup-buttons">
                    <button className='add-to-cart' onClick={() => handleAddClick(product, 1)}>Add</button>
                    <button className='close' onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default ViewProductPopup;