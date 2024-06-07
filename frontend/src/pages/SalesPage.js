import React, { useState, useMemo, useEffect } from 'react';
import { sortData } from '../utils/SortingUtility';
import ViewOrder from '../popups/ViewOrder';
import './SalesPage.css';

const SalesPage = () => {
    const [orders, setOrders] = useState([]);
    const [displayOrders, setDisplayOrders] = useState(orders);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isViewing, setIsViewing] = useState(false);
    const [sortedProducts, setSortedProducts] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await fetch('http://localhost:3001/transactions', {
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
            if (order.status === 1) {
                if (!summary[order.product.name]) {
                    summary[order.product.name] = { quantity: 0, totalSales: 0, profit: 0 };
                }
                summary[order.product.name].quantity += order.quantity;
                summary[order.product.name].totalSales += order.quantity * order.price;
                summary[order.product.name].profit = summary[order.product.name].totalSales * 0.2;
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
                            <td>{product.product.name}</td>
                            <td>{product.quantity}</td>
                            <td>P{product.totalSales.toFixed(2)}</td>
                            <td>P{product.profit.toFixed(2)}</td>
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
