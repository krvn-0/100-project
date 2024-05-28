import './App.css'; // import stylesheet
import Login from './components/login';
// import AdminDashboard from './dashboards/AdminDashboard';
// import UserDashboard from './dashboards/UserDashboard';

import Menu from './components/menu';
import Home from './components/home';
import Item from './user/items';
import Cart from './user/cart';
import Order from './user/order';
import Admin from './admin/admin';

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
        <Login onLogin={handleLogin} />
        ) : ( 
          !isAdmin ? (
            <>
              <Menu list={menus} handleSelectClick={handleSelectClick} />
              <div className="App_body">
                {/* user dashboard */}
                {selectedMenu === 1 && <Home user={User} onLogout={handleLogout} />}
                {selectedMenu === 2 && <Item list={items} setCart={setCart} cart={cart} handleItemQuantity={handleItemQuantity} />}
                {selectedMenu === 3 && <Cart email={User.email} item_list={items} cart_list={cart} order_list={orders} setCart={setCart} setOrders={setOrders} handleItemQuantity={handleItemQuantity} />}
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



  // return (
  //   <>
  //     <div className="App">
  //       {!isLoggedIn ? (
  //         <Login onLogin={handleLogin} />
  //       ) : (
  //         isAdmin ? (
  //           <AdminDashboard
  //             selectedMenu={selectedMenu}
  //             menus={menus}
  //             handleSelectClick={handleSelectClick}
  //             User={User}
  //             handleLogout={handleLogout}
  //             items={items}
  //             setItems={setItems}
  //             orders={orders}
  //           />
  //         ) : (
  //           <UserDashboard
  //             selectedMenu={selectedMenu}
  //             menus={menus}
  //             handleSelectClick={handleSelectClick}
  //             User={User}
  //             handleLogout={handleLogout}
  //             items={items}
  //             setCart={setCart}
  //             cart={cart}
  //             handleItemQuantity={handleItemQuantity}
  //             options={[]}
  //             orders={orders}
  //             setOrders={setOrders}
  //             handleOrderStatus={handleOrderStatus}
  //           />
  //         )
  //       )}
  //     </div>
  //   </>
  // )
}

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
    name: 'Corn',
    description: 'High-quality, non-GMO corn ideal for a variety of uses including food, feed, and ethanol production.',
    type: 1,
    price: 2.5,
    quantity: 10000,
    qty_type: "kilo",
    image: 'https://img.freepik.com/free-photo/corn-pod-isolated-with-corn-kernels-from-corn-field-white-wall_1150-21863.jpg?t=st=1716023495~exp=1716027095~hmac=eea2b93511f1a7e209d9bf73a7375cb98e81b8f5313c4fffb77e79975ccc4e4e&w=826'
  },
  {
      id: 2,
      name: 'Chicken',
      description: 'Free-range, organic chickens raised with the highest standards of care and nutrition.',
      type: 2,
      price: 12,
      quantity: 500,
      qty_type: "kilo",
      image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
      id: 3,
      name: 'Wheat',
      description: 'Premium wheat grain suitable for baking and milling purposes, harvested from sustainable farms.',
      type: 1,
      price: 3,
      quantity: 15000,
      qty_type: "kilo",
      image: 'https://img.freepik.com/free-photo/oats-peeled_1368-5469.jpg?t=st=1716023390~exp=1716026990~hmac=b7b47aa7059e9987fdee377f94cc3f2d7a66103f5586437d8e39769bdeec695e&w=826'
  },
  {
      id: 4,
      name: 'Chicken Eggs',
      description: 'Organic, cage-free eggs produced with care for both the hens and the environment.',
      type: 2,
      price: 3.5,
      quantity: 2000,
      qty_type: "dozen",
      image: 'https://img.freepik.com/free-photo/three-fresh-organic-raw-eggs-isolated-white-surface_114579-43677.jpg?t=st=1716023528~exp=1716027128~hmac=2544b54994caf00549e7b3a6810f5d4fc8f2b136528d19b8c5cdfe39cadc7b96&w=826'
  },
  {
      id: 5,
      name: 'Soybeans',
      description: 'High-yield soybeans perfect for tofu, soy milk, and other soy-based products.',
      type: 1,
      price: 2.8,
      quantity: 8000,
      qty_type: "kilo",
      image: 'https://img.freepik.com/free-photo/yellow-soy-beans_74190-7153.jpg?t=st=1716023558~exp=1716027158~hmac=58782b39a497c38107f8f9d4af2a2626c9ff6d72b9107096aeffd1fd57233969&w=360'
  },
  {
      id: 6,
      name: 'Turkey',
      description: 'Pasture-raised turkeys known for their rich flavor and high nutritional value.',
      type: 2,
      price: 20,
      quantity: 300,
      qty_type: "kilo",
      image: 'https://images.unsplash.com/photo-1461037506617-211749beac60?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
      id: 7,
      name: 'Rice',
      description: 'Top-grade rice suitable for a variety of culinary applications, grown in optimal conditions.',
      type: 1,
      price: 1.5,
      quantity: 20000,
      qty_type: "kilo",
      image: 'https://img.freepik.com/free-photo/sack-rice-with-rice-wooden-spoon-rice-plant_1150-34315.jpg?t=st=1716025041~exp=1716028641~hmac=b60ac8a06306195cde4fd226df7e667ca609c21cca301aad0f2b0c6803db2983&w=996'
  },
  {
      id: 8,
      name: 'Ducks',
      description: 'Healthy, free-range ducks, ideal for meat and egg production, raised with care.',
      type: 2,
      price: 18,
      quantity: 250,
      qty_type: "kilo",
      image: 'https://img.freepik.com/free-photo/group-ducks-looking-camera_23-2148315320.jpg?t=st=1716024066~exp=1716027666~hmac=b67d91f82564666dfe6ea5654efec92d146ff863d0fb2c457a33fd1655ff021d&w=826'
  },
  {
      id: 9,
      name: 'Barley',
      description: 'High-quality barley grains used for brewing, animal feed, and health foods.',
      type: 1,
      price: 2.2,
      quantity: 12000,
      qty_type: "kilo",
      image: 'https://img.freepik.com/free-photo/organic-grain-healthy-diet_1127-308.jpg?t=st=1716024269~exp=1716027869~hmac=9e7c90107c8eabadecc9334e490205cb7a765e9a1cfc9c728df8a31f2985bd0b&w=826'
  },
  {
      id: 10,
      name: 'Quail',
      description: 'Quail raised with care, known for their tender meat and nutrient-rich eggs.',
      type: 2,
      price: 15,
      quantity: 400,
      qty_type: "kilo",
      image: 'https://www.asian-agribiz.com/wp-content/uploads/2022/03/quails.jpg'
  }
];

