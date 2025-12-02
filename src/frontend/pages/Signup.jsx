import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  async function handleSignup() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("age", age);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePic) formData.append("profilePic", profilePic);

    const res = await fetch("http://localhost:3000/signup", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert("Account created!");
      window.location.href = "/login";
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
          type="text"
          placeholder="Name"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Username"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
          onChange={(e) => setAge(e.target.value)}
        />

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

        {/* <label style={{ marginTop: "5px", fontWeight: "bold" }}>
          Profile Picture
        </label>

        <input
          type="file"
          style={{ marginBottom: "10px" }}
          onChange={(e) => setProfilePic(e.target.files[0])}
        /> */}

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