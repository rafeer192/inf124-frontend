import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import sampleProfilPic from '../assets/petr.png';
import HeaderBar from "../components/HeaderBar";
import { AccountContext } from '../components/AccountContext';

export default function UserProfile() {
  const navigate = useNavigate();
  // get personal info from db
  const { user } = useContext(AccountContext);
  const fullName = `${user?.firstName} ${user?.lastName}`;
  const email = `${user?.email}`;

  const [profilePic, setProfilePic] = useState(null);
  const [name, setName] = useState(fullName);
  const [contact, setContact] = useState(email);
  const [funding, setFunding] = useState(2450.75);
  const [transactions, setTransactions] = useState([
    { date: "2025-05-01", detail: "Added $500", amount: 500 },
    { date: "2025-04-20", detail: "Spent on Goal A", amount: -150 },
    { date: "2025-04-10", detail: "Added $300", amount: 300 },
  ]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingFunding, setIsEditingFunding] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSignOut = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) { // good log out
        setTimeout(() => {
          navigate('/');
        }, 100);

      } else { // log out fail 
        console.error("Logout failed");
      }
    } catch (error) { // check server "npm run dev"
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
    <HeaderBar userName={fullName} />
    <div
      style={{
        display: "flex",
        padding: "2rem",
        height: "100vh",
        boxSizing: "border-box",
        backgroundColor: "#f7f7f7",
      }}
    >
      {/* Left: Profile Info */}
      <div style={{ flex: 1, marginRight: "2rem" }}>
        <div style={{ marginTop: "4rem", marginBottom: "2rem", textAlign: "center" }}>
          <label htmlFor="profilePic" style={{ display: "inline-block", cursor: "pointer" }}>
            <img
              src={profilePic || sampleProfilPic}
              alt="Profile"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid #ccc",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
            />
          </label>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            onChange={handlePicChange}
            style={{ display: "none" }}
          />
        </div>

        {/* User ID */}
        <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontWeight: "bold" }}>User ID:</label>
            <div
                style={{
                marginTop: "0.25rem",
                fontWeight: "bold",
                fontSize: "1.2rem",
                }}
            >
                P007X6D446
            </div>
            </div>

        {/* Name */}
        <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontWeight: "bold" }}>Name:</label>
        {isEditingName ? (
            <input
            type="text"
            value={name}
            autoFocus
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingName(false);
            }}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
        ) : (
            <div style={{ display: "flex", alignItems: "center", marginTop: "0.25rem" }}>
            <span style={{ flex: 1 }}>{name}</span>
            <button
                onClick={() => setIsEditingName(true)}
                style={{
                marginLeft: "0.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#4f46e5",
                }}
            >
                ✏️
            </button>
            </div>
        )}
        </div>

        {/* Contact */}
        <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontWeight: "bold" }}>Contact:</label>
        {isEditingContact ? (
            <input
            type="text"
            value={contact}
            autoFocus
            onBlur={() => setIsEditingContact(false)}
            onKeyDown={(e) => {
                if (e.key === "Enter") setIsEditingContact(false);
            }}
            onChange={(e) => setContact(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
        ) : (
            <div style={{ display: "flex", alignItems: "center", marginTop: "0.25rem" }}>
            <span style={{ flex: 1 }}>{contact}</span>
            <button
                onClick={() => setIsEditingContact(true)}
                style={{
                marginLeft: "0.5rem",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#4f46e5",
                }}
            >
                ✏️
            </button>
            </div>
        )}
        </div>

        {/* View Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
            style={{
            padding: "0.35rem 0.75rem",
            fontSize: "0.9rem",
            backgroundColor: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            }}
            onClick={() => alert("View Stock clicked")}
        >
            View Stock
        </button>

        <button
            style={{
            padding: "0.35rem 0.75rem",
            fontSize: "0.9rem",
            backgroundColor: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            }}
            onClick={() => alert("View Crypto clicked")}
        >
            View Crypto
        </button>
        </div>

        {/* Holding button */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0 rem" }}>
        <button
            style={{
            padding: "0.50rem 2rem",
            fontSize: "0.9rem",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            }}
            onClick={() => setShowModal(true)}
        >
            My Holding
        </button>
        </div>

        {showModal && (
            <div style={{
                position: "fixed",
                top: 0, left: 0,
                width: "100%", height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}>
                <div style={{
                background: "#fff",
                padding: "2rem",
                borderRadius: "8px",
                minWidth: "300px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
                }}>
                <h2>My Holdings</h2>
                <p>This is the content of your holding popup.</p>
                <button onClick={() => setShowModal(false)} style={{
                    marginTop: "1rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#f44336",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}>
                    Close
                </button>
                </div>
            </div>
            )}


            
        {/* Update Profile Button */}
        <button
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#2196f3",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Update Profile
        </button>

        {/* Sign Out button */}
        <button
          style={{
            marginTop: "1rem",
            marginLeft: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#f44336",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>

      {/* Right: Activity/Transactions */}
      <div
        style={{
          flex: 2,
          backgroundColor: "#fff",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>Recent Activity</h2>
        {transactions.length === 0 ? (
          <p>No recent transactions.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {transactions.map((tx, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "0.75rem",
                  padding: "0.5rem",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong>{tx.date}</strong>: {tx.detail} —{" "}
                <span style={{ color: tx.amount < 0 ? "red" : "green" }}>
                  {tx.amount < 0 ? "-" : "+"}${Math.abs(tx.amount).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
}
