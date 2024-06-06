const getUser = async () => {
    const userID = sessionStorage.getItem('userID');
    const userResponse = await fetch(`http://localhost:3001/users/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    const userData = await userResponse.json();
    
    if(!userData) {
        alert('Failed to retrieve user data');
        return;
    }

    return userData;
}

export default getUser;