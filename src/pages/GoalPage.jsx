import React, { useState, useEffect, useContext } from "react";
import HeaderBar from "../components/HeaderBar";
import { AccountContext } from "../components/AccountContext";

export default function GoalCustomizer() {
  const [category, setCategory] = useState("Financial goal");
  const [customCategory, setCustomCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [customUser, setUser] = useState("");
  const [date, setDate] = useState("");
  const [details, setDetails] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [goals, setGoals] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
  const storedGoals = localStorage.getItem("userGoals");
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("userGoals", JSON.stringify(goals));
  }, [goals]);


  const finalCategory = category === "custom" ? customCategory : category;
  const validGoals = goals.filter((g) => g.text && g.text.trim() !== "");

  // personal info from db
  const { user } = useContext(AccountContext);
  const fullName = `${user?.firstName} ${user?.lastName}`;

  const handleSubmit = () => {
    if (!subject || !customUser || !date || !details) {
      alert("Please fill out all required fields.");
      return;
    }

    const newGoal = {
      text: `${subject} - ${finalCategory} - ${priority}`,
      completed: false,
    };

    setGoals([...goals, newGoal]);

    alert(`Your ${finalCategory} has been saved!`);

    // Reset form
    setSubject("");
    setUser("");
    setDate("");
    setDetails("");
    setPriority("Medium");
    setCategory("Financial goal");
    setCustomCategory("");
  };

  const toggleCompletion = (index) => {
    const updatedGoals = goals.map((goal, i) =>
      i === index ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
  };

  // Listen for window resizing to set mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      <HeaderBar userName={fullName} />
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: "100vw",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Left: Form */}
        <div
          style={{
            flex: 1,
            padding: "1.5rem",
            boxSizing: "border-box",
            overflowY: "auto",
            width: isMobile ? "100%" : "50%",
          }}
        >
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "1rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Category Buttons */}
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              {["Financial goal", "Personal goal", "custom"].map((value) => (
                <button
                  key={value}
                  onClick={() => setCategory(value)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: category === value ? "green" : "#fff",
                    color: category === value ? "#fff" : "#000",
                    cursor: "pointer",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {value === "custom" ? "Custom" : value.replace(" goal", "")}
                </button>
              ))}

              {category === "custom" && (
                <input
                  type="text"
                  placeholder="Enter custom goal category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    boxSizing: "border-box",
                  }}
                />
              )}
            </div>

            {/* Form Fields */}
            <label htmlFor='createGoal'> Goal </label>
            <input
              id='createGoal'
              type="text"
              placeholder="What is your goal?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                boxSizing: "border-box",
              }}
            />
            <label htmlFor='reason'> Reason </label>
            <input
              id='reason'
              type="text"
              placeholder="Who is this goal for?"
              value={customUser}
              onChange={(e) => setUser(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                boxSizing: "border-box",
              }}
            />
            <label htmlFor='date'> Date </label>
            <input
              id='date'
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "0.5rem",
                boxSizing: "border-box",
              }}
            />
            <label htmlFor='priorityLevel'>Priority</label>

            <select
              id='priorityLevel'
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                marginBottom: "1rem",
                boxSizing: "border-box",
              }}
            >
              <option value="High">Urgent</option>
              <option value="Medium">Long-Term</option>
              <option value="Low">Casual</option>
            </select>
            <label htmlFor='notes'> Notes </label>
            <textarea
              id='notes'
              placeholder="Write your goal details here..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              style={{
                width: "100%",
                height: "200px", // or adjust to what looks good
                padding: "1rem",
                fontSize: "1rem",
                resize: "vertical",
                boxSizing: "border-box",
                marginBottom: "1rem",
              }}
            />

            <button
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              Save Goal
            </button>
          </div>
        </div>

        {/* Right: Saved Goals */}
        <div
          style={{
            flex: 1,
            padding: "1.5rem",
            borderLeft: isMobile ? "none" : "1px solid #ddd",
            borderTop: isMobile ? "1px solid #ddd" : "none",
            backgroundColor: "#f9f9f9",
            boxSizing: "border-box",
            overflowY: "auto",
            width: isMobile ? "100%" : "50%",
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Saved Goals</h2>
          {goals.length === 0 ? (
            <p style={{ color: "#999" }}>No goals yet.</p>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {validGoals.map((goal, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => {
                      const originalIndex = goals.findIndex(
                        (g) => g.text === goal.text
                      );
                      toggleCompletion(originalIndex);
                    }}
                    style={{ marginRight: "0.5rem" }}
                  />
                  <span style={{ textDecoration: goal.completed ? "line-through" : "none" }}>
                    {goal.text}
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
