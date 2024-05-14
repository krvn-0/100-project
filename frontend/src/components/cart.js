import {useState} from "react"; // for use state
import { Trash3Fill, CheckCircleFill } from 'react-bootstrap-icons';

export default function CartList(props) {
    const cart = props.list;    // extracts the cart array 
    const [isHoveredCK, setIsHoveredCK] = useState(false);  // adds an isHovered attribute to each cart item
    const [isHoveredDL, setIsHoveredDL] = useState(false);
    // const computeTotal = (item) => {
    //     var total = item.quantity * item.price;
    //     return total;
    // };

    const handleRemoveItem = (item) => {
        props.handleItemQuantity(item.id, -item.quantity)
        props.setCart((curr_cart) => {
            // retains only the cart items apart from the removed one
            const new_cart = curr_cart.filter((cart_item) => cart_item.id !== item.id)   
            console.log("Successfully removed " + item.name + " from the cart");

            if(isHoveredCK === item.id || isHoveredDL === item.id) { // resets isHovered attribute of items that got removed
                setIsHoveredDL(null);
                setIsHoveredCK(null)
            };

            return new_cart;
            });
    };

    const updateQuantity = (item, value) => {
        let prev_qty;
        let temp_cart = [...props.cart];
        temp_cart.forEach((cart_item) => {
            if (item.id === cart_item.id) {
                prev_qty = cart_item.quantity
                cart_item.quantity = value;
            }
        });
        props.setCart(temp_cart);
        props.handleItemQuantity(item.id, (value- prev_qty));
    }

    const totalCount = (cart) => {  //  function that tallies the total number of items
        var total = 0;
        cart.forEach(cart_item => {
            total += cart_item.quantity;
        });
        return total;
    }

    // const tallyTotal = (cart) => {  // function that tallies the total price to be paid
    //     var totalPrice = 0;
    //     cart.forEach(cart_item => {
    //         totalPrice += computeTotal(cart_item);
    //     });
    //     return totalPrice;
    // }

    return (
        <div className="cart">
            <div className="cart_header">
                <p id="cart_title">Shopping Cart</p>
                <p id="num_items">Item Count: {totalCount(cart)}</p>
            </div>
            {cart.length === 0 ? (
                <div id="emptyCart">
                    Add items to cart
                </div>
            ) : (
                <div className="cart_body">
                    <div className="cart_items">
                        {/* maps each item of the cart */}
                        {cart.map(cart_item => (
                            // uses conditional operator for added hover suffix class for added ux
                            <div key={cart_item.id} 
                                className={[
                                    'cart_item',
                                    isHoveredDL === cart_item.id ? 'hovered_delete' : '',
                                    isHoveredCK === cart_item.id ? 'hovered_checkout' : ''
                                ].join(' ')}>
                                <button className="removeItem" 
                                    onClick={() => handleRemoveItem(cart_item)} 
                                    onMouseEnter={() => setIsHoveredDL(cart_item.id)} 
                                    onMouseLeave={() => setIsHoveredDL(null)}>
                                        <Trash3Fill />
                                </button>
                                <button className="checkout" 
                                    onClick={() => handleRemoveItem(cart_item)} 
                                    onMouseEnter={() => setIsHoveredCK(cart_item.id)} 
                                    onMouseLeave={() => setIsHoveredCK(null)}>
                                        <CheckCircleFill />
                                </button>
                                {/* <div id="cart_item_price">${computeTotal(cart_item)}</div> */}
                                <div className="cart_item_quantity">
                                    <label id="qty">QTY:</label>
                                    <input className="qty_input" id={`QTY_${cart_item.name}`} type={"number"} defaultValue={cart_item.quantity} min={0} onChange={(ev) => {
                                        if (ev.target.valueAsNumber === 0) handleRemoveItem(cart_item)
                                        else {
                                            updateQuantity(cart_item, ev.target.valueAsNumber)
                                            ev.target.defaultValue = cart_item.quantity
                                        }
                                    }} />
                                </div>
                                <div id="cart_item_name">{cart_item.name}</div>
                            </div>
                        ))}
                    </div>
                    {/* <div className="totalPrice">
                        <div id="totalPrice_title">Total Price:</div>
                        <div id="totalPrice_val">${tallyTotal(cart)}</div>
                    </div> */}
                </div>
            )}
        </div>
    );
};