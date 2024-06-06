    // Function to fetch users
export const getUsers = async () => {


    const response = await fetch('/api/users');
    const data = await response.json();
    return data;
};

// Function to update a user
export const updateUser = async (id, userDetails) => {
  
    const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails)
    });
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    return response.json();
};
