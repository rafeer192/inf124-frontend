import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutUs.css'; // Assuming you will create styles in this file

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <h1>Welcome to GreenWave!</h1>
        <p className="intro-text">
          GreenWave is your one-stop solution for managing investments in stocks, crypto, and more. Whether you’re new to investing or a seasoned pro, our platform provides the tools you need to succeed. 
        </p>
        
        <p className="info-text">
          Our goal is to help you achieve your financial aspirations with easy-to-use features, transparent services, and secure transactions. Join thousands of other users who trust GreenWave for their financial journey.
        </p>
        
        <div className="cta-buttons">
          <Link to="/login" className="cta-button login-btn">Login</Link>
          <Link to="/register" className="cta-button register-btn">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
