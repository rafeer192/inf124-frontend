import React, { useState, useContext, useEffect } from 'react';
import { AccountContext } from '../../components/AccountContext';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import LogoLink from '../../components/LogoLink';
import '../../styles/LoginPage.css'; 

const LoginPage = () => {
    const navigate = useNavigate();
    const { setUser, user } = useContext(AccountContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.loggedIn) {
            navigate('/userhome');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const API_URL = process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await fetch(`${API_URL}/auth/login`, { // fetch express server
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.loggedIn) {
                setUser({
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    loggedIn: true
                });
                // Don't call navigate here
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Server Error');
        }
    };



    return (
    <div className='login-container'>
        <div className='logo-form'><LogoLink /></div>
        <form onSubmit={handleSubmit}>
            <h1> Login for financial services </h1>

            {/* Error Message */}
            {error && (
                <div className="error-message" style={{ 
                    color: 'red', 
                    textAlign: 'center', 
                    marginBottom: '10px' 
                }}>
                    Invalid email or password
                </div>
            )}

            {/* EMAIL INPUT */}
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input 
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email*"
                className="input-field"
                required
                />
            </div>

            {/* PASSWORD INPUT */}
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-field"
                required
                />
            </div>

            <p className="forgot-password">
                <Link to="/contact">Forgot password?</Link>
            </p>

            <button type="submit" className="login-button">Login</button>
        </form>

        <p>Dont have an account? <Link to='/register'>Sign up</Link> </p> 
        <div className='footer-links'> 
            <Link to='/contact'> Help</Link> 
            <Link to='/terms'> Terms</Link>
            <Link to='/'> About Us</Link>
        </div>
    </div>
    );
};
export default LoginPage;
