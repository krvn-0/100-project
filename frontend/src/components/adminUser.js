import React from 'react';

const AdminUser = ({ users }) => {
  return (
    <div className="admin-users">
      <h2>Manage Users</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminUser;
