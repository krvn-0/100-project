import React, { useState } from 'react';
import ViewOrder from '../popups/ViewOrder';
import './SalesPage.css'; // Import the CSS for styling

const SalesPage = () => {
    // Example data
    const [orders, setOrders] = useState([
        { id: 1, itemName: 'Eggs', orderDate: '2023-06-01', quantity: 100, price: 10, status: 'Approved', userId: '123', userType: 'Retailer' },
        { id: 2, itemName: 'Milk', orderDate: '2023-06-02', quantity: 50, price: 20, status: 'Pending', userId: '124', userType: 'Wholesaler' },
        { id: 3, itemName: 'Bread', orderDate: '2023-06-03', quantity: 80, price: 5, status: 'Cancelled', userId: '125', userType: 'Distributor' },
        // Add more orders here
    ]);

    const [currentOrder, setCurrentOrder] = useState(null);
    const [isViewing, setIsViewing] = useState(false);

    const totalRevenue = orders.reduce((acc, order) => acc + (order.price * order.quantity), 0);
    const totalProfit = orders.reduce((acc, order) => acc + (order.price * order.quantity * 0.2), 0);
    const orderCounts = {
        approved: orders.filter(order => order.status === 'Approved').length,
        pending: orders.filter(order => order.status === 'Pending').length,
        cancelled: orders.filter(order => order.status === 'Cancelled').length
    };

    const sortOrders = (timeframe) => {
        const sortedOrders = [...orders];
        sortedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
    };

    const openViewPopup = (order) => {
        setCurrentOrder(order);
        setIsViewing(true);
    };

    const closeViewPopup = () => {
        setCurrentOrder(null);
        setIsViewing(false);
    };

    return (
        <div className="sales-dashboard">
            <h1>Sales Dashboard</h1>
            <p>Total Revenue generated: ${totalRevenue}</p>
            <p>Total Profit: ${totalProfit}</p>
            <p>Number of approved orders: {orderCounts.approved}</p>
            <p>Number of pending orders: {orderCounts.pending}</p>
            <p>Number of cancelled orders: {orderCounts.cancelled}</p>

            <select onChange={(e) => sortOrders(e.target.value)}>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
            </select>
            <button onClick={() => sortOrders('topSelling')}>Top Selling Items</button>

            <table className="sales-table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Order Date</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} onClick={() => openViewPopup(order)}>
                            <td>{order.itemName}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.quantity}</td>
                            <td>${order.price}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isViewing && <ViewOrder orderDetails={currentOrder} onClose={closeViewPopup} />}
        </div>
    );
};

export default SalesPage;
