import React, { useState } from 'react';
import './LogSign.css';
import './SignUpPage.css';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handlefirstnameChange = (e) => {
        setFirstname(e.target.value);
    }

    const handlelastnameChange = (e) => {
        setLastname(e.target.value);
    }

    const handlemiddlenameChange = (e) => {
        setMiddlename(e.target.value);
    }
    
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

    const handleLogin = () => {
        navigate('/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    firstname: firstname,
                    lastname: lastname,
                    middlename: middlename ? middlename : null,
                    email: email,
                    password: password
                }),
                credentials: 'include'
            })

            const data = await response.json();
            console.log(data);

            if(data.error) {
                alert(data.error);
            } 
            else {
                console.log(data.error);
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred. Please try again.');
        }
        
        // Perform login logic here
        if (email && password) {
            // Valid email and password, proceed with login
            console.log('Login successful');
        } else {
            // Invalid email or password, show error message
            console.log('Invalid email or password');
        }
        clearForm();
    };

    return (
        <div className='auth-form'>
            <div className='auth-body'>
                <div className='auth-header'>
                    <h1 className='signup-title'>Sign Up</h1>
                </div>
                <form className='form' onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        value={firstname} 
                        placeholder='First Name' 
                        onChange={handlefirstnameChange} 
                        required 
                        className='fname-input' 
                    />
                    <input 
                        type="text" 
                        value={middlename} 
                        placeholder='Middle Name' 
                        onChange={handlemiddlenameChange} 
                        className='mname-input' 
                    />
                    <input 
                        type="text" 
                        value={lastname} 
                        placeholder='Last Name' 
                        onChange={handlelastnameChange} 
                        required 
                        className='lname-input' 
                    />
                    <input 
                        type="email" 
                        value={email} 
                        placeholder='Email' 
                        onChange={handleEmailChange} 
                        required 
                        className='email-input'
                    />
                    <input 
                        type="password" 
                        value={password} 
                        placeholder='Password' 
                        onChange={handlePasswordChange} 
                        required 
                        className='password-input' 
                    />
                    <div className='login-elems' >
                        <p className='login'>Already have an account? </p>
                        <p className='login-link' onClick={handleLogin}>login here</p>
                    </div>
                    <button className='submit' type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;