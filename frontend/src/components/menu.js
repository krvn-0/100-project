export default function Menus(props){
    const menus = props.list;

    return (
      <div className="topnav">
        <div className="App_name">
          <p>Farm-2-U</p>
        </div>
        <div className="select">
          {menus.map(menu => ( // mapping elements of the menus array
            <h3 key={menu.id} id={menu.name.toLowerCase()}> 
              {menu.name}
            </h3>
          ))}
        </div>
      </div>
        
    )
};
    