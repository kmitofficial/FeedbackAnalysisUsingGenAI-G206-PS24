import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const OtpSubmit = ({ data, setOtpCard, setShowSignup, setShowLogin }) => {
  const [otp, setOtp] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7000/api/users/signup', {
        ...data,
        otp
      });
      console.log('OTP verification successful:', response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        setOtpCard(false);
        setShowSignup(false);
        setShowLogin(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const response = await axios.post('http://localhost:7000/api/users/sendotp', {
        email: data.email
      });
      if (response.data.success) {
        toast.success("OTP resent successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '50px', minHeight: '300px', gap: '20px' }}>
      <h1>Please Verify Your Email</h1>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        style={{ padding: '10px', fontSize: '16px', marginBottom: '20px', width: '200px', textAlign: 'center' }}
      />
      <button onClick={handleSubmit} style={{ backgroundColor: 'aqua', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Submit OTP
      </button>

      <button
        onClick={handleResendOtp}
        style={{ backgroundColor: 'aqua', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        disabled={isResending}
      >
        {isResending ? "Resending OTP..." : "Resend OTP"}
      </button>
    </div>
  );
};

export default OtpSubmit;
