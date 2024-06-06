import React, { useState, useMemo } from 'react';
import { sortData } from '../utils/SortingUtility';
import ViewOrder from '../popups/ViewOrder';
import './SalesPage.css';

const SalesPage = () => {
    const [orders, setOrders] = useState([
        { id: 1, itemName: 'Eggs', orderDate: '2023-06-01', quantity: 100, price: 10, status: 'Approved' },
        { id: 2, itemName: 'Milk', orderDate: '2023-06-02', quantity: 50, price: 20, status: 'Pending' },
        { id: 3, itemName: 'Bread', orderDate: '2023-06-03', quantity: 80, price: 5, status: 'Cancelled' },
        { id: 4, itemName: 'Eggs', orderDate: '2023-06-15', quantity: 150, price: 10, status: 'Approved' },
    ]);
    const [displayOrders, setDisplayOrders] = useState(orders);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isViewing, setIsViewing] = useState(false);

    const handleSort = (criterion) => {
        const sortedOrders = sortData(orders, criterion);
        setDisplayOrders(sortedOrders);
    };

    const openViewPopup = (order) => {
        setCurrentOrder(order);
        setIsViewing(true);
    };

    const closeViewPopup = () => {
        setCurrentOrder(null);
        setIsViewing(false);
    };

    const productSummary = useMemo(() => {
        let summary = {};
        orders.forEach(order => {
            if (order.status === 'Approved') {
                if (!summary[order.itemName]) {
                    summary[order.itemName] = { quantity: 0, totalSales: 0, profit: 0 };
                }
                summary[order.itemName].quantity += order.quantity;
                summary[order.itemName].totalSales += order.quantity * order.price;
                summary[order.itemName].profit = summary[order.itemName].totalSales * 0.2;
            }
        });
        return Object.values(summary);
    }, [orders]);

    return (
        <div className="sales-dashboard">
            <h1>Sales Dashboard</h1>
            <button onClick={() => handleSort('weekly')}>Sort Weekly</button>
            <button onClick={() => handleSort('monthly')}>Sort Monthly</button>
            <button onClick={() => handleSort('annually')}>Sort Annually</button>
            <button onClick={() => handleSort('profit')}>Top 3 Highest Profits</button>

            <h2>Product Sales Summary</h2>
            <table className="sales-table">
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity Sold</th>
                        <th>Total Sales</th>
                        <th>Profit</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Conditionally render sortedProducts if it has items, otherwise render all products */}
                    {(sortedProducts.length > 0 ? sortedProducts : productSummary).map(product => (
                        <tr key={product.id}>
                    {productSummary.map(product => (
                        <tr key={product.itemName}>
                            <td>{product.itemName}</td>
                            <td>{product.quantity}</td>
                            <td>${product.totalSales.toFixed(2)}</td>
                            <td>${product.profit.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>All Transactions</h2>
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
                    {displayOrders.map(order => (
                        <tr key={order.id} onClick={() => openViewPopup(order)}>
                            <td>{order.itemName}</td>
                            <td>{order.orderDate}</td>
                            <td>{order.quantity}</td>
                            <td>P{order.price}</td>
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
