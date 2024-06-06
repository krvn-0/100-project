import React from 'react';
import './Popup.css';
import './DeleteProduct.css';

const DeleteProductPopup = ({ closePopup, deleteSubmit, product }) => {

    const handleDelete = (e) => {
        e.preventDefault();
        deleteSubmit(product.id, product.name);
        closePopup();
    }

    return (
        <div className='popup delete-product'>
            <div className='popup-inner delete-product'>
                <div className='delete-header'>
                    <h1>Confirm Deletion</h1>
                </div>
                <div className='delete-body'>
                    <p>Are you sure you want to delete {product.name}?</p>
                </div>
                <div className='delete-footer'>
                    <button className='cancel-btn' onClick={closePopup}>Cancel</button>
                    <button className='delete-btn' onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteProductPopup;
