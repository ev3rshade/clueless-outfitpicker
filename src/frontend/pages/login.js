import React, { useState } from "react";

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
    <div className="auth-container">
      <h1 className="logo">Clueless</h1>

      <div className="auth-box">
        <input
          type="email"
          placeholder="Email"
          className="input-field"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="input-field"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="button-primary"
          style={{ width: "100%" }}
          onClick={handleLogin}
        >
          Login
        </button>

        <p style={{ marginTop: "10px" }}>
          No account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}