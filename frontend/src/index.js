import React from 'react';
import ReactDOM from 'react-dom/client';
import {Router, RouterProvider, createBrowserRouter} from 'react-router-dom';

import App from './App';
import Root from './root/root';
import UserDashboard from './dashboards/UserDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import Home from './components/home';
import Item from './user/items';
import Cart from './user/cart';
import Order from './user/order';
import Login from './components/login';
import AdminUser from './admin/adminUser';
import AdminProduct from './admin/adminProduct';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'user',
    element: <UserDashboard />,  // Use the layout component for user routes
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'products',
        element: <Item />,
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'orders',
        element: <Order />,
      },
    ],
  },
  // {
  //   path: 'admin',
  //   element: <Menu />,
  //   children: [
  //     {
  //       path: 'users',
  //       element: <Admin />,
  //     },
  //   ],
  // },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    <App />
  </React.StrictMode>
);
