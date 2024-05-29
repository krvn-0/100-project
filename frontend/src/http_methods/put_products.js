function PutProduct(url, object) {
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
          name: object.productID,
          description: object.description,
          type: object.type,
          quantity: object.quantity,
          unitPrice: object.unitPrice,
          productUnit: object.productUnit
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
    })
    .then(function (response) {
        console.log(response);
    })
    .catch (function (error) {
        console.log(error);
    })
}

export default PutProduct;