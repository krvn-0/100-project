import React from 'react';

const handleAddToCart = (product, quantity) => {
    // get current user
    if(product.quantity < quantity) {
        // insert line to append product to user's cart
        alert(`${product.name} added to cart!`)
        return false;
    } else {
        alert(`Failed to add ${product.name} to cart. Not enough stock.`)
    }
}

export default handleAddToCart;