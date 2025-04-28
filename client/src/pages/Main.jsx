import React, { useState } from 'react';
import './Main.css';  // Import the CSS file
import EmailOtpVerification from './EmailOtpVerification';
import MobileOtpLogin from './MobileOtpLogin';

const MainPage = () => {
  // State to manage which button is active
  const [activeComponent, setActiveComponent] = useState('Email');

  // Handler to set active component
  const handleButtonClick = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="container">
      <div className="button-container">
        <button
          className={`button ${activeComponent === 'Email' ? 'active' : 'inactive'}`}
          onClick={() => handleButtonClick('Email')}
        >
          Email
        </button>
        <button
          className={`button ${activeComponent === 'Mobile' ? 'active' : 'inactive'}`}
          onClick={() => handleButtonClick('Mobile')}
        >
          Mobile
        </button>
      </div>

      <div>
        {activeComponent === 'Email' ? <EmailOtpVerification /> : <MobileOtpLogin />}
      </div>
    </div>
  );
};

export default MainPage;
