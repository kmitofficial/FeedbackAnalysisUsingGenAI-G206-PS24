import React from 'react';
import './Error.css';
import { Link } from 'react-router-dom';

const Error = () => {
  return (
    <div className="error-page">
      <div className="error-container">
        <h1 className="error-title">404</h1>
        <p className="error-message">Oops! Page not found</p>
        <p className="error-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="back-home-btn">Go to Homepage</Link>
      </div>
    </div>
  );
};

export default Error;
