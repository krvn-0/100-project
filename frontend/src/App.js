import './App.css'; // import stylesheet
import Login from './components/login';
import Menu from './components/menu';
import Home from './components/home';
import Item from './components/items';
import Cart from './components/cart';
import Order from './components/order';
import Admin from './components/admin'; // import Admin component
import { useState, useEffect } from 'react';

function App() {
  const [cart, setCart] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState(initialItems);
  const [orders, setOrders] = useState(initialOrders);
  const [menus, setMenus] = useState(initialUserMenus); // use state for menus
  const [isAdmin, setUserType] = useState(false);

  const [User, setUser] = useState({ // placeholder for handling user info
    fname: "",
    mname: "",
    lname: "",
    userType: 0,
    email: "",
    password: ""
  });

  useEffect(() => {
    const homeMenu = menus.find(menu => menu.name.toLowerCase() === 'home');
    if (homeMenu) {
        setSelectedMenu(homeMenu.id);
    }
  }, [menus]); // add menus as a dependency

  const handleSelectClick = (menu_id) => {
    setSelectedMenu(menu_id);
  };

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUser(user);

    if (user.email.toLowerCase() === 'admin@gmail.com') {
      setUserType(true);
      setMenus(initialAdminMenus);
      // setMenus(prevMenus => [...prevMenus, { name: "Admin", url: "#admin", id: 5 }]);
    }
  };

  const handleLogout = () => {
    setSelectedMenu(null); // Reset selected menu
    setCart([]); // Empty the cart
    setIsLoggedIn(false); // Log out the user
    setUser({
      fname: "",
      mname: "",
      lname: "",
      userType: 0,
      email: "",
      password: ""
    });
    setMenus(initialUserMenus); // reset menus to initial state
    setUserType(false);
  };

  const handleItemQuantity = (itemID, change) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemID ? {...item, quantity: item.quantity - change} : item
      )
    );
  };

  const handleOrderStatus = (transID, statusUpd) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.transactID === transID ? {...order, status: statusUpd} : order
      )
    );
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login list={sign_in} onLogin={handleLogin} />
        ) : ( 
          !isAdmin ? (
            <>
              <Menu list={menus} handleSelectClick={handleSelectClick} />
              <div className="App_body">
                {/* user dashboard */}
                {selectedMenu === 1 && <Home user={User} onLogout={handleLogout} />}
                {selectedMenu === 2 && <Item list={items} setCart={setCart} cart={cart} handleItemQuantity={handleItemQuantity} />}
                {selectedMenu === 3 && <Cart username={User.fname} cart_list={cart} order_list={orders} setCart={setCart} setOrders={setOrders} handleItemQuantity={handleItemQuantity} />}
                {selectedMenu === 4 && <Order list={orders} setCart={setCart} setStatus={handleOrderStatus} cart={cart} handleItemQuantity={handleItemQuantity} />}
              </div>
            </>
          ) : (
            <>
              <Menu  list={menus} handleSelectClick={handleSelectClick} />
              <div className="App_body">
                {selectedMenu === 1 && <Home user={User} onLogout={handleLogout} />}
                {selectedMenu === 2 && <Admin users={[User]} products={items} setProducts={setItems} orders={orders} />} {/* render Admin component */}
              </div>
            </>
          ) 
        )}
    </div>
  );
}

// initialization of the arrays
const sign_in = [
  { name: "Sign-Up", url: "#signup", id: 1 },
  { name: "Sign-In", url: "#signin", id: 2 }
];

const initialUserMenus = [
  { name: "Home", url: "#home", id: 1 },
  { name: "Products", url: "#products", id: 2 },
  { name: "Cart", url: "#cart", id: 3 },
  { name: "Orders", url: "#orders", id: 4 }
];

const initialAdminMenus = [
  { name: "Home", url: "#home", id: 1 },
  { name: "Admin", url: "#admin", id: 2 }
]

const initialItems = [
  {
      id: 1,
      name: 'iPhone',
      description: 'this is product1 description this is product1 description this is product1 description this is product1 description',
      type: 1,
      price: 649,
      quantity: 749,
      image: 'https://img.freepik.com/free-photo/front-view-hand-holding-smartphone_23-2148775905.jpg?w=360&t=st=1714897773~exp=1714898373~hmac=7b8a20fe9c24cc72c3e6a71f38fe20ffe07ef3d0f6c8c6890278e82568aec7a9'
  },
  {
      id: 2,
      name: 'Laptop',
      description: 'this is product2 description',
      type: 2,
      price: 799,
      quantity: 699,
      image: 'https://img.freepik.com/free-photo/laptop-pencils-arrangement_23-2148128294.jpg?t=st=1714918664~exp=1714922264~hmac=62e6facb7a2f7891f4d478a400144f186e91e8530c9040ae9555534a55ab604f&w=900'
  },
  {
      id: 3,
      name: 'Earphones',
      description: 'this is product3 description',
      type: 1,
      price: 199,
      quantity: 199,
      image: 'https://img.freepik.com/free-vector/headphones-wireless-realistic-composition-with-isolated-image-phones-with-power-bank-dock-station-with-reflections-vector-illustration_1284-73201.jpg?t=st=1714918934~exp=1714922534~hmac=834dabc524b56c434ca78b7606ed8f282cd15f0c9fe9719e9ffb1d3bd321a8e4&w=740'
  },
  {
      id: 4,
      name: 'Headset',
      description: 'this is product4 description',
      type: 2,
      price: 249,
      quantity: 249,
      image: 'https://img.freepik.com/free-photo/levitating-music-headphones-display_23-2149817602.jpg?t=st=1714918994~exp=1714922594~hmac=27d3658b8a41dedaaf584c6b1be77b3b8ead9f2fb11052175c634812fa702a53&w=360'
  },
  {
      id: 5,
      name: 'Speaker',
      description: 'this is product5 description',
      type: 1,
      price: 349,
      quantity: 229,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBXHSLbVTmDUTvTpqW1kUbV5UerVJB4mqdAtVLgby8Jw&s'

  }
];

const initialOrders = [
  {
    transactID: 1,
    id: 1,
    user: 'asasdasfasdvdas',
    product: 'iPhone',
    quantity: 2,
    status: -1 // cancelled
  },
  {
    transactID: 2,
    id: 2,
    user: 'asasdasfasdvdas',
    product: 'Laptop',
    quantity: 4,
    status: 0 // pending
  },
  {
    transactID: 3,
    id: 3,
    user: 'asasdasfasdvdas',
    product: 'Earphones',
    quantity: 5,
    status: 1 // completed
  },
  {
    transactID: 4,
    id: 4,
    user: 'asasdasfasdvdas',
    product: 'Headset',
    quantity: 2,
    status: -1 
  },
  {
    transactID: 5,
    id: 4,
    user: 'asasdasfasdvdas',
    product: 'Headset',
    quantity: 2,
    status: 1 
  },
  {
    transactID: 6,
    id: 4,
    user: 'asasdasfasdvdas',
    product: 'Headset',
    quantity: 2,
    status: 0 
  }
];

export default App;
