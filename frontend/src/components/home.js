export default function Home(props){
    const {username, onLogout} = props;

    const handleLogout = () => {
        onLogout();
    }
    
    return (
      <div className="home_page">
        <div className="greeting">
            <p>Hello, {username}</p>
        </div>
        <div>
            <button onClick={handleLogout}>
                logout
            </button>
        </div>
      </div>
    )
  };