import React from 'react';
import './Section0.css'; // Add your CSS file

const Section0 = () => {
  return (
    <div className="about-us-container" id='about'>
      <h1 className="about-us-heading">Who We Are?</h1>

      <div className="about-us-main">
        <div className="about-us-left">
          <h2>About Feedback Analysis</h2>
          <p>
            We specialize in analyzing feedback from various sources to help businesses improve their products and services. Our platform helps you make informed decisions based on customer reviews and insights.
          </p>
          
          <h3>Our Users:</h3>
          <div className="user-types">
            <div className="user-type">
              <h4>For Product Sellers</h4>
              <p>
                Gain valuable insights on how your products are perceived by customers, helping you enhance your offerings and better cater to market demands.
              </p>
            </div>
            <div className="user-type">
              <h4>For Product Buyers</h4>
              <p>
                Make more informed purchasing decisions by relying on detailed feedback from other users, ensuring you buy the best products suited to your needs.
              </p>
            </div>
          </div>
        </div>

        <div className="about-us-right">
          <img src="https://getthematic.com/insights/content/images/wordpress/2018/12/rendered.jpg" alt="Feedback Analysis" />
        </div>
      </div>
    </div>
  );
};

export default Section0;
