import React, { useState, useEffect } from 'react';
import { getUsers, updateUser } from '../utils/UserUtils';

const UserPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const fetchedUsers = await getUsers(    );
        setUsers(fetchedUsers);
    };

    const handleUpdate = (id, updatedUser) => {
        updateUser(id, updatedUser).then(() => {
            fetchUsers();  // Refresh the list after the update
        }).catch(error => console.error('Failed to update user:', error));
    };

    const handleChange = (event, id) => {
        const { name, value } = event.target;
        setUsers(users.map(user => user.id === id ? { ...user, [name]: value } : user));
    };

    return (
        <div>
            <h1>User Management</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>
                                <input
                                    type="text"
                                    name="name"
                                    value={user.name}
                                    onChange={e => handleChange(e, user.id)}
                                />
                            </td>
                            <td>
                                <input
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={e => handleChange(e, user.id)}
                                />
                            </td>
                            <td>
                                <button onClick={() => handleUpdate(user.id, { name: user.name, email: user.email })}>
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserPage;
