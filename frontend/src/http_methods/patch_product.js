function UpdateProduct(product) {
    fetch(`http://localhost:3001/products/${product.productID}`, {
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
        },
        method: "PATCH",	

        body: JSON.stringify({
            description: product.description ? product.description : description,
            quantity: product.quantity ? product.quantity : quantity,
            unitPrice: product.unitPrice? product.unitPrice : unitPrice
        })
    })
    .then(function (response) {
        // console.log(response);
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    })
};

export default UpdateProduct;