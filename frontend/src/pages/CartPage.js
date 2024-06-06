import React, { useEffect } from "react";
import './CartPage.css';

const CartPage = () => {
    const [cartDetails, setCartDetails] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    // const extractProductinCart = async (cartDetails) => {
    //     const products = await Promise.all(cartDetails.map(async (item) => {
    //         const response = await fetch(`http://localhost:3001/products/${item.productID}`);
    //         const data = await response.json();
    //         return {
    //             id: data.productID,
    //             name: data.name,
    //             type: product.type,
    //             price: data.price,
    //             qty_type: data.qty_type,
    //             quantity: item.quantity
    //         }
    //     }));
    //     setCartItems(products);
    // }


    // useEffect(() => {
    //     try {
    //         fetch(`http://localhost:3001/user/${userID}`)
    //         .then((response) => response.json())
    //         .then((data) => setCartDetails(data.cart));
    //     } catch (error) {
    //         console.error(error);
    //     }
    //     extractProductinCart(cartDetails);
    // }, [cartDetails])

    // const updateUser = async (userID, updatedCart) => {
    //     try {
    //         const response = await fetch(`http://localhost:3001/user/${userID}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({products: updatedCart})
    //         });
    //         const data = await response.json();
    //         serCartDetails(data.cart);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    const updateUserCart = (product) => {
        // const updatedCart = cartDetails.filter((item) => item.id !== product.id);
        // // updateUser(userID, updatedCart);
        // setCartDetails(updatedCart);
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
                {renderItems}
            </div>
        </div>
    )

}

export default CartPage;