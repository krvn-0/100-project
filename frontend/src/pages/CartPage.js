import React, { useEffect, useState } from "react";
import './CartPage.css';
import CartCard from '../cards/CartCard';

const CartPage = () => {
    const [cartDetails, setCartDetails] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const userID = sessionStorage.getItem('userID');

    const extractProductinCart = async (cartDetails) => {    
        if(cartDetails.length === 0) return;
        const products = await Promise.all(cartDetails.map(async (item) => {
            const response = await fetch(`http://localhost:3001/products/${item.ID}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
            const data = await response.json();
            console.log(data)
        }));
        setCartItems(products);
    }


    useEffect( async () => {
        try {
            const response = await fetch(`http://localhost:3001/users/${userID}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            
            const data = await response.json();
            setCartDetails(data);
            
        } catch (error) {
            console.error(error);
        }
        extractProductinCart(cartDetails);
    }, [])

    const updateUser = async (userID, updatedCart) => {
        try {
            const response = await fetch(`http://localhost:3001/user/${userID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({products: updatedCart})
            });
            const data = await response.json();
            setCartDetails(data.cart);
        } catch (error) {
            console.error(error);
        }
    }

    const updateUserCart = (product) => {
        const updatedCart = cartDetails.filter((item) => item.id !== product.id);
        updateUser(userID, updatedCart);
        setCartDetails(updatedCart);
    }

    const handleRemoveClick = (product) => {
        updateUserCart(product);
    }

    const handleOrderClick = (product) => {
        updateUserCart(product);
    }

    const renderItems = cartItems.map((product) => {
        return (
            <CartCard
                key={product.id}
                product={product}
                handleRemoveClick={() => handleRemoveClick(product)}
            />
        )
    })

    return (
        <div className="cart-page">
            <h1 className="cart-header">Shopping Cart</h1>
            <div className="cart-list">
                {cartItems.length !== 0 ? 
                    renderItems
                    : 
                    <p className="empty-list">No items in cart</p>
                }
            </div>
        </div>
    )

}

export default CartPage;