const handleSubmitEditProduct = async (ID, desc, price, qty) => {
    
    let body = {
        description: desc,
        unitPrice: price,
        quantity: qty,
    }

    const response = await fetch(`http://localhost:3001/products/${ID}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
    });

    if (response.ok) {
        alert('Product edited successfully');
        return true;
    } else {
        alert('Failed to edit product');
        return false;
    }
}

export default handleSubmitEditProduct;