import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaUserCircle } from 'react-icons/fa';
import '../styles/HeaderBar.css';

export default function HeaderBar({ userName }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleHamburgerClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMenuClick = (path) => {
    setIsDropdownOpen(false); // Close dropdown after navigating
    navigate(path);
  };

  return (
    <header className="header-bar">
      <div className="hamburger-icon" onClick={handleHamburgerClick}>
        <FaBars />
      </div>
      <div className="user-profile-wrapper">
        <h2 className="header-username">{userName}</h2>
        <div className="profile-icon" onClick={() => navigate('/profile')}>
          <FaUserCircle />
        </div>
      </div>

      {/* Simple Dropdown */}
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={() => handleMenuClick('/userhome')}>Home</div>
          <div className="dropdown-item" onClick={() => handleMenuClick('/stocks')}>Stocks</div>
          <div className="dropdown-item" onClick={() => handleMenuClick('/crypto')}>Crypto</div>
          <div className="dropdown-item" onClick={() => handleMenuClick('/goal')}>Goals</div>
          <div className="dropdown-item" onClick={() => handleMenuClick('/contactloggedin')}>Contact Us</div>
        </div>
      )}
    </header>
  );
}
