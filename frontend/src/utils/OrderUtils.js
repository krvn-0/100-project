export const canUserModifyOrder = (userType) => {
    return userType === 'admin';  // Only 'admin' can modify orders
};

export const approveOrder = (orderId, userType) => {
    if (userType !== 'admin') {
        console.log('Unauthorized attempt to approve order');
        return false;
    }
    console.log(`Order ${orderId} has been approved.`);
    return true;
};

export const cancelOrder = (orderId, userType) => {
    if (userType !== 'admin') {
        console.log('Unauthorized attempt to cancel order');
        return false;
    }
    console.log(`Order ${orderId} has been cancelled.`);
    return true;
};
