export const canUserModifyOrder = (userType) => {
    return userType === 'admin';  // Only 'admin' can modify orders
};

export const approveOrder = (order, userType) => {
    if (userType !== 'admin') {
        console.log('Unauthorized attempt to approve order');
        return false;
    }
    const response = fetch(`http://localhost:3001/transactions/${order.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            status: 1
        })
    });

    alert(`Order ${order._id} has been approved.`);
    return true;
};

export const cancelOrder = async (order, userType) => {
    let productQuantity = 0;

    try {
        const response = await fetch(`http://localhost:3001/products/${order.product.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })

        const data = await response.json();
        productQuantity = data.quantity;
        console.log(`Product quantity retrieved: ${productQuantity}`);
    }  catch (error) {
        console.log(`Failed to retrieve product`)
    }

    
    try {
        // First update the transaction status
        const transactionResponse = await fetch(`http://localhost:3001/transactions/${order.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                status: -1
            })
        });

        // Check if the transaction update was successful
        if (!transactionResponse.ok) {
            const transactionErrorData = await transactionResponse.json();
            throw new Error(`Transaction update failed: ${transactionErrorData.detail}`);
        }

        // Update the product quantity
        const productResponse = await fetch(`http://localhost:3001/products/${order.product.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                quantity: productQuantity + order.quantity
            })
        });

        // Handle the product response
        if (!productResponse.ok) {
            const productErrorData = await productResponse.json();
            throw new Error(`Product update failed: ${productErrorData.detail}`);
        }

        const productData = await productResponse.json();
        console.log(productData);

        console.log('Product quantity updated');
    } catch (error) {
        console.error('Failed to update product quantity:', error);
        alert(`Error: ${error.message}`);
    }
    alert(`Order ${order._id} has been cancelled.`);
    return true;
};
