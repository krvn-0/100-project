import { useState } from "react"; // for use state
import { Trash3Fill, CheckCircleFill } from "react-bootstrap-icons";
import PersistentGet from "../http_methods/getter_persistent";

export default function CartList(props) {
  const cart = props.cart_list; // extracts the cart array
  const orders = props.order_list;
  const inv = props.item_list;

  var total = 0;

  // const [cart, setCart] = useState([]);
  // const [orders, setOrders] = useState([]);
  // const [inv, setItems] = useState([]);

  // PersistentGet('http://localhost:3001/products', setItems); // fetching products
  // PersistentGet(`https://localhost:3001/cart/${user.id}`); // fetching cart
  // PersistentGet(`http://localhost:3001/transactions/${user.id}`, setOrders); // fetching order

  const [isHoveredCK, setIsHoveredCK] = useState(false); // adds an isHovered attribute to each cart item
  const [isHoveredDL, setIsHoveredDL] = useState(false);

  const computeTotal = (item) => {
    var total = item.quantity * item.price;
    return total;
  };

  const handleRemoveItem = (item, type) => {
    props.setCart((curr_cart) => {
      // retains only the cart items apart from the removed one
      const new_cart = curr_cart.filter(
        (cart_item) => cart_item.id !== item.id
      );

      if (type === "remove") {
        console.log("Successfully removed " + item.name + " from the cart");
      } else {
        handleAddToOrders(item);
        console.log("Successfully checked out " + item.name);
      }

      if (isHoveredCK === item.id || isHoveredDL === item.id) {
        // resets isHovered attribute of items that got removed
        setIsHoveredDL(null);
        setIsHoveredCK(null);
      }

      return new_cart;
    });
  };

  const handleAddToOrders = (item) => {
    let temp_orders = [...orders]; // stores previous state of the cart
    let order_count = temp_orders.length + 1;

    let currentDateTime = new Date();

    // construct a temporary object
    let order_item = {
      transactID: order_count,
      product_id: item.id,
      email: props.email,
      product: item.name,
      quantity: item.quantity,
      status: 0,
      date: currentDateTime.toLocaleDateString(),
      time: currentDateTime.toLocaleTimeString(),
    };

    props.handleItemQuantity(item.id, item.quantity);
    temp_orders.push(order_item); // push object to array
    props.setOrders(temp_orders);
  };

  const updateQuantity = (item, value) => {
    let temp_cart = [...cart];

    let itemInCart = temp_cart.find((cart_item) => cart_item.id === item.id); // locates the item in the cart

    let itemInInv = inv.find((invItem) => invItem.id === item.id);

    if (itemInInv.quantity < value) {
      console.log("Insufficient stock");
      itemInCart.quantity = itemInInv.quantity;
    } else {
      itemInCart.quantity = value;
    }

    props.setCart(temp_cart);
  };

  const totalCount = (cart, total) => {
    let subtotal = 0;
    //  function that tallies the total number of items
    cart.forEach((cart_item) => {
      subtotal = Number(subtotal) + Number(cart_item.quantity);
    });
    total = subtotal;
    return total;
  };

  const tallyTotal = (cart) => {
    // function that tallies the total price to be paid
    var totalPrice = 0;
    cart.forEach((cart_item) => {
      totalPrice += computeTotal(cart_item);
    });
    return totalPrice;
  };

  return (
    <div className="cart">
      <div className="sticky_placeholder" />
      <div className="cart_header sticky">
        <p id="cart_title">Shopping Cart</p>
        <p id="num_items">
          Item Count: {Number(totalCount(cart, total)).toString()}
        </p>
      </div>
      {cart.length === 0 ? (
        <div id="emptyCart">Add items to cart</div>
      ) : (
        <div className="cart_body">
          <div className="cart_items">
            {/* maps each item of the cart */}
            {cart.map((cart_item) => (
              // uses conditional operator for added hover suffix class for added ux
              <div
                key={cart_item.id}
                className={[
                  "cart_item",
                  isHoveredDL === cart_item.id ? "hovered_delete" : "",
                  isHoveredCK === cart_item.id ? "hovered_checkout" : "",
                ].join(" ")}
              >
                <button
                  className="removeItem"
                  onClick={() => handleRemoveItem(cart_item, "remove")}
                  onMouseEnter={() => setIsHoveredDL(cart_item.id)}
                  onMouseLeave={() => setIsHoveredDL(null)}
                >
                  <Trash3Fill />
                </button>
                <button
                  className="checkout"
                  onClick={() => handleRemoveItem(cart_item, "checkout")}
                  onMouseEnter={() => setIsHoveredCK(cart_item.id)}
                  onMouseLeave={() => setIsHoveredCK(null)}
                >
                  <CheckCircleFill />
                </button>
                <div id="cart_item_price">
                  Cost: Php {computeTotal(cart_item).toFixed(2)}
                </div>
                <div className="cart_item_quantity">
                  <label id="qty">QTY:</label>
                  <input
                    className="qty_input"
                    id={`QTY_${cart_item.name}`}
                    type={"number"}
                    value={cart_item.quantity}
                    min={0}
                    onChange={(ev) => {
                      if (ev.target.valueAsNumber === 0)
                        handleRemoveItem(cart_item, "remove");
                      else {
                        updateQuantity(cart_item, ev.target.value);
                      }
                    }}
                  />
                </div>
                <div id="cart_item_name">{cart_item.name}</div>
              </div>
            ))}
          </div>
          <div className="totalPrice">
            <div id="totalPrice_title">Total Price:</div>
            <div id="totalPrice_val">Php {tallyTotal(cart).toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
