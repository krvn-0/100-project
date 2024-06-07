import React, { useEffect, useState } from 'react';
import './UserPage.css';  // Make sure the CSS file path is correct

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const isAdmin = JSON.parse(sessionStorage.getItem('isAdmin')) || false;
    
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('http://localhost:3001/users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const users = await response.json();
            setUsers(users);
        }
        fetchUsers();
    }, []);

    return (
        <div className="user-management">
            <h1>User Management</h1>
            <p>Number of users: {users.length}</p>

            {users.map((user) => (
                <div key={user.id} className={`user-item ${user.isMerchant ? 'admin' : ''}`}>
                    <p>{user.email}</p>
                    <p>Name: {user.firstName} {user.middleName ? user.middleName : ''} {user.lastName}</p>
                    <p>User Type: {user.isMerchant ? 'Admin' : 'User'}</p>
                </div>
            ))}
        </div>
    );
};

export default UserPage;
