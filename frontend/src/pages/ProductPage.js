import React, { useEffect, useState } from "react";
import './ProductPage.css';

import ProductCard from "../cards/ProductCard";
import ViewProductPopup from "../popups/ViewProduct";
import AddProductPopup from "../popups/AddProduct";
import EditProductPopup from "../popups/EditProduct";

import handleSubmitEditProduct from "../utils/EditProductHandler";
import handleSubmitAddProduct from "../utils/AddProductHandler";
import handleSubmitDeleteProduct from "../utils/DeleteProductHandler";
import handleSubmitAddToCart from "../utils/AddToCartHandler";
import DeleteProductPopup from "../popups/DeleteProduct";
import SortBar from "../components/SortBar";
import DropDownFilter from "../components/DropDownFilter";

const ProductPage = () => {
    const [productList, setProductList] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    
    const [isViewing, setIsViewing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [searchValue, setSearchValue] = useState('');
    const [currentFilterOption, setCurrentFilterOption] = useState('')
    const filterOptions = [
        {value: '', label: 'None'},
        {value: 'name', label: 'Name'},
        {value: 'type', label: 'Type'},
        {value: 'unitPrice', label: 'Price'},
        {value: 'quantity', label: 'Quantity'}
    ];
    const [sortOrder, setSortOrder] = useState('asc');
    
    const [currentList, setCurrentList] = useState([...productList]);

    const isAdmin = JSON.parse(sessionStorage.getItem('isAdmin')) || false;

    useEffect(() => {
        try { 
            fetch('http://localhost:3001/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            .then((response) => response.json())
            .then((data) => {
                setProductList(data);
                setCurrentList(data);
            });
        } catch (error) {
            alert(error);
            setProductList([]);
            setCurrentList([]);
            searchHandler();
        }
    }, [isAdding, isEditing, isDeleting, isViewing]);

    const openViewPopup = (product) => {
        setCurrentProduct(product);
        setIsViewing(true);
    }

    const closeViewPopup = (product) => {
        setCurrentProduct(null);
        setIsViewing(false);
    }

    const openEditPopup = (product) => {
        setCurrentProduct(product);
        setIsEditing(true);
    }

    const closeEditPopup = (product) => {
        setCurrentProduct(null);
        setIsEditing(false);
    }

    const handleEditSubmit = async (ID, desc, price, qty) => {
        const success = await handleSubmitEditProduct(ID, desc, price, qty);
        if(success) {
            setProductList((prevList) => 
                prevList.map((product) => 
                    product.id === currentProduct.id ? {...product, description: desc, unitPrice: price, quantity: qty} : product
                )
            )
        }
    }

    const openAddPopup = () => {
        setIsAdding(true);
    }

    const closeAddPopup = () => {
        setIsAdding(false);
    }

    const handleAddSubmit = async (name, description, price, quantity, type, unit, imageUrl) => {
        const data = await handleSubmitAddProduct(name, description, price, quantity, type, unit, imageUrl);
        if(data) {
            setProductList((prevList) =>
                [...prevList, {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    unitPrice: data.unitPrice,
                    quantity: data.quantity,
                    type: data.type,
                    unit: data.unit,
                    imageUrl: data.imageUrl
                }]
            )
        }
    }

    const openDeletePopup = (product) => {
        setCurrentProduct(product);
        setIsDeleting(true);
    }

    const closeDeletePopup = (product) => {
        setCurrentProduct(null);
        setIsDeleting(false);
    }

    const handleDeleteSubmit = async (ID, name) => {
        const success = await handleSubmitDeleteProduct(ID, name);
        if(success) {
            setProductList((prevList) => 
                prevList.filter((product) => product.id !== ID)
            )
        }
    }

    const handleAddToCart = async (product, quantity) => {
        await handleSubmitAddToCart(product, quantity);
    }

    const searchHandler = () => {
        if(searchValue === '') {
            setCurrentList([...productList]);
            return;
        }
        const filteredList = productList.filter((product) => {
            return product.name.toLowerCase().includes(searchValue.toLowerCase());
        });
        setCurrentList([...filteredList]);
    }

    useEffect(() => {
        handleSort(currentFilterOption);
    }, [currentFilterOption, sortOrder]);

    const handleSort = (filterVal) => {
        setCurrentFilterOption(filterVal);

        if (filterVal === '') {
            setCurrentList([...productList]);
            return;
        }

        if(sortOrder === 'desc') {
            setCurrentList([...currentList.reverse()]);
            return;
        }

        let sortedList = [];
        switch (filterVal) {
            case 'name':
                sortedList = [...currentList.sort((a, b) => a.name.localeCompare(b.name))];
                break;
            case 'type':
                sortedList = [...currentList.sort((a, b) => a.type - b.type)];
                break;
            case 'unitPrice':
                sortedList = [...currentList.sort((a, b) => a.unitPrice - b.unitPrice)];
                break;
            case 'quantity':
                sortedList = [...currentList.sort((a, b) => a.quantity - b.quantity)];
                break;
            case 'unit':
                sortedList = [...currentList.sort((a, b) => a.unit.localeCompare(b.unit))];
                break;
            default:
                break;
        }
        setCurrentList(sortedList);
    };

    const clearHandler = () => {
        setSearchValue('');
        setCurrentFilterOption('');
        setCurrentList([...productList]);
    }

    const renderItems = currentList.map((product) => {
        return  <ProductCard 
                    key={product.id}
                    product={product}
                    handleAddClick={() => handleAddToCart(product, 1)}
                    handleOnClick={() => openViewPopup(product)}
                    handleEditClick={() => openEditPopup(product)}
                    handleDeleteClick={() => openDeletePopup(product)}
                />
    })

    return (
        <div className="product-page">
            <h1>Product List</h1>
            <SortBar
                value={searchValue}
                handleSearchClick={searchHandler}
                handleOnChange={(e) => setSearchValue(e.target.value)}
                handleClearClick={clearHandler}
                children={
                    <div className="filter">
                        <DropDownFilter
                            name="food-filters"
                            options={filterOptions}
                            handleOnChange={handleSort}
                            value={currentFilterOption}
                            setSortOrder={setSortOrder}
                        />
                    </div>
                }
            />
            {isAdmin && (
                <div className="product-page-header">
                    <button className="add-product" onClick={openAddPopup}>Add</button>
                </div>
            )}
            <div className="product-list">
                {productList.length !== 0 ? renderItems : <h2>No products available</h2>}
            </div>
            {isViewing && (
                <ViewProductPopup
                    product={currentProduct}
                    handleAddClick={() => handleAddToCart(currentProduct, 1)}
                    handleClose={closeViewPopup}
                    handleDelete={() => openDeletePopup(currentProduct)}
                />
            )}
            {isEditing && (
                <EditProductPopup
                    product={currentProduct}
                    closePopup={closeEditPopup}
                    editSubmit={handleEditSubmit}
                />
            )}
            {isAdding && (
                <AddProductPopup
                    closePopup={closeAddPopup}
                    addSubmit={handleAddSubmit}
                />
            )}
            {isDeleting && (
                <DeleteProductPopup
                    closePopup={closeDeletePopup}
                    deleteSubmit={handleDeleteSubmit}
                    product={currentProduct}
                />
            )}

        </div>
    )
}

export default ProductPage;

// const initproductList = [
//     {
//         id: 1,
//         name: 'Corn',
//         description: 'High-quality, non-GMO corn ideal for a variety of uses including food, feed, and ethanol production.',
//         type: 1,
//         price: 2.5,
//         quantity: 10000,
//         qty_type: "kilo",
//         image: 'https://img.freepik.com/free-photo/corn-pod-isolated-with-corn-kernels-from-corn-field-white-wall_1150-21863.jpg?t=st=1716023495~exp=1716027095~hmac=eea2b93511f1a7e209d9bf73a7375cb98e81b8f5313c4fffb77e79975ccc4e4e&w=826'
//     },
//     {
//         id: 2,
//         name: 'Chicken',
//         description: 'Free-range, organic chickens raised with the highest standards of care and nutrition.',
//         type: 2,
//         price: 12,
//         quantity: 500,
//         qty_type: "kilo",
//         image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
//     },
//     {
//         id: 3,
//         name: 'Wheat',
//         description: 'Premium wheat grain suitable for baking and milling purposes, harvested from sustainable farms.',
//         type: 1,
//         price: 3,
//         quantity: 15000,
//         qty_type: "kilo",
//         image: 'https://img.freepik.com/free-photo/oats-peeled_1368-5469.jpg?t=st=1716023390~exp=1716026990~hmac=b7b47aa7059e9987fdee377f94cc3f2d7a66103f5586437d8e39769bdeec695e&w=826'
//     },
//     {
//         id: 4,
//         name: 'Chicken Eggs',
//         description: 'Organic, cage-free eggs produced with care for both the hens and the environment.',
//         type: 2,
//         price: 3.5,
//         quantity: 2000,
//         qty_type: "dozen",
//         image: 'https://img.freepik.com/free-photo/three-fresh-organic-raw-eggs-isolated-white-surface_114579-43677.jpg?t=st=1716023528~exp=1716027128~hmac=2544b54994caf00549e7b3a6810f5d4fc8f2b136528d19b8c5cdfe39cadc7b96&w=826'
//     },
//     {
//         id: 5,
//         name: 'Soybeans',
//         description: 'High-yield soybeans perfect for tofu, soy milk, and other soy-based products.',
//         type: 1,
//         price: 2.8,
//         quantity: 8000,
//         qty_type: "kilo",
//         image: 'https://img.freepik.com/free-photo/yellow-soy-beans_74190-7153.jpg?t=st=1716023558~exp=1716027158~hmac=58782b39a497c38107f8f9d4af2a2626c9ff6d72b9107096aeffd1fd57233969&w=360'
//     },
//     {
//         id: 6,
//         name: 'Turkey',
//         description: 'Pasture-raised turkeys known for their rich flavor and high nutritional value.',
//         type: 2,
//         price: 20,
//         quantity: 300,
//         qty_type: "kilo",
//         image: 'https://images.unsplash.com/photo-1461037506617-211749beac60?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
//     },
//     {
//         id: 7,
//         name: 'Rice',
//         description: 'Top-grade rice suitable for a variety of culinary applications, grown in optimal conditions.',
//         type: 1,
//         price: 1.5,
//         quantity: 20000,
//         qty_type: "kilo",
//         image: 'https://img.freepik.com/free-photo/sack-rice-with-rice-wooden-spoon-rice-plant_1150-34315.jpg?t=st=1716025041~exp=1716028641~hmac=b60ac8a06306195cde4fd226df7e667ca609c21cca301aad0f2b0c6803db2983&w=996'
//     },
//     {
//         id: 8,
//         name: 'Ducks',
//         description: 'Healthy, free-range ducks, ideal for meat and egg production, raised with care.',
//         type: 2,
//         price: 18,
//         quantity: 250,
//         qty_type: "kilo",
//         image: 'https://img.freepik.com/free-photo/group-ducks-looking-camera_23-2148315320.jpg?t=st=1716024066~exp=1716027666~hmac=b67d91f82564666dfe6ea5654efec92d146ff863d0fb2c457a33fd1655ff021d&w=826'
//     },
//     {
//         id: 9,
//         name: 'Barley',
//         description: 'High-quality barley grains used for brewing, animal feed, and health foods.',
//         type: 1,
//         price: 2.2,
//         quantity: 12000,
//         qty_type: "kilo",
//         image: 'https://img.freepik.com/free-photo/organic-grain-healthy-diet_1127-308.jpg?t=st=1716024269~exp=1716027869~hmac=9e7c90107c8eabadecc9334e490205cb7a765e9a1cfc9c728df8a31f2985bd0b&w=826'
//     },
//     {
//         id: 10,
//         name: 'Quail',
//         description: 'Quail raised with care, known for their tender meat and nutrient-rich eggs.',
//         type: 2,
//         price: 15,
//         quantity: 400,
//         qty_type: "kilo",
//         image: 'https://www.asian-agribiz.com/wp-content/uploads/2022/03/quails.jpg'
//     }
// ]