import React, { useState } from 'react';
import AdminUser from './adminUser';
import AdminProduct from './adminProduct';
import BrowseOrders from '../user/browseOrders';

const Admin = ({ users, products, setProducts, orders }) => {
  const [selectedAdminOption, setSelectedAdminOption] = useState(null);

  return (
    <div className="admin-dashboard">
      <h1>Welcome to the Admin Dashboard</h1>
      <div className="admin-options">
        <button onClick={() => setSelectedAdminOption('users')}>Manage Users</button>
        <button onClick={() => setSelectedAdminOption('products')}>Manage Products</button>
        <button onClick={() => setSelectedAdminOption('orders')}>Browse Orders</button>
      </div>
      {selectedAdminOption === 'users' && <AdminUser users={users} />}
      {selectedAdminOption === 'products' && <AdminProduct products={products} setProducts={setProducts} />}
      {selectedAdminOption === 'orders' && <BrowseOrders orders={orders} />}
    </div>
  );
};

export default Admin;
