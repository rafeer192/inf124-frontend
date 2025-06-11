import React, { useState, useContext } from 'react'; //useState automatically re renders changes
import { AccountContext } from '../../components/AccountContext';
import { Link, useNavigate } from 'react-router-dom';
import LogoLink from '../../components/LogoLink';
import '../../styles/RegisterPage.css'; 
const RegisterPage = () => {
    const { setUser } = useContext(AccountContext);
    const navigate = useNavigate(); 
    const [formData,setFormData] = useState({
        firstName: '',
        lastName:'',
        email: '',
        password: '',
        state: '',
        agreeToTerms: false
    });
    //list of options for dropdown menu 
    const states = [
        'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
        'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
        'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
        'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
        'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
        'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
        'West Virginia', 'Wisconsin', 'Wyoming'
      ];
      
      //changes form data, "name" can be emails value will be changed etc
      const handleChange = (event) => {
        const { name,type, value, checked } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
      };
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const handleSubmit = async (event) => {
        event.preventDefault();

        // get user data: email, password, first & last name, state
        // pass is not encrypted as it is an input
        const userData = {
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            state: formData.state
        };

        try {
            const response = await fetch("https://inf124-backend-production.up.railway.app/auth/register", { // fetch express server
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // include cookies
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            // if registration is good, send to /userhome
            if (response.ok && data.loggedIn) {
                // Update the user context with data to customize
                await setUser({
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    loggedIn: true
                });
                
                navigate('/userhome');
            } else { // bad registration 
                alert(data.status || 'Registration Failed');
            }
        }
        catch (err) { // express server not connected, check "npm run dev"
            alert('Server error: ' + err.message);
        }
    };
    return (
        <div className='register-container'>
            <div className='logo-container'>
                <LogoLink />
            </div>
            <h1>Let's get started</h1>
            <form onSubmit={handleSubmit} className='register-form'>
            <div className='form-row'>
                <div className='form-group'>
                <label htmlFor='firstName'>First Name</label>
                <input
                    type='text'
                    id='firstName'
                    name='firstName'
                    className='form-input'
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder='Legal first name'
                />
                </div>
                <div className='form-group'>
                <label htmlFor='lastName'>Last Name</label>
                <input
                    type='text'
                    id='lastName'
                    name='lastName'
                    className='form-input'
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder='Legal last name'
                />
                </div>
            </div>

            <div className='form-group'>
                <label htmlFor='state'>State</label>
                <select
                id='state'
                name='state'
                className='form-input'
                value={formData.state}
                onChange={handleChange}
                required
                >
                <option value=''>Select a state</option>
                {states.map((state) => (
                    <option key={state} value={state}>
                    {state}
                    </option>
                ))}
                </select>
            </div>

            <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <input
                type='email'
                id='email'
                name='email'
                className='form-input'
                value={formData.email}
                onChange={handleChange}
                required
                placeholder='Email'
                />
            </div>

            <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <input
                type='password'
                id='password'
                name='password'
                className='form-input'
                value={formData.password}
                onChange={handleChange}
                required
                placeholder='Password'
                />
            </div>

            <div className='form-group'>
                <label htmlFor='agreeToTerms' className='checkbox-label'>
                <input 
                    type='checkbox' 
                    id='agreeToTerms'
                    name='agreeToTerms'
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                />
                <span>
                    I agree to GreenWaves’s <Link to='/terms'>Terms and Conditions</Link>
                </span>
                </label>
            </div>

            <button type='submit'>Sign up</button>
            </form>

            <p className='login-route'> Already have an account? <Link to='/login'>Login</Link></p>
        </div>
    );
};
export default RegisterPage;