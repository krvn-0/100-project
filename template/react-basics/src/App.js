import './App.css'; // import stylesheet
import Menu from './components/menu';  // import array to be used for the "menu"
import Item from './components/items'; // import array of items to be shown
import Cart from './components/cart';   // import array of items in cart

import { useState } from 'react';

function App() {
  const [cart, setCart] = useState([])

  return (
    <div className="App">
      {/* navbar containing the app name and the different "menu" */}
      <div className="topnav">
        <div className="Lazado">
          <p>Lazado</p>
        </div>
        <Menu list={menus} />
      </div>
      <div className="App_body">
        {/* passing the setCart for updating the cart elements, as well as the cart itself */}
        <Item list={items} setCart={setCart} cart={cart}/>
        <Cart list={cart} setCart={setCart}  cart={cart}/>
      </div>
    </div>
  );
}

// initialization of the arrays
const menus = [
  { name: "Appliances", url: "#appliance", id: 1},
  { name: "Groceries", url: "#grocery", id: 2},
  { name: "Gadgets", url: "#gadget", id: 3}
];

const items = [
  {
      id: 1,
      name: 'iPhone',
      price: 749,
      image: 'https://img.freepik.com/free-photo/front-view-hand-holding-smartphone_23-2148775905.jpg?w=360&t=st=1714897773~exp=1714898373~hmac=7b8a20fe9c24cc72c3e6a71f38fe20ffe07ef3d0f6c8c6890278e82568aec7a9'
  },
  {
      id: 2,
      name: 'Laptop',
      price: 699,
      image: 'https://img.freepik.com/free-photo/laptop-pencils-arrangement_23-2148128294.jpg?t=st=1714918664~exp=1714922264~hmac=62e6facb7a2f7891f4d478a400144f186e91e8530c9040ae9555534a55ab604f&w=900'
  },
  {
      id: 3,
      name: 'Earphones',
      price: 199,
      image: 'https://img.freepik.com/free-vector/headphones-wireless-realistic-composition-with-isolated-image-phones-with-power-bank-dock-station-with-reflections-vector-illustration_1284-73201.jpg?t=st=1714918934~exp=1714922534~hmac=834dabc524b56c434ca78b7606ed8f282cd15f0c9fe9719e9ffb1d3bd321a8e4&w=740'
  },
  {
      id: 4,
      name: 'Headset',
      price: 249,
      image: 'https://img.freepik.com/free-photo/levitating-music-headphones-display_23-2149817602.jpg?t=st=1714918994~exp=1714922594~hmac=27d3658b8a41dedaaf584c6b1be77b3b8ead9f2fb11052175c634812fa702a53&w=360'
  },
  {
      id: 5,
      name: 'Speaker',
      price: 229,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBXHSLbVTmDUTvTpqW1kUbV5UerVJB4mqdAtVLgby8Jw&s'
  },
  {
      id: 6,
      name: 'Computer',
      price: 499,
      image: 'https://cdn.originpc.com/img/compare-all/gaming-desktops/genesis-7000-series-system-image.png'
  },
  {
      id: 7,
      name: 'Monitor',
      price: 549,
      image: 'https://cdn.arstechnica.net/wp-content/uploads/2022/01/XXXXXX.jpg'
  },
  {
      id: 8,
      name: 'Samsung',
      price: 699,
      image: 'https://images.samsung.com/is/image/samsung/p6pim/ph/2401/gallery/ph-galaxy-s24-s928-sm-s928bztqphl-thumb-539303751'
  },
  {
      id: 9,
      name: 'Aircon',
      price: 549,
      image: 'https://www.lg.com/my/images/home-air-conditioners/bs-q126bry4/gallery/Artcool_zoom_02.jpg'
  },
  {
      id: 10,
      name: 'EFan',
      price: 149,
      image: 'https://ansons.ph/wp-content/uploads/2022/05/01_BKWST-16BK.png'
  },
  {
      id: 11,
      name: 'Air Cooler',
      price: 249,
      image: 'https://d1pjg4o0tbonat.cloudfront.net/content/dam/midea-aem/id/AC120-16AR-BLUE-LIGHT.png/jcr:content/renditions/cq5dam.compression.png'
  },
  {
      id: 12,
      name: 'Washing Machine',
      price: 349,
      image: 'https://www.lg.com/ph/images/washing-machines/md07556668/gallery1/D-2.jpg'
  }
  
];

export default App;
