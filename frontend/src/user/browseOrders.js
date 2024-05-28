import React from 'react';

const BrowseOrders = ({ orders }) => {
  return (
    <div className="browse-orders">
      <h2>Browse Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order.transactID}>
            {order.product} - {order.quantity} - Status: {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrowseOrders;
