import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './NavBar.css';

function NavBar({links}) {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.setItem('last-path', window.location.pathname);
        navigate('/logout');
    }

    const linkList = links.map((link, index) => 
        <li key={index}>
            <Link to={link.path} className={link.isActive ? 'active' : ''}>{link.name}</Link>
        </li>
    );

    return (
        <div className='navbar'>
            <div className='app-name'><p>Farm-to-Table</p></div>
            <div className='logo-holder'></div>
            <div className='nav'>
                <ul>
                    {linkList}
                </ul>
            </div>
            <div className='logout-holder' onClick={() => handleLogout()}>
                <span className='logout-link'>Logout</span>
            </div>
        </div>
    )
}

export default NavBar;