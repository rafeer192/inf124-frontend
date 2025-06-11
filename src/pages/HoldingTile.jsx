import React from 'react';
import '../styles/Tile.css';

export default function HoldingTile({ customHoldings = [] }) {
  return (
    <div className="tile">
      <h3>Your Holding Updates</h3>

      {customHoldings.length === 0 ? (
        <p>No holdings yet.</p>
      ) : (
        <>
          {/* Column headers */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              borderBottom: "2px solid #ccc",
              paddingBottom: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ width: "50%" }}>Company</span>
            <span style={{ width: "50%", textAlign: "right" }}>Your Holding</span>
          </div>

          {/* Holdings list */}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {customHoldings.map((item, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid #eee",
                  fontSize: "1rem",
                }}
              >
                <span style={{ width: "33%" }}>{item.ticker}</span>

                <span style={{ width: "33%", textAlign: "right" }}>
                  {parseFloat(item.amountowned).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
