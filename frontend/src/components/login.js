import { useState } from 'react';

export default function Login(props){
    const login = props.list;

    const [selectedLogOpt, setSelectedLogOpt] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");

    const handleUsernameChange = (event) => {
      if(event.target) setUsername(event.target.value)
    }
    const handleLogOptClick = (log_opt_id) => {
      setSelectedLogOpt(log_opt_id);
      setShowPassword(false);
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      props.onLogin(username);
    }

    const renderFormFields = () => {
        switch(selectedLogOpt) {
            case 1:
                return (
                    <>
                      <label>
                            First Name:
                            <input type="text" name="fname" className="common_input" required />
                        </label>
                        <label>
                            Middle Name:
                            <input type="text" name="mname" className="common_input" />
                        </label>
                        <label>
                            Last Name:
                            <input type="text" name="lname" className="common_input" required 
                            onChange={handleUsernameChange}/>
                        </label>
                        <label>
                            Username:
                            <input type="text" name="username" className="common_input" required />
                        </label>
                        <label>
                          Email:
                          <input type="email" name="email" className="common_input" required />
                        </label>
                        <label>
                          Address:
                          <input type="address" name="address" className="common_input" required />
                        </label>
                        <label>
                            Password:
                            <input type={showPassword ? "text" : "password"} name="password" className="common_input" required />
                        </label>
                        <div className="showPass">
                          <span>Show password</span>
                          <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />
                        </div>
                        {/* <div className="checkboxInput">
                          <span>Signing up as a seller?</span>
                          <input type="checkbox" name="isMerchant" />
                        </div> */}
                        <input type="submit" value="Submit" className="submit" />
                    </>
                );
            case 2:
                return (
                    <>
                        <label>
                            Email:
                            <input type="email" name="email" className="common_input" required />
                        </label>
                        <label>
                            Password:
                            <input type={showPassword ? "text" : "password"} name="password" className="common_input" required />
                        </label>
                        <div className="showPass">
                          <span>Show password</span>
                          <input type="checkbox" onChange={() => setShowPassword(!showPassword)} />
                        </div>
                        <input type="submit" value="Submit" className="submit"/>
                    </>
                );
            default:
                return (
                  <>
                    <p className="initial_login_opt">
                      Choose a login option
                    </p>
                  </>
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
                className={selectedLogOpt === log_opt.id ? 'login_opt_selected' : ''
                }> 
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
};