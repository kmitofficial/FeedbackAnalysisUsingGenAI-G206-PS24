import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';
import { RxCross1 } from "react-icons/rx";
import { toast } from 'react-hot-toast';

const ForgotPassword = ({ setShowForgotPassword }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7000/api/users/forgot-password', { email });

      if (response.data.success) {
        toast.success(response.data.message);
        setShowForgotPassword(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('An error occurred.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <span onClick={() => setShowForgotPassword(false)} className="cross">
        <RxCross1 />
      </span>
      <form className="forgot-password-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="forgot-email">Enter your email:</label>
          <input
            type="email"
            id="forgot-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="forgot-password-button">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
