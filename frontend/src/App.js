import { 
  BrowserRouter, 
  Routes, 
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

import {
  useEffect, useState
} from 'react';

import NavBar from './components/NavBar';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import UserHome from './pages/UserHomePage';
import AdminHome from './pages/AdminHomePage';
import ProductPage from './pages/ProductPage';
import ConfirmLogout from './popups/ConfirmLogout';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavBarRoutes = ['/login', '/signup']
  const shouldHideNavBar = hideNavBarRoutes.includes(location.pathname);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // visible attribute (1 - user, 2 - admin, 3 - both) 
  const NavBarLinks = [
    { path: '/user-home', name: 'Home', visible: 1},
    { path: '/admin-home', name: 'Home', visible: 2},

    { path: '/products', name: 'Products', visible: 3},
    { path: '/cart', name: 'Cart', visible: 1},
    { path: '/orders', name: 'Orders', visible: 3},

    { path: '/users', name: 'Users', visible: 2},
    { path: '/sales', name: 'Sales', visible: 2},
  ].map((link) => {
    const isActive = location.pathname === link.path;
    return {...link, isActive};
  });

  const filterNavBarLinks = (NavBarItems, isAdmin) => {
    if(!isAdmin) return NavBarItems.filter((item) => item.visible === 1 || item.visible === 3);
    return NavBarItems.filter((item) => item.visible === 2 || item.visible === 3);
  }

  const filteredNavBar = filterNavBarLinks(NavBarLinks, isAdmin);

  return (
    <div className="App">
      {!shouldHideNavBar && <NavBar links={filteredNavBar} />}
      {!isAuthenticated ? (
        <div className={`app-content ${shouldHideNavBar ? 'full-height' : ''}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      ) : ( 
        <div className={`app-content ${shouldHideNavBar ? 'full-height' : ''}`}>
          <Routes>
            <Route path="/user-home" element={!isAdmin ? <UserHome /> : <AdminHome />} />
            <Route path='/logout' element={<ConfirmLogout />} />
            <Route path="/admin-home" element={isAdmin ? <AdminHome /> : <UserHome />} />
            <Route path="/products" element={<ProductPage />} />
            {/* <Route path="/cart" element={<Cart />} /> */}
            {/* <Route path="/orders" element={<Orders />} /> */}
            {/* <Route path="/users" element={<Users />} /> */}
            {/* <Route path="/sales" element={<Sales />} /> */}
            {/* <Route path="*" element={isAuthenticated ? <Navigate to='/user-home' />: <Navigate to="/login" /> || <Navigate to='/signup' />} /> */}
          </Routes> 
        </div>
      )}
    </div>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
