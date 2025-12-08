import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

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
      className="page-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",   // PERFECT VERTICAL CENTER
        alignItems: "center",       // PERFECT HORIZONTAL CENTER
        backgroundColor: "var(--color-background)",
        padding: "20px",
        textAlign: "center",
      }}
    >

      {/* Logo Title */}
      <h1
        style={{
          fontFamily: "var(--font-primary)",
          fontSize: "48px",
          letterSpacing: "2px",
          marginBottom: "40px",
          color: "var(--terra-cotta)",
        }}
      >
        CLUELESS
      </h1>

      {/* Signup Card */}
      <div
        className="section-card"
        style={{
          width: "380px",
          padding: "50px",
          background: "var(--latte)",
          borderRadius: "25px",
          boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        {/* Inputs */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        {/* Button */}
        <button
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            background: "var(--terra-cotta)",
            color: "white",
            fontSize: "17px",
            border: "2px solid var(--warm-clay)",
            cursor: "pointer",
            marginTop: "5px",
          }}
          onClick={handleSignup}
        >
          Sign Up
        </button>

        {/* Login Redirect */}
        <p style={{ marginTop: "20px", fontFamily: "var(--font-primary)" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--warm-clay)", textDecoration: "underline" }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "90%",
  padding: "13px",
  borderRadius: "12px",
  justifyContent: "center",   // PERFECT VERTICAL CENTER
  alignItems: "center",       // PERFECT HORIZONTAL CENTER
  border: "1px solid var(--dusty-orange)",
  fontFamily: "var(--font-primary)",
  fontSize: "15px",
  marginBottom: "16px",
};