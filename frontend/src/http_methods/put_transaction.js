function PutTransact(url, object) {
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
          product: object.productID,
          quantity: object.quantity
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
    });
};

export default PutTransact;