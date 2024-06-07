import React, { useState, useMemo, useEffect } from 'react';
import { sortData } from '../utils/SortingUtility';
import ViewOrder from '../popups/ViewOrder';
import './SalesPage.css';

const SalesPage = () => {
    const [orders, setOrders] = useState([]);
    const [displayOrders, setDisplayOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isViewing, setIsViewing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:3001/transactions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const fetchedOrders = await response.json();
                setOrders(fetchedOrders);
                setDisplayOrders(fetchedOrders); // Set initial display orders
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError(error.message);
            }
        };

        fetchOrders();
    }, []);

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
        const summary = {};

        orders.forEach(order => {
            if (order.status === 1) { // Assuming status 1 means 'Approved'
                const productName = order.product.name;

                if (!summary[productName]) {
                    summary[productName] = { quantity: 0, totalSales: 0, profit: 0 };
                }

                summary[productName].quantity += order.quantity;
                summary[productName].totalSales += order.quantity * order.price;
                summary[productName].profit = summary[productName].totalSales * 0.2; // Assuming profit is 20% of total sales
            }
        });

        return Object.keys(summary).map(productName => ({
            productName,
            ...summary[productName]
        }));
    }, [orders]);

    const countOrders = (status) => {
        return orders.filter(order => order.status === status).length;
    }

    return (
        <div className="sales-dashboard">
            <h1>Sales Dashboard</h1>
            {error && <p className="error-message">Error: {error}</p>}
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
                    {productSummary.map(product => (
                        <tr key={product.productName}>
                            <td>{product.productName}</td>
                            <td>{product.quantity}</td>
                            <td>P{product.totalSales.toFixed(2)}</td>
                            <td>P{product.profit.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>All Transactions</h2>
            <div className='order-metrics'>
                <p>Total Orders: {orders.length}</p>
                <p>Total Cancelled Order: {countOrders(-1)}</p>
                <p>Total Approved Orders: {countOrders(1)}</p>
                <p>Total Pending Orders: {countOrders(0)}</p>
                <p>Total Sales: P{orders.reduce((total, order) => total + order.price, 0).toFixed(2)}</p>
            </div>
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
                            <td>{order.product.name}</td>
                            <td>{order.timestamp}</td>
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
