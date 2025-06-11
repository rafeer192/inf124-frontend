import React, { useState } from 'react';
import '../styles/TermsAndConditions.scss';

export default function TermsAndConditions() {
  return (
    <div className="terms">
      <div className="terms__card">
        
        
        {/* CONTENTS */}
        <div className="terms__content">
          <h1 className="terms__title">Terms and Conditions</h1>
          <p className="terms__subtitle">Last updated: May 4, 2025</p>

          <div className="terms__introduction">
            <p>Please read these Terms and Conditions carefully before using our financial services platform. By accessing or using our platform, you agree to be bound by these Terms.</p>
          </div>

          {/* COPYRIGHT */}
          <div className="terms__section">
            <div className="terms__section-header">
              <h2>Copyright</h2>
            </div>
            <div className="terms__section-content">
                <p>All content is property of our company, such as text, graphics, software, images, etc...</p>
            </div>
          </div>

          {/* LICENSE */}
          <div className="terms__section">
            <div className="terms__section-header">
              <h2>License</h2>
            </div>
            <div className="terms__section-content">
              <p>Our company gives you a limited, non-exclusive, non-transferable license to access and make financial purchases...</p>
            </div>
          </div>

          {/* YOUR ACCOUNT */}
          <div className="terms__section">
            <div className="terms__section-header">
              <h2>Your Account</h2>
            </div>
            <div className="terms__section-content">
                <p>You need to own an account to use our services. You must be 18+ and are responsible for your account...</p>
            </div>
          </div>

          {/* INTELLECTUAL PROPERTY */}
          <div className="terms__section">
            <div className="terms__section-header">
              <h2>Intellectual Property</h2>
            </div>
            <div className="terms__section-content">
                <p>Our company owns the intellectual property of this website, including but not limited to...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}