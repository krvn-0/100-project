import React, { useEffect, useState } from 'react';
import { getUsers, updateUser } from '../utils/UserUtils'; // Ensure the path to UserUtils is correct
import './UserPage.css';  // Make sure the CSS file path is correct

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const isAdmin = JSON.parse(sessionStorage.getItem('isAdmin')) || false;
    
    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleUpdateUser = async (id, field, value) => {
        try {
            const updatedDetails = { [field]: value };
            const updatedUser = await updateUser(id, updatedDetails);
            const updatedUsers = users.map(user => user.id === id ? { ...user, ...updatedUser } : user);
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div className="user-management">
            <h1>User Management</h1>
            {users.map((user) => (
                <div key={user.id} className="user-item">
                    {isAdmin ? (
                        <>
                            <input 
                                type="text"
                                defaultValue={user.name}
                                onBlur={(e) => handleUpdateUser(user.id, 'name', e.target.value)}
                                className="user-update-input"
                            />
                            <input 
                                type="email"
                                defaultValue={user.email}
                                onBlur={(e) => handleUpdateUser(user.id, 'email', e.target.value)}
                                className="user-update-input"
                            />
                        </>
                    ) : (
                        <>
                            <p>{user.name} - {user.role}</p>
                            <p>Email: {user.email}</p>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UserPage;
