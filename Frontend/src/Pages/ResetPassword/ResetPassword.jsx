import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // React Router hooks
import { toast } from 'react-hot-toast';
import './RestPassword.css';

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      const response = await axios.post(`http://localhost:7000/api/users/reset-password/${token}`, {
        password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login'); // Redirect to login page
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form className="reset-password-form" onSubmit={handleResetPassword}>
        <div className="input-group">
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="reset-password-button">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
