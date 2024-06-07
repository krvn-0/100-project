import React, { useEffect, useState } from 'react';
import { approveOrder, cancelOrder, canUserModifyOrder } from '../utils/OrderUtils';
import './OrderPage.css';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const isAdmin = JSON.parse(sessionStorage.getItem('isAdmin')) || false;
    const userType = isAdmin ? 'admin' : 'buyer';
    const userID = sessionStorage.getItem('userID');
    
    const fetchUrl = isAdmin  ? `http://localhost:3001/transactions` : `http://localhost:3001/transactions?buyerID=${userID}`;

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const orders = await response.json();
            setOrders(orders);
        };
        fetchOrders();
    }, []);

    const handleApprove = (currentItem) => {
        console.log(currentItem)
        if (approveOrder(currentItem, userType)) {
            setOrders(orders.map(order => order.id === currentItem.id ? { ...order, status: 1 } : order));
        }
    };

    const handleCancel = (currentItem) => {
        if (cancelOrder(currentItem, userType)) {
            setOrders(orders.map(order => order.id === currentItem.id  ? { ...order, status: -1 } : order));
        }
    };

    // Function to format date
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US');
    };

    // Function to sort orders by date
    const sortOrdersByDate = () => {
        const sortedOrders = [...orders].sort((a, b) => a.orderDate - b.orderDate);
        setOrders(sortedOrders);
    };

    return (
        <div className="order-management">
            <h1>Order Management</h1>
            <button onClick={sortOrdersByDate} className='sort-btn'>Sort by Date</button>
            {orders.map((order) => (
                <div key={order.id} className="order-item">
                    <p>{order.product.name} - {order.quantity} units at P{order.price} each. Total: P{order.quantity * order.price}</p>
                    <p>Order Date: {formatDate(new Date((order.timestamp)))}</p>
                    <p>Status: {order.status}</p>
                    {order.status === 0 && (
                        <>
                            {canUserModifyOrder(userType) && (
                                <button className="approve" onClick={() => handleApprove(order)}>Approve</button>
                            )}
                            <button className="cancel" onClick={() => handleCancel(order)}>Cancel</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default OrderPage;
