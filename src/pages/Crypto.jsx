import React, { useState, useEffect, useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import HeaderBar from "../components/HeaderBar";
import "../styles/Crypto.css";
import { AccountContext } from "../components/AccountContext";

const API_KEY = "74a27c82d2a74e1b8544353c5b66ddd3";

const Crypto = () => {
  const [showModal, setShowModal] = useState(false);
  const [customHoldings, setCustomHoldings] = useState([]);
  const [symbol, setSymbol] = useState("BTC/USD");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [cryptoData, setCryptoData] = useState([]);
  const [metaData, setMetaData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { user } = useContext(AccountContext);
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

  useEffect(() => {
    if (!symbol) return;
    fetchCryptoData(symbol);
  }, [symbol]);

  const fetchCryptoData = async (sym) => {
    setErrorMessage("");
    try {
      const timeRes = await fetch(
        `https://api.twelvedata.com/time_series?symbol=${sym}&interval=1day&outputsize=30&apikey=${API_KEY}`
      );
      const timeData = await timeRes.json();

      if (timeData.status === "error") {
        setErrorMessage(timeData.message || "Error fetching crypto data.");
        setCryptoData([]);
        setMetaData(null);
        return;
      }

      const chartData = timeData.values.reverse().map((entry) => ({
        date: entry.datetime,
        price: parseFloat(entry.close),
      }));
      setCryptoData(chartData);

      const quoteRes = await fetch(
        `https://api.twelvedata.com/quote?symbol=${sym}&apikey=${API_KEY}`
      );
      const quoteData = await quoteRes.json();

      if (quoteData.status === "error" || !quoteData.name) {
        setMetaData(null);
      } else {
        setMetaData({
          name: quoteData.name,
          exchange: quoteData.exchange,
          currency: quoteData.currency,
        });
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again later.");
      console.error("Fetch error:", error);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const formatted = searchInput.toUpperCase();
      setSymbol(formatted.includes("/") ? formatted : `${formatted}/USD`);
    }
  };

  return (
    <div>
      <HeaderBar userName={fullName || "Guest"} />
      <div className="dashboard">
        <label htmlFor='searchCoin'>Search Coin</label>
        <input
          id='searchCoin'
          type="text"
          placeholder="Search Crypto Coins (e.g., BTC)"
          className="search-bar"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearch}
        />
        <div className="info">
          <h2>{metaData ? `${metaData.name} (${symbol})` : symbol}</h2>
          {cryptoData.length > 0 && (
            <p>
              Current price per token:{" "}
              <strong>
                ${cryptoData[cryptoData.length - 1].price.toFixed(2)}
              </strong>
            </p>
          )}
          {metaData && (
            <>
              <p>Exchange: {metaData.exchange}</p>
              <p>Currency: {metaData.currency}</p>
            </>
          )}
        </div>
        <div className="chart">
          {cryptoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cryptoData}>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <CartesianGrid stroke="#ccc" />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#8884d8"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-placeholder">
              Loading chart or invalid symbol...
            </div>
          )}
        </div>
        <div className="trending">
          <h3>Trending Tokens</h3>
          <ul>
            <li>BTC</li>
            <li>ETH</li>
            <li>DOGE</li>
            <li>SOL</li>
            <li>DJT</li>
            <li>MEL</li>
          </ul>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "8px",
              width: "600px",
              maxWidth: "90vw",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h2>Add Crypto Holding</h2>
            <input
              type="text"
              placeholder="Enter crypto symbol (e.g., BTC)"
              value={symbol.replace("/USD", "")}
              onChange={(e) =>
                setSymbol(`${e.target.value.toUpperCase()}/USD`)
              }
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="number"
              placeholder="Enter amount you own"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <textarea
              placeholder="Notes or expectations (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                resize: "vertical",
              }}
            />
            <button
              onClick={async () => {
                if (symbol && amount) {
                  try {
                    const quoteRes = await fetch(
                      `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`
                    );
                    const quoteData = await quoteRes.json();

                    if (
                      !quoteData ||
                      !quoteData.close ||
                      quoteData.status === "error"
                    ) {
                      alert("Failed to fetch price for symbol: " + symbol);
                      return;
                    }

                    setCustomHoldings([
                      ...customHoldings,
                      {
                        symbol,
                        amount,
                        note,
                        price: parseFloat(quoteData.close),
                      },
                    ]);
                    setSymbol("BTC/USD");
                    setAmount("");
                    setNote("");
                    setShowModal(false);
                  } catch (error) {
                    alert("Error fetching crypto data. Please try again.");
                    console.error(error);
                  }
                }
              }}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                alignSelf: "flex-end",
              }}
            >
              Submit
            </button>

            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#f44336",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                alignSelf: "flex-end",
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

export default Crypto;
