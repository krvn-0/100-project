import React from 'react';
import './Popup.css';
import './ViewProduct.css';

const ViewProductPopup = ({ product, handleAddClick, handleClose, handleDelete }) => {
    const isAdmin = JSON.parse(sessionStorage.getItem('isAdmin')) || false;

    return (
        <div className='popup view-product'>
            <div className={`popup-inner ${product.type === 1 ? 'crops' : 'poultry'} `}>
                <div className="product-image"><img src={product.imageUrl} alt={product.name} /></div>
                <div className='product-info'>
                    <h2 className="product-name">{product.name}</h2>
                    <p className='product-type'>{product.type === 1 ? 'Crop' : 'Animal'}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">Price: P{product.unitPrice} per {product.unit}</p>
                    <p className="product-stock">Stock: {product.quantity} {product.unit}</p>
                </div>
                {isAdmin ? (
                    <div className="product-buttons">
                        <button className='delete' onClick={() => handleDelete(product)}>Delete</button>
                        <button className='close' onClick={handleClose}>Close</button>
                    </div>
                    ) :
                    (
                    <div className="product-buttons">
                        <button className='add-to-cart' onClick={() => handleAddClick(product, 1)}>Add</button>
                        <button className='close' onClick={handleClose}>Close</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewProductPopup;