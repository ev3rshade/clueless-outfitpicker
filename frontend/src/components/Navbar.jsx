import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";


export default function Navbar() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 20px",
        borderBottom: "1px solid #ccc",
        fontFamily: "sans-serif",
      }}
    >
      { /* <Link to="/" style={{ textDecoration: "none", color: "black", fontSize: "24px", fontWeight: "bold" }}>Clueless</Link> */}
      <div className="wardrobe-top-row">
        <img src={logo} alt="Clueless Logo" height="80" />
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {(token) ? (<Link to="/account" style={{ fontFamily: "var(--font-primary)", textDecoration: "none", color: "black" }}> Account </Link>) : (<></>)}

        {/* ROUTED TO /llmsearch AS REQUESTED */}
        {(token) ? (<Link to="/wardrobe" style={{ fontFamily: "var(--font-primary)", textDecoration: "none", color: "black" }}> Wardrobe </Link>) : (<></>)}

        {(token) ? (<Link to="/outfits" style={{ fontFamily: "var(--font-primary)", textDecoration: "none", color: "black" }}> My Outfits </Link>) : (<></>)}

        <Link to="/llmsearch" style={{ fontFamily: "var(--font-primary)", textDecoration: "none", color: "black" }}>
          Generate Outfit
        </Link>

        {(token) ? (<Link to="/login" onClick={() => {localStorage.removeItem("token"); setToken(null) }}style={{ fontFamily: "var(--font-primary)", textDecoration: "none", color: "black" }}> Logout </Link>) :
                   (<Link to="/login" style={{ fontFamily: "var(--font-primary)", textDecoration: "none", color: "black" }}> Login </Link>)}
      </div>
    </nav>
  );
}
