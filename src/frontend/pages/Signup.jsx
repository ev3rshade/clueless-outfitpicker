import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSignup() {
    // Validation
    if (!name || !email || !age || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          age,
          password
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account created successfully!");
        window.location.href = "/login";
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Failed to connect to server. Please make sure the backend is running on port 8000.");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "30px" }}>Clueless</h1>

      <div
        style={{
          width: "320px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          padding: "25px",
          borderRadius: "10px",
          border: "1px solid #ccc",
        }}
      >
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            background: "black",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px",
          }}
          onClick={handleSignup}
        >
          Sign Up
        </button>

        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Already have an account? <Link to="/login" style={{ color: "blue" }}>Login</Link>
        </p>
      </div>
    </div>
  );
}