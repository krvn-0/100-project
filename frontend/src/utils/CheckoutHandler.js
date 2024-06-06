import getUser from './GetUserDetails';

const handleSubmitOrder  = async (product) => {

    const userData = await getUser();
    const userID = userData.id;

    const body = {
        productId: product.id,
        quantity: product.quantity,
        userId: userID,
        price: product.unitPrice
    }

    try {
        const response = await fetch(`http://localhost:3001/transactions`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            alert('Failed to add product');
            return null;
        }

        const data = response.json();

        alert('Item ordered successfully');
        return data;

    } catch (error) {
        alert(`Error: ${error}`)
    }

    const updatedCart = userData.cart.filter((item) => item.product.id !== product.id);

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

export default handleSubmitOrder;