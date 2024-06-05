import React, { useEffect, useState } from "react";
import handleAddToCart from "../utils/AddToCartHandler";

import ProductCard from "../cards/ProductCard";
import ViewProductPopup from "../popups/ViewProduct";

import './ProductPage.css';

const ProductPage = () => {
    const [productList, setProductList] = useState(initproductList);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isViewing, setIsViewing] = useState(false);

    // useEffect(() => {
    //     fetch('http://localhost:3001/products')
    //         .then((response) => response.json())
    //         .then((data) => setProductList(data));
    // }, []);

    const addToCart = async (product, quantity) => {
        await handleAddToCart(product, quantity);
    }

    const openViewPopup = (product) => {
        setCurrentProduct(product);
        setIsViewing(true);
    }

    const closeViewPopup = (product) => {
        setCurrentProduct(null);
        setIsViewing(false);
    }

    const renderItems = productList.map((product) => {
        return  <ProductCard 
                    key={product.id}
                    product={product}
                    handleAddClick={() => handleAddToCart(product)}
                    handleOnClick={() => openViewPopup(product)}
                />
    })

    return (
        <div className="product-page">
            <h1>Product List</h1>
            <div className="product-list">
                {renderItems}
            </div>
            {isViewing && (
                <ViewProductPopup
                    product={currentProduct}
                    handleAddClick={addToCart}
                    handleClose={closeViewPopup}
                />
            )}
        </div>
    )
}

export default ProductPage;

const initproductList = [
    {
        id: 1,
        name: 'Corn',
        description: 'High-quality, non-GMO corn ideal for a variety of uses including food, feed, and ethanol production.',
        type: 1,
        price: 2.5,
        quantity: 10000,
        qty_type: "kilo",
        image: 'https://img.freepik.com/free-photo/corn-pod-isolated-with-corn-kernels-from-corn-field-white-wall_1150-21863.jpg?t=st=1716023495~exp=1716027095~hmac=eea2b93511f1a7e209d9bf73a7375cb98e81b8f5313c4fffb77e79975ccc4e4e&w=826'
    },
    {
        id: 2,
        name: 'Chicken',
        description: 'Free-range, organic chickens raised with the highest standards of care and nutrition.',
        type: 2,
        price: 12,
        quantity: 500,
        qty_type: "kilo",
        image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 3,
        name: 'Wheat',
        description: 'Premium wheat grain suitable for baking and milling purposes, harvested from sustainable farms.',
        type: 1,
        price: 3,
        quantity: 15000,
        qty_type: "kilo",
        image: 'https://img.freepik.com/free-photo/oats-peeled_1368-5469.jpg?t=st=1716023390~exp=1716026990~hmac=b7b47aa7059e9987fdee377f94cc3f2d7a66103f5586437d8e39769bdeec695e&w=826'
    },
    {
        id: 4,
        name: 'Chicken Eggs',
        description: 'Organic, cage-free eggs produced with care for both the hens and the environment.',
        type: 2,
        price: 3.5,
        quantity: 2000,
        qty_type: "dozen",
        image: 'https://img.freepik.com/free-photo/three-fresh-organic-raw-eggs-isolated-white-surface_114579-43677.jpg?t=st=1716023528~exp=1716027128~hmac=2544b54994caf00549e7b3a6810f5d4fc8f2b136528d19b8c5cdfe39cadc7b96&w=826'
    },
    {
        id: 5,
        name: 'Soybeans',
        description: 'High-yield soybeans perfect for tofu, soy milk, and other soy-based products.',
        type: 1,
        price: 2.8,
        quantity: 8000,
        qty_type: "kilo",
        image: 'https://img.freepik.com/free-photo/yellow-soy-beans_74190-7153.jpg?t=st=1716023558~exp=1716027158~hmac=58782b39a497c38107f8f9d4af2a2626c9ff6d72b9107096aeffd1fd57233969&w=360'
    },
    {
        id: 6,
        name: 'Turkey',
        description: 'Pasture-raised turkeys known for their rich flavor and high nutritional value.',
        type: 2,
        price: 20,
        quantity: 300,
        qty_type: "kilo",
        image: 'https://images.unsplash.com/photo-1461037506617-211749beac60?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    },
    {
        id: 7,
        name: 'Rice',
        description: 'Top-grade rice suitable for a variety of culinary applications, grown in optimal conditions.',
        type: 1,
        price: 1.5,
        quantity: 20000,
        qty_type: "kilo",
        image: 'https://img.freepik.com/free-photo/sack-rice-with-rice-wooden-spoon-rice-plant_1150-34315.jpg?t=st=1716025041~exp=1716028641~hmac=b60ac8a06306195cde4fd226df7e667ca609c21cca301aad0f2b0c6803db2983&w=996'
    },
    {
        id: 8,
        name: 'Ducks',
        description: 'Healthy, free-range ducks, ideal for meat and egg production, raised with care.',
        type: 2,
        price: 18,
        quantity: 250,
        qty_type: "kilo",
        image: 'https://img.freepik.com/free-photo/group-ducks-looking-camera_23-2148315320.jpg?t=st=1716024066~exp=1716027666~hmac=b67d91f82564666dfe6ea5654efec92d146ff863d0fb2c457a33fd1655ff021d&w=826'
    },
    {
        id: 9,
        name: 'Barley',
        description: 'High-quality barley grains used for brewing, animal feed, and health foods.',
        type: 1,
        price: 2.2,
        quantity: 12000,
        qty_type: "kilo",
        image: 'https://img.freepik.com/free-photo/organic-grain-healthy-diet_1127-308.jpg?t=st=1716024269~exp=1716027869~hmac=9e7c90107c8eabadecc9334e490205cb7a765e9a1cfc9c728df8a31f2985bd0b&w=826'
    },
    {
        id: 10,
        name: 'Quail',
        description: 'Quail raised with care, known for their tender meat and nutrient-rich eggs.',
        type: 2,
        price: 15,
        quantity: 400,
        qty_type: "kilo",
        image: 'https://www.asian-agribiz.com/wp-content/uploads/2022/03/quails.jpg'
    }
]