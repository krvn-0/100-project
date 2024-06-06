import React from 'react';
import './Popup.css';
import './ConfirmLogout.css';
import { useNavigate } from 'react-router-dom';

const ConfirmLogout = () => {
    const navigate = useNavigate();
    const returnUrl = sessionStorage.getItem('last-path') || '/user-home';

    const handleCancel = () => {
        navigate(returnUrl);
    }

    const handleLogout = async () => {
        fetch('http://localhost:3001/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('isAdmin');
        alert('Logout successful');
        navigate('/login');
    }

    return (
        <div className='popup logout'>
            <div className='popup-inner logout-inner'>
                <div className='logout-header'>
                    <h1>Confirm Logout</h1>
                </div>
                <div className='logout-body'>
                    <p>Are you sure you want to logout?</p>
                </div>
                <div className='logout-footer'>
                    <button className='cancel-btn' onClick={() => handleCancel()}>Cancel</button>
                    <button className='logout-btn' onClick={() => handleLogout()}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmLogout;