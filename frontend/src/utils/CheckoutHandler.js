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
            console.log(`Cart updated`);
        }
    } catch (error) {
        console.log(`Failed to update cart`)
    }

    let productQuantity = 0;

    try {
        const response = await fetch(`http://localhost:3001/products/${product.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })

        const data = await response.json();
        productQuantity = data.quantity;


    }  catch (error) {
        console.log(`Failed to retrieve product`)
    }

    try {
        const response = await fetch(`http://localhost:3001/products/${product.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                quantity: productQuantity - product.quantity
            })
        })

        const data = await response.json();
        const statuscode = data.status;

        if(statuscode < 200 || statuscode >= 300) {
            alert(`Error: ${data.detail}`);
        } else {
            console.log(`Product quantity updated`);
        }
    } catch (error) {
        console.log(`Failed to update product quantity`)
    }
}

export default handleSubmitOrder;