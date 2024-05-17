import { useEffect, useState } from "react";

export default function Menus({list, handleSelectClick}){
  const [selectedMenu, setSelectedMenu] = useState(null);

  // sets the default menu to home
  useEffect(() => {
    const homeMenu = list.find(menu => menu.name.toLowerCase() === 'home');
    if (homeMenu) {
        setSelectedMenu(homeMenu.id);
        handleSelectClick(homeMenu.id)
    }
  }, [list, handleSelectClick]);

  const handleMenuClick = (menu_id) => {
    setSelectedMenu(menu_id);
    handleSelectClick(menu_id); // Notify the parent component
  }

  return (
    <>
      <div className="topnav_placeholder"></div> {/* placeholder element */}
      <div className="topnav">
        <div className="App_name">
          <p>Farm-2-U</p>
        </div>
        <div className="select">
          {list.map(menu => (
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
