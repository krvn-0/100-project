const handleRemoveFromCart = async (productID) => {
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

    const updatedCart = userData.cart.filter((item) => item.product.id !== productID);

    try {
        const response = await fetch(`http://localhost:3001/users/${userID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                cart: updatedCart
            })
        })

        const data = await response.json();
        const statuscode = data.status;

        if(statuscode < 200 || statuscode >= 300) {
            alert(`Error: ${data.detail}`);
        } else {
            alert(`Cart updated`);
        }
    } catch (error) {
        alert(`Failed to update cart`)
    }
}

export default handleRemoveFromCart;