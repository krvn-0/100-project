import React, { useEffect, useState } from 'react';
import './UserHomePage.css';
const UserHome = () => {
    const userID = sessionStorage.getItem('userID');
    const [userData, setUserData] = useState('');
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`http://localhost:3001/users/${userID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const data = await response.json();
            setUserData(data);
        }
        fetchUser();
    }, []);

    console.log(userData);
    
    return (
        <div className='user-home'>
            <h1 className='home-title'>Hello {userData.firstName} {userData.lastName}!</h1>
            <div className='home-body'>
                <p className='home-description'>This is Farm-To-Table, a web app developed by 4 CMSC 100-UV2L students</p>
            </div>
        </div>
    );
}

export default UserHome;