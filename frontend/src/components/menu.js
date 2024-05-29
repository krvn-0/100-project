import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";


export default function Menus(props){
  const menus = props.list;
  
  const [selectedMenu, setSelectedMenu] = useState(null);
  // const navigate = useNavigate();
  // sets the default menu to home
  useEffect(() => {
    const homeMenu = menus.find(menu => menu.name.toLowerCase() === 'home');
    if (homeMenu) {
        setSelectedMenu(homeMenu.id);
        // navigate('user/home')
        props.handleSelectClick(homeMenu.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty array means this useEffect will only run once

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu.id);
    // navigate(`${menu.url}`);
    props.handleSelectClick(menu.id); // Notify the parent component
  }

  return (
    <>
      <div className="topnav_placeholder"></div> {/* placeholder element */}
      <div className="topnav">
        <div className="App_name">
          <p>Farm-2-U</p>
        </div>
        <div className="select">
          {menus.map(menu => (
            // <NavLink 
            //   to={menu.url} 
            //   key={menu.id} 
            //   id={menu.name.toLowerCase}
            //   onClick={() => handleMenuClick(menu)}
            //   className={selectedMenu === menu.id ? 'selected_menu' : ''}
            // >
            //   {menu.name}
            // </NavLink>
            <h3 key={menu.id} id={menu.name.toLowerCase()} 
            onClick={() => handleMenuClick(menu)}
            className={selectedMenu === menu.id ? 'selected_menu' : ''}> 
              {menu.name}
            </h3>
          ))}
        </div>
      </div>
    </>
  )
};
