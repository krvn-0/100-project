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

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        navigate('/login');
    }

    return (
        <div className='popup logout'>
            <div className='popup-inner'>
                <div className='popup-header'>
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