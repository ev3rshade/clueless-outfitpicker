import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "/account";
    } else {
      alert(data.error);
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
          type="email"
          placeholder="Email"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          onChange={(e) => setPassword(e.target.value)}
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
          }}
          onClick={handleLogin}
        >
          Login
        </button>

        <p style={{ marginTop: "10px", fontSize: "14px", textAlign: "center" }}>
          No account? <Link to="/signup" style={{Color: "Blue" }}>Sign up</Link>

        </p>
      </div>
    </div>
  );
}
