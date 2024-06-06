import React from "react";

import './ProductCard.css';

const ProductCard = ({ product, handleAddClick, handleOnClick, handleEditClick, handleDeleteClick }) => {
    const isAdmin = JSON.parse(sessionStorage.getItem('isAdmin')) || false;

    return (
        <div className={`product-card ${product.type === 1 ? 'crops' : 'poultry' }`} 
            onClick={handleOnClick}
        >
            <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
            </div>
            <div className="product-info">
                <h2 className="product-name">
                    {product.name}
                </h2>
                <p className="product-price">
                    P{product.unitPrice} per {product.unit}
                </p>
                <p className="product-stock">
                    {product.quantity} {product.quantity > 1 ? `${product.unit}s` : `${product.unit}`}
                </p>
                <div className="button-placeholder" />
            </div>
            {isAdmin ? 
                <div className="button-holder">
                    <button className='view' onClick={(e) => {e.stopPropagation(); handleOnClick(product)}}>View</button>
                    <button className='edit' onClick={(e) => {e.stopPropagation(); handleEditClick(product)}}>Edit</button>
                    <button className='delete' onClick={(e) => {e.stopPropagation(); handleDeleteClick(product)}}>Delete</button>
                </div>
                :
                <div className="button-holder">
                    <button className='add-to-cart' onClick={(e) => {e.stopPropagation();handleAddClick(product, 1)}}>
                        Add
                    </button>
                    <button className='view' onClick={(e) => {e.stopPropagation(); handleOnClick(product)}}>View</button>
                </div>
            } 
        </div>
    )
}

export default ProductCard;