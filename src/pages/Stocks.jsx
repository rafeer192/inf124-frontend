import React, { useState, useEffect, useContext } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import HeaderBar from "../components/HeaderBar";
import "../styles/Crypto.css";
import { AccountContext } from "../components/AccountContext";

const API_KEY = "74a27c82d2a74e1b8544353c5b66ddd3";

const Stocks = ({ customHoldings, setCustomHoldings }) => {
  const [searchInput, setSearchInput] = useState("");
  const [stockSymbol, setStockSymbol] = useState("AAPL");
  const [stockData, setStockData] = useState([]);
  const [metaData, setMetaData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newNote, setNewNote] = useState("");
  const [companySuggestions, setCompanySuggestions] = useState([]);

  // personal info from db
  const { user } = useContext(AccountContext);
  const fullName = `${user?.firstName} ${user?.lastName}`;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCompanySuggestions = async (query) => {
    if (!query) {
      setCompanySuggestions([]);
      return;
    }
  
    try {
      const res = await fetch(
        `https://api.twelvedata.com/symbol_search?symbol=${query}&apikey=${API_KEY}`
      );
      const data = await res.json();
  
      if (data?.data) {
        const input = query.toUpperCase();
  
        const cleanSuggestions = data.data
          .filter(item =>
            item.symbol &&
            item.symbol.toUpperCase().startsWith(input) &&
            item.exchange &&
            /^[A-Z]+$/.test(item.symbol)
          )
          .map(item => ({ symbol: item.symbol.toUpperCase() }));
  
        // Remove duplicates
        const seen = new Set();
        const uniqueSuggestions = cleanSuggestions.filter(item => {
          if (seen.has(item.symbol)) return false;
          seen.add(item.symbol);
          return true;
        });
  
        setCompanySuggestions(uniqueSuggestions.slice(0, 5));
      } else {
        setCompanySuggestions([]);
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setCompanySuggestions([]);
    }
  };
  
  useEffect(() => {
    fetchStockData(stockSymbol);
  }, [stockSymbol]);

  const fetchStockData = async (symbol) => {
    setErrorMessage("");
    try {
      const timeRes = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${API_KEY}`
      );
      const timeData = await timeRes.json();
      if (timeData.status === "error") {
        setErrorMessage(timeData.message || "Error fetching stock data.");
        setStockData([]);
        setMetaData(null);
        return;
      }
      const chartData = timeData.values.reverse().map((entry) => ({
        date: entry.datetime,
        price: parseFloat(entry.close),
      }));
      setStockData(chartData);

      const quoteRes = await fetch(
        `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`
      );
      const quoteData = await quoteRes.json();

      setMetaData({
        name: quoteData.name,
        exchange: quoteData.exchange,
        currency: quoteData.currency,
      });
    } catch (error) {
      setErrorMessage("Network error. Please try again later.");
      console.error("Fetch error:", error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchInput.trim() !== '') {
      setStockSymbol(searchInput.toUpperCase());
      setSearchInput("");
    }
  };
  const showUserHoldings = async() => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stocks`, {
        credentials: "include", // Essential for sending session cookies
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json(); // Array of { ticker, amountowned, notes }
        console.log(data);
        setCustomHoldings(data);
        setShowModal(true);
      } else if (response.status === 401) {
        console.log("Not authenticated to fetch holdings. Please log in.");
        setCustomHoldings([]); // Clear any old holdings if session expired
      } else {
        const errorText = await response.text(); // Get more specific error from backend
        console.error("Failed to fetch user holdings:", response.status, errorText);
        setErrorMessage(`Failed to load your holdings: ${errorText}`);
      }
      } catch (error) {
        console.error("Network error fetching holdings:", error);
        setErrorMessage("Network error fetching your holdings.");
      }
  }

  return (
    <div>
      <HeaderBar userName={fullName} />
      <div className="dashboard">
        <label htmlFor='searchStock'>Search Stock</label>
        <input
          id='searchStock'
          type="text"
          placeholder="Search Stocks (e.g., AAPL)"
          className="search-bar"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearch}
        />
        <div className="info">
          <h2>{metaData ? `${metaData.name} (${stockSymbol})` : stockSymbol}</h2>
          {stockData.length > 0 && (
            <p>Latest closing price: <strong>${stockData[stockData.length - 1].price.toFixed(2)}</strong></p>
          )}
          {metaData && (
            <>
              <p>Exchange: {metaData.exchange}</p>
              <p>Currency: {metaData.currency}</p>
            </>
          )}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
        <div className="chart">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockData}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <CartesianGrid stroke="#ccc" />
              <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="holdings">
          <button
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={showUserHoldings}
          >
            My Holdings
          </button>
        </div>
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
            width: "600px",
            maxWidth: "90vw",
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            maxHeight: "90vh",
            overflowY: "auto",
          }}>

            <h2>Add or View Holding</h2>

            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL)"
                value={searchInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchInput(val);
                  setNewSymbol(val);
                  fetchCompanySuggestions(val);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setStockSymbol(searchInput.toUpperCase());
                    setCompanySuggestions([]);
                  }
                }}
                style={{
                  padding: "0.5rem",
                  fontSize: "1rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  width: "100%",          
                  boxSizing: "border-box",
                  display: "block",
                }}
              />

              {companySuggestions.length > 0 && (
                <ul
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    zIndex: 1000,
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}
                >
                  {companySuggestions.map((item) => (
                    <li
                      key={item.symbol}
                      onClick={() => {
                        setStockSymbol(item.symbol);
                        setNewSymbol(item.symbol); 
                        setSearchInput(item.symbol);
                        setCompanySuggestions([]);
                      }}
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {item.symbol}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <input
              type="number"
              placeholder="Enter amount you own"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            <textarea
              placeholder="Notes or expectations (optional)"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={3}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />

            <button onClick={async () => {
              if (newSymbol && newAmount) {
                const symbol = newSymbol.toUpperCase();
                const amount = parseFloat(newAmount);

                // Basic validation
                if (isNaN(amount) || amount <= 0) {
                  alert("Please enter a valid positive amount.");
                  return;
                }

                try {
                  // 1. Fetch current price from Twelve Data API (for frontend display)
                  const quoteRes = await fetch(
                    `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`
                  );
                  const quoteData = await quoteRes.json();

                  if (!quoteData.close || quoteData.status === "error") {
                    alert("Failed to fetch current price for symbol: " + symbol + ". Please check the symbol.");
                    return;
                  }
                  const currentPrice = parseFloat(quoteData.close);

                  // 2. Send data to backend API
                  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stocks`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      ticker: symbol,
                      amountowned: amount,
                      notes: newNote,
                    }),
                    credentials: "include", // Crucial for sending session cookies
                  });

                  if (response.ok) {
                    const addedHolding = await response.json(); // The backend returns the new record
                    setCustomHoldings([
                      ...customHoldings,
                      {
                        symbol: addedHolding.ticker,
                        amount: addedHolding.amountowned,
                        note: addedHolding.notes, // Ensure notes are also carried over if the backend returns them
                      },
                    ]);
                    // Clear input fields after successful addition
                    setNewSymbol("");
                    setNewAmount("");
                    setNewNote("");
                    setSearchInput("");
                    setCompanySuggestions([]); // Clear suggestions
                  } else {
                    const errorData = await response.json();
                    alert(`Failed to add holding: ${errorData.error || response.statusText}`);
                  }
                } catch (error) {
                  alert("Network or server error. Please try again.");
                  console.error("Error adding holding:", error);
                }
              } else {
                alert("Please enter both a symbol and amount.");
              }
            }}
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#2196f3",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Add Holding
            </button>

            <h3>Your Current Holdings</h3>
            {customHoldings.length === 0 && <p>No holdings added yet.</p>}

            {/* Header row */}
            {customHoldings.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.5rem 0",
                  fontWeight: "bold",
                  borderBottom: "2px solid #ccc",
                  fontSize: "1rem",
                  gap: "0.5rem",
                }}
              >
                <div style={{ width: "25%" }}>Stock Symbol</div>
                <div style={{ width: "25%", textAlign: "center" }}>Shares Owned</div>
                <div style={{ width: "25%", textAlign: "right" }}>Actions</div>
              </div>
            )}

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {customHoldings.map((item, index) => {

                return (
                  <EditableHoldingItem
                    key={index}
                    item={item}
                    index={index}
                    customHoldings={customHoldings}
                    setCustomHoldings={setCustomHoldings}
                  />
                );
              })}
            </ul>

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#e53935",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function EditableHoldingItem({ item, index, customHoldings, setCustomHoldings }) {
  const [editedAmount, setEditedAmount] = useState(item.amountowned.toString());
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    // Reset local edited state if external holdings change for this item
    console.log(item);
    setEditedAmount(item.amountowned.toString());
    setIsEdited(false);
  }, [item.amountowned]);

  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 0",
        borderBottom: "1px solid #eee",
        fontSize: "1rem",
        gap: "0.5rem",
      }}
    >
      <span style={{ width: "25%" }}>{item.ticker}</span>

      <input
        type="number"
        value={editedAmount}
        onChange={(e) => {
          const val = e.target.value;
          setEditedAmount(val);
          setIsEdited(val !== item.amountowned.toString());
        }}
        style={{
          width: "25%",
          textAlign: "center",
          padding: "0.3rem",
          fontSize: "1rem",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />



      <div
        style={{
          width: "25%",
          textAlign: "right",
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
        }}
      >
        {isEdited && (
          <button
          onClick={async () => {
            if (!isNaN(parseFloat(editedAmount)) && parseFloat(editedAmount) >= 0) {
              const updatedAmount = parseFloat(editedAmount);

              // Prevent unnecessary API call if amount hasn't changed
              if (updatedAmount === item.amountowned) {
                  setIsEdited(false); // Reset edit state if no change
                  return;
              }

              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stocks/${item.ticker}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    amountowned: updatedAmount,
                    // If you wanted to allow notes editing, you'd add: notes: newNoteForThisItem
                  }),
                  credentials: "include", // Crucial for session cookies
                });

                if (response.ok) {
                  const updatedRecord = await response.json(); // Backend returns updated record
                  const updatedHoldings = customHoldings.map((h, i) =>
                    i === index
                      ? { ...h, amountowned: updatedRecord.amountowned, notes: updatedRecord.notes } // Update all fields from backend
                      : h
                  );
                  setCustomHoldings(updatedHoldings);
                  setIsEdited(false); // Reset edit state
                } else {
                  const errorData = await response.json();
                  alert(`Failed to update holding: ${errorData.error || response.statusText}`);
                }
              } catch (error) {
                alert("Network or server error. Please try again.");
                console.error("Error updating holding:", error);
              }
            } else {
              alert("Please enter a valid non-negative number.");
            }
          }}
            style={{
              backgroundColor: "#2196f3",
              color: "#fff",
              border: "none",
              padding: "0.3rem 0.6rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Update
          </button>
        )}

        <button
        onClick={async () => {
          if (window.confirm(`Are you sure you want to delete ${item.ticker}?`)) { // Add confirmation
            try {
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stocks/${item.ticker}`, {
                method: "DELETE",
                credentials: "include", // Crucial for session cookies
              });

              if (response.ok) {
                // Backend returns a success message and the deleted item
                // You can update local state by filtering it out
                const updated = customHoldings.filter((_, i) => i !== index);
                setCustomHoldings(updated);
                alert(`${item.ticker} deleted successfully.`);
              } else {
                const errorData = await response.json();
                alert(`Failed to delete holding: ${errorData.error || response.statusText}`);
              }
            } catch (error) {
              alert("Network or server error. Please try again.");
              console.error("Error deleting holding:", error);
            }
          }
        }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default Stocks;