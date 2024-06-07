import React, { useState } from 'react';
import './LogSign.css';
import './SignUpPage.css';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
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

        let body = {
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: password
        };

        if (middlename) {
            body.middleName = middlename;
        }

        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body),
                credentials: 'include'
            })

            const data = await response.json();
            const statuscode = data.status;

            if(statuscode < 200 || statuscode >= 300) {
                alert(`Error: ${data.detail}`);
            } else {
                alert('Signup successful');
                navigate('/user-home');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred. Please try again.');
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
                    <div className='login-elems' >
                        <p className='login'>Already have an account? </p>
                        <p className='login-link' onClick={handleLogin}>login here</p>
                    </div>
                    <button className='submit' type="submit">Signup</button>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;
