import React, { useState } from 'react';

const AdminProduct = ({ products, setProducts }) => {
  const [newProduct, setNewProduct] = useState({
    id: null, // to distinguish between adding and updating
    name: '',
    price: 0,
    description: '',
    type: '', // assuming 'type' is a string; adjust if it's a numerical ID or another data type
    quantity: 0
  });

  const handleAddOrUpdateProduct = () => {
    if (newProduct.id === null) {
      // Add new product
      setProducts(prevProducts => [...prevProducts, { ...newProduct, id: prevProducts.length + 1 }]);
    } else {
      // Update existing product
      setProducts(prevProducts => prevProducts.map(product => 
        product.id === newProduct.id ? {...newProduct} : product
      ));
    }
    setNewProduct({ id: null, name: '', price: 0, description: '', type: '', quantity: 0 }); // Reset the form
  };

  const handleEditProduct = (product) => {
    setNewProduct(product);
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
            <h3>{product.name} - ${product.price}</h3>
            <button onClick={() => handleEditProduct(product)}>Edit</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="add-product">
        <h3>{newProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
        <input type="text" placeholder="Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
        <input type="number" placeholder="Price" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })} />
        <input type="text" placeholder="Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
        <input type="text" placeholder="Type" value={newProduct.type} onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })} />
        <input type="number" placeholder="Quantity" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value, 10) })} />
        <button onClick={handleAddOrUpdateProduct}>{newProduct.id ? 'Update Product' : 'Add Product'}</button>
      </div>
    </div>
  );
};

export default AdminProduct;
