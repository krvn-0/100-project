import React from 'react';
import './ViewOrder.css';

const ViewOrder = ({ orderDetails, onClose }) => {
    if (!orderDetails) return null;  // Render nothing if no order details are provided

    return (
        <div className="view-order-popup">
            <h2>Order Details</h2>
            <p><strong>Item Name:</strong> {orderDetails.itemName}</p>
            <p><strong>Order Date:</strong> {orderDetails.orderDate}</p>
            <p><strong>Quantity:</strong> {orderDetails.quantity}</p>
            <p><strong>Price:</strong> ${orderDetails.price}</p>
            <p><strong>Status:</strong> {orderDetails.status}</p>
            <p><strong>User ID:</strong> {orderDetails.userId}</p>
            <p><strong>User Type:</strong> {orderDetails.userType}</p>
            <button className="close-button" onClick={onClose}>Close</button>
        </div>
    );
};

export default ViewOrder;
