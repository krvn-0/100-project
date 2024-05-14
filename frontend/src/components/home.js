export default function Home(props){
    const {user, onLogout} = props;

    const handleLogout = () => {
        onLogout();
    }
    
    return (
      <div className="home_page">
        <div className="home_contents">
        <div className="greeting">
            <p>Hello, {user.username}</p>
        </div>
        <div className="instruction">
            <p className="message">
                Welcome to Farm-2-U, an app made to make buying and 
                selling agricultural products easier for both consumer
                and producer
            </p>
        </div>
        <div>
            <button onClick={handleLogout} className="logout">
                Logout
            </button>
        </div>
        </div>
      </div>
    )
  };