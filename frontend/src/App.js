import './App.css'; // import stylesheet
import Login from './components/login';
import Menu from './components/menu';  // import array to be used for the "menu"
import Home from './components/home';
import Item from './components/items'; // import array of items to be shown
import Cart from './components/cart';   // import array of items in cart
import { useState, useEffect } from 'react';

function App() {
  const [cart, setCart] = useState([])
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [items, setItems] = useState(initialItems);

  const [User, setUser] = useState({ // placeholder for handling user info
    fname: "",
    mname: "",
    lname: "",
    userType: 0,
    email: "",
    password: ""
  })

  const handleLogin = (user) => { // Add this function
    setIsLoggedIn(true);
    setUser(user);
  }

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
    })
  }

  const handleItemQuantity = (itemID, change) => {
    setItems(prevItems => 
      prevItems.map(item =>
        item.id === itemID ? {...item, quantity: item.quantity - change} : item
      )
    );
  }
  
  useEffect(() => {
      const homeMenu = menus.find(menu => menu.name.toLowerCase() === 'home');
      if (homeMenu) {
          setSelectedMenu(homeMenu.id);
      }
  }, []);

  const handleSelectClick = (menu_id) => {
    setSelectedMenu(menu_id);
  }

  return (
    <div className="App">
        {!isLoggedIn ? (
          <Login list={sign_in} onLogin={handleLogin} />
        ) : (
          <>
            <Menu list={menus} handleSelectClick={handleSelectClick} />
            <div className="App_body">
              {selectedMenu === 1 && <Home user={User} onLogout={handleLogout}/>}
              {selectedMenu === 2 && <Item list={items} setCart={setCart} cart={cart} handleItemQuantity={handleItemQuantity}/>}
              {selectedMenu === 3 && <Cart list={cart} setCart={setCart}  cart={cart} handleItemQuantity={handleItemQuantity}/>}
            </div>
          </>
        )}
      </div>
  );
}

// initialization of the arrays
const sign_in = [
  { name: "Sign-Up", url: "#signup", id: 1},
  { name: "Sign-In", url: "#signin", id: 2}
]

const menus = [
  { name: "Home", url: "#home", id: 1},
  { name: "Products", url: "#products", id: 2},
  { name: "Cart", url: "#cart", id: 3},
  { name: "Orders", url: "#orders", id: 4}
];

const initialItems = [
  {
      id: 1,
      name: 'iPhone',
      description: '',
      type: 1,
      quantity: 749,
      image: 'https://img.freepik.com/free-photo/front-view-hand-holding-smartphone_23-2148775905.jpg?w=360&t=st=1714897773~exp=1714898373~hmac=7b8a20fe9c24cc72c3e6a71f38fe20ffe07ef3d0f6c8c6890278e82568aec7a9'
  },
  {
      id: 2,
      name: 'Laptop',
      description: '',
      type: 2,
      quantity: 699,
      image: 'https://img.freepik.com/free-photo/laptop-pencils-arrangement_23-2148128294.jpg?t=st=1714918664~exp=1714922264~hmac=62e6facb7a2f7891f4d478a400144f186e91e8530c9040ae9555534a55ab604f&w=900'
  },
  {
      id: 3,
      name: 'Earphones',
      description: '',
      type: 1,
      quantity: 199,
      image: 'https://img.freepik.com/free-vector/headphones-wireless-realistic-composition-with-isolated-image-phones-with-power-bank-dock-station-with-reflections-vector-illustration_1284-73201.jpg?t=st=1714918934~exp=1714922534~hmac=834dabc524b56c434ca78b7606ed8f282cd15f0c9fe9719e9ffb1d3bd321a8e4&w=740'
  },
  {
      id: 4,
      name: 'Headset',
      description: '',
      type: 2,
      quantity: 249,
      image: 'https://img.freepik.com/free-photo/levitating-music-headphones-display_23-2149817602.jpg?t=st=1714918994~exp=1714922594~hmac=27d3658b8a41dedaaf584c6b1be77b3b8ead9f2fb11052175c634812fa702a53&w=360'
  },
  {
      id: 5,
      name: 'Speaker',
      description: '',
      type: 1,
      quantity: 229,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBXHSLbVTmDUTvTpqW1kUbV5UerVJB4mqdAtVLgby8Jw&s'
  }
];

export default App;