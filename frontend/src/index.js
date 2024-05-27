import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter} from 'react-router-dom';

import App from './App';
import UserDashboard from './dashboards/UserDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import Home from './components/home';
import ItemList from './user/items';
import CartList from './user/cart';
import OrderList from './user/order';
import Login from './components/login';
import AdminUser from './admin/adminUser';
import AdminProduct from './admin/adminProduct';

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     children: [
//       {
//         path: '/user',
//         element: <UserDashboard />,
//         children: [
//           {
//             path: '/user/home',
//             element: <Home />,
//           },
//           {
//             path: 'user/items',
//             element: <ItemList />,
//           },
//           {
//             path: 'user/cart/:userID',
//             element: <CartList />,
//           },
//           {
//             path: 'user/order/:userID',
//             element: <OrderList />,
//           }
//         ],
//       },
//       {
//         path: '/admin',
//         element: <AdminDashboard />,
//         children: [
//           {
//             path: '/admin/users',
//             element: <AdminUser />,
//           },
//           {
//             path: 'admin/items',
//             element: <AdminProduct />,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     path: '/login',
//     element: <Login />
//   }
// ])


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
