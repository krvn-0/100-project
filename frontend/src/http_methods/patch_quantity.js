function UpdateQuantity(url, item, updateType) {

    updateValue = item.quantity;    // cancelled order: return product stock

    if(updateType === "checkout") {
        updateValue = - item.quantity; // consume stocks
    }

    fetch(url, {
        headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
        },
        method: "PATCH",	

        body: JSON.stringify({
            quantity: quantity + updateValue
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

export default UpdateQuantity;