const initialOrders = [
  {
    transactID: 1,
    product_id: 1,
    user: 'farmer.joe@gmail.com',
    product: 'Corn',
    quantity: 50,
    status: -1, // cancelled
    date: "5/17/2023",
    time: "3:45:27 PM"
  },
  {
    transactID: 2,
    product_id: 2,
    user: 'farmer.joe@gmail.com',
    product: 'Chicken',
    quantity: 10,
    status: 0, // pending
    date: "6/21/2023",
    time: "5:06:24 AM"
  },
  {
    transactID: 3,
    product_id: 3,
    user: 'farmer.joe@gmail.com',
    product: 'Wheat',
    quantity: 100,
    status: 1, // completed
    date: "7/23/2023",
    time: "6:12:00 AM"
  },
  {
    transactID: 4,
    product_id: 4,
    user: 'farmer.joe@gmail.com',
    product: 'Eggs',
    quantity: 30,
    status: -1, // cancelled
    date: "8/1/2023",
    time: "9:13:21 PM"
  },
  {
    transactID: 5,
    product_id: 4,
    user: 'farmer.joe@gmail.com',
    product: 'Eggs',
    quantity: 40,
    status: 1, // completed
    date: "10/22/2023",
    time: "12:45:27 PM"
  },
  {
    transactID: 6,
    product_id: 5,
    user: 'farmer.joe@gmail.com',
    product: 'Soybeans',
    quantity: 80,
    status: 0, // pending
    date: "1/1/2024",
    time: "12:00:01 AM"
  },
  {
    transactID: 7,
    product_id: 6,
    user: 'farmer.joe@gmail.com',
    product: 'Turkey',
    quantity: 12,
    status: 1, // completed
    date: "2/14/2024",
    time: "3:30:00 PM"
  },
  {
    transactID: 8,
    product_id: 7,
    user: 'farmer.joe@gmail.com',
    product: 'Rice',
    quantity: 200,
    status: 0, // pending
    date: "3/3/2024",
    time: "8:15:45 AM"
  },
  {
    transactID: 9,
    product_id: 8,
    user: 'farmer.joe@gmail.com',
    product: 'Ducks',
    quantity: 20,
    status: -1, // cancelled
    date: "4/10/2024",
    time: "11:50:32 AM"
  },
  {
    transactID: 10,
    product_id: 9,
    user: 'farmer.joe@gmail.com',
    product: 'Barley',
    quantity: 150,
    status: 1, // completed
    date: "5/5/2024",
    time: "2:22:12 PM"
  },
  {
    transactID: 11,
    product_id: 10,
    user: 'farmer.joe@gmail.com',
    product: 'Quail',
    quantity: 25,
    status: 0, // pending
    date: "5/17/2024",
    time: "7:45:27 AM"
  },
  {
    transactID: 12,
    product_id: 1,
    user: 'farmer.joe@gmail.com',
    product: 'Corn',
    quantity: 60,
    status: 1, // completed
    date: "5/10/2024",
    time: "4:33:14 PM"
  },
  {
    transactID: 13,
    product_id: 2,
    user: 'farmer.joe@gmail.com',
    product: 'Chicken',
    quantity: 8,
    status: 0, // pending
    date: "5/14/2024",
    time: "9:05:18 AM"
  },
  {
    transactID: 14,
    product_id: 3,
    user: 'farmer.joe@gmail.com',
    product: 'Wheat',
    quantity: 120,
    status: -1, // cancelled
    date: "5/16/2024",
    time: "1:40:59 PM"
  },
  {
    transactID: 15,
    product_id: 4,
    user: 'farmer.joe@gmail.com',
    product: 'Eggs',
    quantity: 50,
    status: 1, // completed
    date: "5/18/2024",
    time: "3:12:00 PM"
  },
  {
    transactID: 16,
    product_id: 5,
    user: 'farmer.joe@gmail.com',
    product: 'Soybeans',
    quantity: 70,
    status: 0, // pending
    date: "5/17/2024",
    time: "10:45:27 AM"
  },
  {
    transactID: 17,
    product_id: 6,
    user: 'farmer.joe@gmail.com',
    product: 'Turkey',
    quantity: 15,
    status: 1, // completed
    date: "5/18/2024",
    time: "12:30:00 PM"
  },
  {
    transactID: 18,
    product_id: 7,
    user: 'farmer.joe@gmail.com',
    product: 'Rice',
    quantity: 250,
    status: 0, // pending
    date: "5/14/2024",
    time: "6:15:45 PM"
  },
  {
    transactID: 19,
    product_id: 8,
    user: 'farmer.joe@gmail.com',
    product: 'Ducks',
    quantity: 18,
    status: -1, // cancelled
    date: "5/17/2024",
    time: "8:20:32 AM"
  },
  {
    transactID: 20,
    product_id: 9,
    user: 'farmer.joe@gmail.com',
    product: 'Barley',
    quantity: 180,
    status: 1, // completed
    date: "5/18/2024",
    time: "11:02:12 AM"
  }
];

export default App;
