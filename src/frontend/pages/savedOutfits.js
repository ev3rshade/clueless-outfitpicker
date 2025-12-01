import React, { useEffect, useState } from "react";

export default function SavedOutfits() {
  const [user, setUser] = useState(null);

  // Reuse the exact fetching logic from Account.js
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      // Assuming we can get the same user object that has 'savedOutfits'
      const res = await fetch("http://localhost:3000/account", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setUser(data.user);
      else {
        // Handle error or redirect
        window.location.href = "/login";
      }
    }

    loadUser();
  }, []);

  if (!user) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading Wardrobe...</h2>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--white)" }}>
      
      {/* 1. Header Row (Logo + Account Button) */}
      <div className="top-header-row">
        {/* Replace with your actual logo file path */}
        <img src="/logo.png" alt="Clueless Logo" height="50" /> 
        
        <a href="/account" className="account-btn">
          My Account
        </a>
      </div>

      {/* 2. Main Warm Clay Container */}
      <div className="outfits-container">
        <h1 className="outfits-header">MY OUTFITS</h1>

        <div className="saved-outfits-grid">
          {user.savedOutfits && user.savedOutfits.length > 0 ? (
            user.savedOutfits.map((outfit, index) => (
              <div className="saved-outfit-card" key={index}>
                {/* Image Area */}
                <div className="saved-outfit-image-placeholder">
                  {outfit.image ? (
                    <img 
                      src={outfit.image} 
                      alt={outfit.name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  ) : (
                    /* Fallback Icon if no image exists (Generic Mountain Icon) */
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  )}
                </div>
                {/* Text Area */}
                <p className="saved-outfit-name">
                  {outfit.name || `OUTFIT ${index + 1}`}
                </p>
              </div>
            ))
          ) : (
             /* Empty State Placeholders to match the design aesthetics if no data */
             Array.from({ length: 8 }).map((_, i) => (
                <div className="saved-outfit-card" key={i}>
                    <div className="saved-outfit-image-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                           <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                           <circle cx="8.5" cy="8.5" r="1.5"></circle>
                           <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    </div>
                    <p className="saved-outfit-name">OUTFIT {i + 1}</p>
                </div>
             ))
          )}
        </div>
      </div>

      {/* 3. Bottom Navigation (Tag, Upload, Search) */}
      <div className="bottom-nav-bar">
        
        {/* Tag Icon */}
        <div className="nav-circle-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        </div>

        {/* Upload Icon */}
        <div className="nav-circle-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>

        {/* Search Icon */}
        <div className="nav-circle-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

      </div>
    </div>
  );
}