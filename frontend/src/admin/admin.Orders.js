import React from 'react';

const AdminOrders = ({ orders, setOrders }) => {
  const statusMapping = {
    "-1": "cancelled",
    "0": "pending",
    "1": "completed"
  };

  const handleStatusChange = (transactID, newStatus) => {
    setOrders(orders.map(order => 
      order.transactID === transactID ? { ...order, status: newStatus } : order
    ));
  };

  return (
    <div className="admin-orders">
      <h2>Manage Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order.transactID}>
            {order.product} - {order.quantity} - 
            Status: {statusMapping[order.status.toString()]}
            <button onClick={() => handleStatusChange(order.transactID, "1")}>Complete</button>
            <button onClick={() => handleStatusChange(order.transactID, "-1")}>Cancel</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOrders;
