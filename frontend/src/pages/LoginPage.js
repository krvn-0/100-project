import React, { useState } from 'react';
import './LoginPage.css';
import './LogSign.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const clearForm = () => {
        setEmail('');
        setPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body:  JSON.stringify({ 
                    email: email,
                    password: password
                }),
                credentials: 'include'
            })

            const data = await response.json();
            const statuscode = data.status;

            if(statuscode < 200 || statuscode >= 300) {
                alert(`Error: ${data.detail}`);
            } else {
                sessionStorage.setItem('userID', data.id);
                sessionStorage.setItem('isAdmin', JSON.stringify(data.isMerchant));
                alert('Login successful');
                navigate('/user-home');
            }

        } catch (error) {
            console.error('An error occurred:', error);
        }
        clearForm();
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className='auth-form'>
            <div className='auth-body'>
                <div className='auth-header'>
                    <h1 className='login-title'>Login</h1>
                </div>
                <form className='form' onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        value={email} 
                        placeholder='Email' 
                        onChange={handleEmailChange} 
                        required 
                        className='email-input' 
                    />
                    <div className='password-input-container'>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password} 
                            placeholder='Password' 
                            onChange={handlePasswordChange} 
                            required 
                            className='password-input' 
                        />
                        <button 
                            type="button" 
                            className='toggle-password' 
                            onClick={handleTogglePassword}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div className='sign-up-elems' >
                        <p className='sign-up'>Don't have an account yet? </p>
                        <p className='sign-up-link' onClick={handleSignUpClick}>sign up here</p>
                    </div>
                    <button className='submit' type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;