import React, { useState } from "react";

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
    <div className="auth-container">
      <h1 className="logo">Clueless</h1>

      <div className="auth-box">
        <input
          type="text"
          className="input-field"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          className="input-field"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="number"
          className="input-field"
          placeholder="Age"
          onChange={(e) => setAge(e.target.value)}
        />

        <input
          type="email"
          className="input-field"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="input-field"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <label style={{ marginTop: "10px" }}>Profile Picture</label>
        <input
          type="file"
          onChange={(e) => setProfilePic(e.target.files[0])}
        />

        <button className="button-primary" style={{ width: "100%" }} onClick={handleSignup}>
          Sign Up
        </button>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
