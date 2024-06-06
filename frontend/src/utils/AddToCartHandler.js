import getUser from './GetUserDetails';

const handleAddToCart = async (product, quantity) => {
    const userData = await getUser();
    const id = userData.id;

    if(product.quantity >= quantity) {

        let cart = [...userData.cart];
        const existingProductIndex = cart.findIndex(item => item.product.id === product.id);
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += quantity;
        } else {
            cart.push({
                "product": product,
                "quantity": quantity
            });
        }
    
        try {
            const response = await fetch(`http://localhost:3001/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    cart: cart
                })
            })

            const data = await response.json();
            console.log(data);
            const statuscode = data.status;

            if(statuscode < 200 || statuscode >= 300) {
                alert(`Error: ${data.detail}`);
            } else {
                alert(`${product.name} added to cart`);
            }
        } catch (error) {
            alert(`Failed to add ${product.name} to cart. Not enough stock.`)
        }
    }
}

export default handleAddToCart;