import React from "react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">Clueless</div>

      <div className="nav-right">
        <a href="/account">Account</a>
        <a href="/wardrobe">Wardrobe</a>
        <a href="/login">Logout</a>
      </div>
    </nav>
  );
}
