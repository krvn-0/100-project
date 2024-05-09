export default function ItemList(props) {
    const items = props.list;   // extracts the items array

    const handleAddToCart = (item) => {
        let temp_cart = [...props.cart]; // stores previous state of the cart
        const itemIndex = temp_cart.findIndex((cart_item) => cart_item.id === item.id); // locates the item in the cart, if present
    
        if(itemIndex !== -1) {  // item is already in the cart
            temp_cart[itemIndex].quantity += 1;
        } else {
            // construct a temporary object
            let cart_item = {
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: 1
            }
            temp_cart.push(cart_item);  // push object to array
        }
        console.log("Successfully added", item.name, "to cart");
        props.setCart(temp_cart);
    };
    

    return (
        // shows the elements of the items array
        <div className="items">
            {/* <Item list={items} /> */}
            {items.map(item=> ( // mapping of the individual elements
                <div key={item.id} className="item">
                <div className="item_details">
                    {/* order is reversed */}
                    {/* adds a button to the bottom part of the item details  */}
                    <button className="addtocart" onClick={() => handleAddToCart(item)}>
                        Add to Cart
                    </button>
                    <p id="item_price">${item.price}</p>
                    <p id="item_name">{item.name}</p>
                    <img className="item_img" src={item.image} alt={item.name}/>
                </div>
                </div>
            ))}
        </div>
    );
};
