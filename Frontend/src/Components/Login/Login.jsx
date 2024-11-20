import React, { useState } from 'react';
import axios from 'axios';  // Import axios
import './Login.css';
import { RxCross1 } from "react-icons/rx";
import {toast} from 'react-hot-toast'
import {useDispatch} from 'react-redux'
import { setToken } from '../../Slices/authSlice';
const Login = ({ setShowLogin, setShowSignup }) => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //usedispatch
  const dispatch=useDispatch() 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    try {
      // Send login data to the backend
      const response = await axios.post('http://localhost:7000/api/users/login', {
        email,
        password
      });

      // Handle the response (e.g., store token, navigate, etc.)
      console.log('Login successful:', response.data);

      if(response.data.success)
      {
        toast.success(response.data.message)
        console.log(response.data)
        dispatch(setToken(response.data.token))
        localStorage.setItem('token', JSON.stringify(response.data.token));
        setShowLogin(false);

      }
      else{
        toast.error(response.data.message)
      }

    } catch (error) {
      console.error('Login failed:', error);
      // Handle errors, show messages, etc.
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <span onClick={() => setShowLogin(false)} className='cross'><RxCross1 /></span>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="eml">Email:</label>
          <input
            type="email"
            id="eml"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
        <a href="#forgot-password" className="forgot-password">Forgot Password?</a>
      </form>
      <p className="signup-link" onClick={() => setShowSignup(true)}>
        Don't have an account? <span>Sign Up</span>
      </p>
    </div>
  );
};

export default Login;
