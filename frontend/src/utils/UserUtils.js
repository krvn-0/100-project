    // Function to fetch users
export const getUsers = async () => {


    const response = await fetch('htttp://localhost:3001/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    const data = await response.json();
    return data;
};

// Function to update a user
export const updateUser = async (id, userDetails) => {
  
    const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userDetails)
    });
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    return response.json();
};
