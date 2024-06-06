import React, { useState } from 'react';
import { approveOrder, cancelOrder, canUserModifyOrder } from '../utils/OrderUtils';
import './OrderPage.css';

const OrderPage = ({ userType }) => {
    const [orders, setOrders] = useState([
        { id: 1, itemName: 'Eggs', orderDate: new Date('2023-06-01'), quantity: 100, price: 10, status: 'Pending' },
        { id: 2, itemName: 'Milk', orderDate: new Date('2023-06-02'), quantity: 50, price: 20, status: 'Pending' },
        { id: 3, itemName: 'Bread', orderDate: new Date('2023-06-03'), quantity: 80, price: 5, status: 'Cancelled' },
    ]);

    const handleApprove = (id) => {
        if (approveOrder(id, userType)) {
            setOrders(orders.map(order => order.id === id ? { ...order, status: 'Approved' } : order));
        }
    };

    const handleCancel = (id) => {
        if (cancelOrder(id, userType)) {
            setOrders(orders.map(order => order.id === id ? { ...order, status: 'Cancelled' } : order));
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
            <button onClick={sortOrdersByDate}>Sort by Date</button>
            {orders.map((order) => (
                <div key={order.id} className="order-item">
                    <p>{order.itemName} - {order.quantity} units at ${order.price} each. Total: ${order.quantity * order.price}</p>
                    <p>Order Date: {formatDate(order.orderDate)}</p>
                    <p>Status: {order.status}</p>
                    {canUserModifyOrder(userType) && (
                        <>
                            <button className="approve" onClick={() => handleApprove(order.id)}>Approve</button>
                            <button className="cancel" onClick={() => handleCancel(order.id)}>Cancel</button>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default OrderPage;
