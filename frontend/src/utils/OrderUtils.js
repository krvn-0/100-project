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

export const cancelOrder = (order, userType) => {
    if (userType !== 'admin') {
        console.log('Unauthorized attempt to cancel order');
        return false;
    }
    const response = fetch(`http://localhost:3001/transactions/${order.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            status: -1
        })
    });

    alert(`Order ${order._id} has been cancelled.`);
    return true;
};
