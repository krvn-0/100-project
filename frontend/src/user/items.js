import { useState } from "react";
import Sort from "./sortItems";
// import PersistentGet from "../http_methods/getter_persistent";

export default function ItemList(props) {
  const [items, setItems] = useState(props.list); // extracts the items array
  // const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // PersistentGet('http://localhost:3001/products', setItems); // fetching products
  // PersistentGet('http://localhost:3001/transactions', setCart); // fetching cart

  const handleAddToCart = (item) => {
    let temp_cart = [...props.cart]; // stores previous state of the cart
    const itemIndex = temp_cart.findIndex(
      (cart_item) => cart_item.id === item.id
    ); // locates the item in the cart, if present

    if (
      item.quantity <= 0 ||
      (itemIndex !== -1 && temp_cart[itemIndex].quantity >= item.quantity)
    ) {
      console.log("Item has no stock.");
      return;
    }

    if (itemIndex !== -1) {
      // item is already in the cart
      temp_cart[itemIndex].quantity += 1;
    } else {
      // construct a temporary object
      let cart_item = {
        id: item.id,
        name: item.name,
        price: item.price,
        desc: item.description,
        type: item.type,
        quantity: 1,
      };
      temp_cart.push(cart_item); // push object to array
    }

    console.log("Successfully added", item.name, "to cart");
    props.setCart(temp_cart);
  };

  const checkDescription = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  return (
    <div>
      <Sort item_list={items} setItems={setItems} options={props.options} />
      {/* shows the elements of the items array */}
      <div className="items">
        {/* <Item list={items} /> */}
        {items.map(
          (
            item // mapping of the individual elements
          ) => (
            <div key={item.id} className="item">
              <div className="item_details">
                {/* order is reversed */}
                {/* adds a button to the bottom part of the item details  */}
                <button
                  className="addtocart"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
                <p id="item_qty">{item.quantity} left</p>
                <div className="item_price">
                  <p id="item_price">Php {item.price.toFixed(2)}</p>
                  <p id="item_price_unit">/{item.qty_type}</p>
                </div>

                <p id="item_name" onClick={() => checkDescription(item)}>
                  {item.name}
                </p>
                <img className="item_img" src={item.image} alt={item.name} />
              </div>
            </div>
          )
        )}
      </div>

      {isModalOpen && currentItem && (
        <div className="modal">
          <div className="modal_content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="modal_left">
              <img src={currentItem.image} alt={currentItem.name} />
              <p className="modal_type">
                {currentItem.type === 1 ? "Crops" : "Poultry"}
              </p>
              <p className="modal_qty">{currentItem.quantity} remaining</p>
              <p className="modal_price">
                Php {currentItem.pricetoFixed(2)} each
              </p>
            </div>
            <div className="modal_right">
              <p className="modal_name">{currentItem.name}</p>
              <p className="modal_description">{currentItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
