// File: complaint-registery/frontend/src/components/user/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Footer from '../common/FooterC';
import Complaint from './Complaint';
import Status from './Status';
// import CustomNavbar from '../common/CustomNavbar';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState('Complaint');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(user.name);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleNavLinkClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <>
      {/* <CustomNavbar /> */}
      <div className="container my-4">
        <h3>Welcome, {userName}!</h3>
        <div className="btn-group my-3">
          <button
            className={`btn btn-outline-primary ${activeComponent === 'Complaint' ? 'active' : ''}`}
            onClick={() => handleNavLinkClick('Complaint')}
          >
            📝 Register Complaint
          </button>
          <button
            className={`btn btn-outline-secondary ${activeComponent === 'Status' ? 'active' : ''}`}
            onClick={() => handleNavLinkClick('Status')}
          >
            📋 View Status
          </button>
        </div>

        <div className="component-area">
          {activeComponent === 'Complaint' && <Complaint />}
          {activeComponent === 'Status' && <Status />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
