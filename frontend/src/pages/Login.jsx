import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/account";
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
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
  
        {/* Big Logo */}
              <div className="wardrobe-top-row">
                <img src={logo} alt="Clueless Logo" height="120" />
              </div>
        
        {/* Login Card */}
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
  
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            onClick={handleLogin}
          >
            Login
          </button>
  
          {/* Signup Redirect */}
          <p style={{ marginTop: "10px", fontFamily: "var(--font-primary)" }}>
            No account? <Link to="/signup" style={{ color: "var(--warm-clay)", textDecoration: "underline" }}
            >Sign up</Link>
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