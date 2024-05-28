import { useState } from 'react';

export default function Login(props) {
  const login = [  
    { name: "Sign-Up", url: "#signup", id: 1 },
    { name: "Sign-In", url: "#signin", id: 2 }
  ];

  const [selectedLogOpt, setSelectedLogOpt] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    userType: 0,
    password: ""
  });

  const handleInputChange = (event) => {
    if (event.target) {
        setUser({
            ...user,
            [event.target.name]: event.target.value
        });
    }
  }

  const handleLogOptClick = (log_opt_id) => {
    setSelectedLogOpt(log_opt_id);
    setShowPassword(false);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onLogin(user);

    // fetch('https://localhost:3001/login', {
    // method: 'POST',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    // body: JSON.stringify(user),
    // })
    // .then(response => response.json())
    // .then(data => {
    //   console.log(data);
    // })
    // .catch(error => {
    //   console.error('Error:', error);
    // });

    // redirect sa dashboard filter..?
    // useNavigate('/user') or useNavigate('/admin)
  }

  const renderFormFields = () => {
    switch (selectedLogOpt) {
      case 1:
        return (
          <>
            <label>First Name:</label>
            <input 
              type="text" 
              name="fname" 
              className="common_input" 
              required 
              value={user.fname} 
              onChange={handleInputChange} 
            />

            <label>Middle Name:</label>
            <input 
              type="text" 
              name="mname" 
              className="common_input" 
              value
              ={user.mname} 
              onChange={handleInputChange} 
            />
            
            <label>Last Name:</label>
            <input 
              type="text" 
              name="lname" 
              className="common_input" 
              required 
              value={user.lname} 
              onChange={handleInputChange} 
            />
            
            <label>Email:</label>
            <input 
              type="email"
              name="email" 
              className="common_input" 
              required 
              value={user.email} 
              onChange={handleInputChange} 
            />
            
            <label>Password:</label>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" className="common_input" 
              required 
              value={user.password} 
              onChange={handleInputChange} 
            />
            
            <div className="showPass">
              <span>Show password</span>
              <input 
                type="checkbox" 
                onChange={() => setShowPassword(!showPassword)} />
            </div>

            <input 
              type="submit" 
              value="Submit" 
              className="submit" 
            />
          </>
        );
      case 2:
        return (
          <>
            <label>Email:</label>
            <input 
              type="email"
              name="email" 
              className="common_input" 
              required 
              value={user.email} 
              onChange={handleInputChange} 
            />
            
            <label>Password:</label>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" className="common_input" 
              required 
              value={user.password} 
              onChange={handleInputChange} 
            />

            <div className="showPass">
              <span>Show password</span>
              <input 
                type="checkbox" 
                onChange={() => setShowPassword(!showPassword)} />
            </div>

            <input 
              type="submit" 
              value="Submit" 
              className="submit" 
            />
          </>
        )
      default:
        return (
          <p className="initial_login_opt">
            Choose a login option
          </p>
        );
    }
  };

  return (
    <div className="login">
      <div className="left_login">
        <div className="App_name_login">
          <p>Farm-2-U</p>
        </div>
      </div>
      <div className="right_login">
        <div className="login_opt">
          {login.map(log_opt => (
            <h3 key={log_opt.id} id={log_opt.name.toLowerCase()}
              onClick={() => handleLogOptClick(log_opt.id)}
              className={selectedLogOpt === log_opt.id ? 'login_opt_selected' : ''}
            >
              {log_opt.name}
            </h3>
          ))}
        </div>
        <form className="login_form" onSubmit={handleSubmit}>
          {renderFormFields()}
        </form>
      </div>
    </div>
  )
}
