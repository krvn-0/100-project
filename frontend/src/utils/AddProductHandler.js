const handleSubmitAddProduct = async (name, description, price, quantity, type, unit, imageUrl) => {
    let body = {
        name: name,
        unitPrice: price,
        quantity: quantity,
        type: type,
        productUnit: unit,
        imageUrl: imageUrl,
    }

    if(description) {
        body.description = description;
    }

    try { 
        const response = await fetch(`http://localhost:3001/products`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
        })

        if (!response.ok) {
            alert('Failed to add product');
            return null;
        }
        const data = response.json();
        alert('Product added successfully');
        return data;
    } catch (error) {
        alert(`Error: ${error}`)
    }
}

export default handleSubmitAddProduct;