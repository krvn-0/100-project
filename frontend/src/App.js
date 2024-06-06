import { 
  BrowserRouter, 
  Routes, 
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom';

import { useEffect } from 'react';

import NavBar from './components/NavBar';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import ConfirmLogout from './popups/ConfirmLogout';
import UserHome from './pages/UserHomePage';
import AdminHome from './pages/AdminHomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
// import SalesPage from './pages/SalesPage';
import OrderPage from './pages/OrderPage';

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hideNavBarRoutes = ['/login', '/signup']
  const shouldHideNavBar = hideNavBarRoutes.includes(location.pathname);

  const isAuthenticated = !!sessionStorage.getItem('userID');
  const isAdmin = JSON.parse(sessionStorage.getItem('isAdmin')) || false;

  useEffect(() => {
    if (!isAuthenticated) {
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="*" element={isAuthenticated ? <Navigate to='/user-home' />: <Navigate to="/login" /> || <Navigate to='/signup' />} />
      </Routes>
    }
  }, [isAuthenticated, navigate]);

  // visible attribute (1 - user, 2 - admin, 3 - both) 
  const NavBarLinks = [
    { path: '/user-home', name: 'Home', visible: 1},
    { path: '/admin-home', name: 'Home', visible: 2},
    { path: '/users', name: 'Users', visible: 2},

    { path: '/products', name: 'Products', visible: 3},
    { path: '/cart', name: 'Cart', visible: 1},
    { path: '/orders', name: 'Orders', visible: 3},

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
        <div className={`app-content ${shouldHideNavBar ? 'full-height' : ''}`}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to='/user-home' />} />
            <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to='/user-home' />} />
            <Route path='/logout' element={<ConfirmLogout />} />
            <Route path="/user-home" element={isAuthenticated ? (!isAdmin ? <UserHome /> : <AdminHome />) : <Navigate to='/login' />} />
            <Route path="/admin-home" element={isAuthenticated ? (isAdmin ? <AdminHome /> : <UserHome />) : <Navigate to='/login' />} />
            <Route path="/products" element={isAuthenticated ? <ProductPage /> : <Navigate to='/login' />} />
            <Route path="/cart" element={isAuthenticated ? <CartPage /> : <Navigate to='/login' />} />
            <Route path="/orders" element={isAuthenticated ? <OrderPage /> : <Navigate to='/login' />} /> 
            {/* <Route path="/users" element={isAuthenticated ? <UserPage /> : <Navigate to='/login' />} /> */}
            {/* <Route path="/sales" element={isAuthenticated ? <SalesPage /> : <Navigate to='/login' />} /> */}
            <Route path="*" element={isAuthenticated ? <Navigate to='/user-home'/> || <Navigate to='/admin-home'/> : <Navigate to="/login" /> || <Navigate to='/signup' />} />
          </Routes> 
        </div>
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
