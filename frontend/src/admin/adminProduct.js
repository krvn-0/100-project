import React, { useState } from 'react';

const AdminProduct = ({ products, setProducts }) => {
  const [newProduct, setNewProduct] = useState({ name: '', description: '', type: 1, quantity: 0, image: '' });

  const handleAddProduct = () => {
    setProducts(prevProducts => [...prevProducts, { ...newProduct, id: prevProducts.length + 1 }]);
    setNewProduct({ name: '', description: '', type: 1, quantity: 0, image: '' });
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
  };

  return (
    <div className="admin-products">
      <h2>Manage Products</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="add-product">
        <h3>Add New Product</h3>
        <input type="text" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
        <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
        <input type="number" placeholder="Quantity" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })} />
        <input type="text" placeholder="Image URL" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
        <button onClick={handleAddProduct}>Add Product</button>
      </div>
    </div>
  );
};

export default AdminProduct;
