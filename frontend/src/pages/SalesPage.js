import React, { useState, useMemo } from 'react';
import ViewOrder from '../popups/ViewOrder';
import './SalesPage.css';

const SalesPage = () => {
    // Example data
    const [orders, setOrders] = useState([
        { id: 1, itemName: 'Eggs', orderDate: '2023-06-01', quantity: 100, price: 10, status: 'Approved' },
        { id: 2, itemName: 'Milk', orderDate: '2023-06-02', quantity: 50, price: 20, status: 'Pending' },
        { id: 3, itemName: 'Bread', orderDate: '2023-06-03', quantity: 80, price: 5, status: 'Cancelled' },
        { id: 4, itemName: 'Eggs', orderDate: '2023-06-15', quantity: 150, price: 10, status: 'Approved' },
    ]);

    const [currentOrder, setCurrentOrder] = useState(null);
    const [isViewing, setIsViewing] = useState(false);

    const getDateFilter = (period) => {
        const now = new Date();
        const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
        const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
        const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));

        switch (period) {
            case 'weekly':
                return oneWeekAgo;
            case 'monthly':
                return oneMonthAgo;
            case 'annually':
                return oneYearAgo;
            default:
                return new Date();
        }
    };

    const sortOrders = (timeframe) => {
        const dateLimit = getDateFilter(timeframe);
        const filteredOrders = orders.filter(order => new Date(order.orderDate) >= dateLimit);
        setOrders([...filteredOrders]);
    };

    const sortProductsByProfit = () => {
        const productsWithProfit = productSummary.map(product => ({
            ...product,
            profit: product.quantity * product.price * 0.2 // Assuming 20% is the profit margin
        }));

        productsWithProfit.sort((a, b) => b.profit - a.profit);
        setProductSummary(productsWithProfit.slice(0, 3)); // Get top 3 highest profits
    };

    const productSummary = useMemo(() => {
        const summary = {};
        orders.forEach(order => {
            if (order.status === 'Approved') {
                if (!summary[order.itemName]) {
                    summary[order.itemName] = { quantity: 0, totalSales: 0, profit: 0 };
                }
                summary[order.itemName].quantity += order.quantity;
                summary[order.itemName].totalSales += order.quantity * order.price;
            }
        });
        return Object.values(summary).map(item => ({
            itemName: item.itemName,
            quantity: item.quantity,
            totalSales: item.totalSales,
            profit: item.totalSales * 0.2 // Assuming 20% profit margin
        }));
    }, [orders]);

    return (
        <div className="sales-dashboard">
            <h1>Sales Dashboard</h1>
            <button onClick={() => sortOrders('weekly')}>Sort Weekly</button>
            <button onClick={() => sortOrders('monthly')}>Sort Monthly</button>
            <button onClick={() => sortOrders('annually')}>Sort Annually</button>
            <button onClick={sortProductsByProfit}>Top 3 Highest Profits</button>

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
