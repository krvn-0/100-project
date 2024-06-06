import React from 'react';

const handleAddToCart = async (product, quantity) => {
    const id = sessionStorage.getItem('userID');

    const userResponse = await fetch(`http://localhost:3001/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const userData = await userResponse.json();
    
    if(!userData) {
        alert('Failed to retrieve user data');
        return;
    }

    if(product.quantity >= quantity) {
        let cart = [...userData.cart];
        const existingItemIndex = cart.findIndex(item => item.product.id === product.id);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ product, quantity });
        }
        try {
            const response = await fetch(`http://localhost:3001/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    cart: cart
                })
            })

            const data = await response.json();
            const statuscode = data.status;

            if(statuscode < 200 || statuscode >= 300) {
                alert(`Error: ${data.detail}`);
            } else {
                alert(`${product.name} added to cart`);
            }
        } catch (error) {
            alert(`Failed to add ${product.name} to cart. Not enough stock.`)
        }
    }
}

export default handleAddToCart;