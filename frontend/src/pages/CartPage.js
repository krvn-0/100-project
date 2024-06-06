import React, { useEffect, useState } from "react";
import './CartPage.css';

import CartCard from '../cards/CartCard';
import handleRemoveFromCart from "../utils/RemoveFromCart";
import handleSubmitOrder from "../utils/CheckoutHandler";

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);

    const userID = sessionStorage.getItem('userID');

    useEffect(() => {
        const getUserData = async () => {
            const userResponse = await fetch(`http://localhost:3001/users/${userID}`, {
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

            setCartItems(userData.cart.map((item) => {
                const { product, quantity } = item;
                return {
                    ...product,
                    quantity: quantity
                };
            }));
        }

        getUserData();
    }, [userID]);


    const handleRemoveClick = async (product, e) => {
        await handleRemoveFromCart(product.id);
    }

    const handleOrderClick = async (product, e) => {
        await handleSubmitOrder(product);
    }

    const countTotalItems = () => {
        let totalItems = 0;
        cartItems.forEach((product) => {
            totalItems += product.quantity;
        });
        return totalItems;
    }

    const countTotalCost = () => {
        let totalCost = 0;
        cartItems.forEach((product) => {
            totalCost += product.quantity * product.unitPrice;
        });
        return totalCost;
    }

    const renderItems = cartItems.map((product) => {
        return (
            <CartCard
                key={product.id}
                product={product}
                handleRemoveClick={() => handleRemoveClick(product)}
                handleOrderClick={() => handleOrderClick(product)}
            />
        )
    })

    return (
        <div className="cart-page">
            <h1 className="cart-header">Shopping Cart</h1>
            <div className="cart-subheader">
                <p className="total-items">
                    Total items in cart: {countTotalItems()}
                </p>
                <p className="total-price">
                    Total Cost: {Number(countTotalCost()).toString()}
                </p>
            </div>
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