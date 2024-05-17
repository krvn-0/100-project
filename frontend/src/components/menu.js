import { useEffect, useState } from "react";

export default function Menus(props){
  const menus = props.list;
  
  const [selectedMenu, setSelectedMenu] = useState(null);

  // sets the default menu to home
  useEffect(() => {
    const homeMenu = menus.find(menu => menu.name.toLowerCase() === 'home');
    if (homeMenu) {
        setSelectedMenu(homeMenu.id);
        props.handleSelectClick(homeMenu.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty array means this useEffect will only run once

  const handleMenuClick = (menu_id) => {
    setSelectedMenu(menu_id);
    props.handleSelectClick(menu_id); // Notify the parent component
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
            <h3 key={menu.id} id={menu.name.toLowerCase()} 
            onClick={() => handleMenuClick(menu.id)}
            className={selectedMenu === menu.id ? 'selected_menu' : ''}> 
              {menu.name}
            </h3>
          ))}
        </div>
      </div>
    </>
  )
};
