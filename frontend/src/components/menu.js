import { useState, useEffect } from "react";

export default function Menus(props){
    const menus = props.list;
    const [selectedMenu, setSelectedMenu] = useState(null);

    useEffect(() => {
      const homeMenu = menus.find(menu => menu.name.toLowerCase() === 'home');
      if (homeMenu) {
          setSelectedMenu(homeMenu.id);
      }
  }, [menus]);

    const handleSelectClick = (menu_id) => {
      setSelectedMenu(menu_id);
    }

    return (
      <div className="topnav">
        <div className="App_name">
          <p>Farm-2-U</p>
        </div>
        <div className="select">
          {menus.map(menu => ( // mapping elements of the menus array
            <h3 key={menu.id} id={menu.name.toLowerCase()} 
            onClick={() => handleSelectClick(menu.id)}
            className={selectedMenu === menu.id ? 'selected_menu' : ''
                }> 
              {menu.name}
            </h3>
          ))}
        </div>
      </div>
    )
};
    