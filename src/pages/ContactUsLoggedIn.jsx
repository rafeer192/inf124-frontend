import React, { useState, useContext } from "react";
import HeaderBar from '../components/HeaderBar';
import { AccountContext } from '../components/AccountContext';

export default function ContactUs() {
  // personal info from db
  const { user } = useContext(AccountContext);
  const fullName = `${user?.firstName} ${user?.lastName}`;
  return (
    <div>
      <HeaderBar userName={fullName} />
      
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ marginBottom: "2rem", textAlign: "center" }}>Contact Us</h1>

        {/* Contact Details */}
        <div style={{ marginBottom: "2rem" }}>
          <p>
              <strong>📞 Phone:</strong>{" "}
              <a href="tel:+15551234567" style={{ color: "#4f46e5", textDecoration: "none" }}>
              +1 (555) 123-4567
              </a>
          </p>
          <p>
              <strong>📧 Email:</strong>{" "}
              <a href="mailto:support@example.com" style={{ color: "#4f46e5", textDecoration: "none" }}>
              support@example.com
              </a>
          </p>
          <p>
              <strong>📠 Fax:</strong>{" "}
              <a href="tel:+15559876543" style={{ color: "#4f46e5", textDecoration: "none" }}>
              +1 (555) 987-6543
              </a>
          </p>
          </div>


        {/* FAQ Section */}
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Frequently Asked Questions</h2>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Q: How do I reset my password?</strong>
            <p>A: Click our email (support@example.com) above and send us an email with “Forgot Password” as the subject. Our technical support team will help you right away!</p>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Q: Can I update my profile information?</strong>
            <p>A: Yes! Go to your Profile page and click the ✏️ icon next to the information you want to update.</p>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <strong>Q: How do I add or withdraw funds?</strong>
            <p>A: Visit your Profile page and use the Add/Withdraw buttons under the Funding section.</p>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <br/>
            <br/>
            <br/>
            <p>All investing involves risk, including the loss of principal. Individual holdings include securities and related products offered by registered broker-dealer Green Wave Financial LLC, member SIPC. Managed holdings include securities managed by Green Wave Asset Management, LLC, an SEC-registered investment advisor. Crypto holdings are offered by Green Wave Crypto, LLC, are not securities, and are not covered by SIPC. Green Wave Crypto holdings are not offered by Green Wave's broker-dealer and are therefore not subject to the same regulatory protections as those offered by Green Wave Financial. Green Wave Money, LLC is a licensed money transmitter (NMLS ID: 1990968) Green Wave Entity Disclosures.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
