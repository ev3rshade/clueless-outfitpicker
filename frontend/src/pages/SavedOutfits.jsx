import React, { useEffect, useState } from "react";

export default function SavedOutfits() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/account", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
      } else {
        window.location.href = "/login";
      }
    }

    loadUser();
  }, []);

  if (!user)
    return (
      <h2 style={{ fontFamily: "var(--font-primary)", textAlign: "center", marginTop: "50px" }}>
        Loading Saved Outfits...
      </h2>
    );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--white)" }}>
      {/* Header */}
      <div
        className="top-header-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
        }}
      >
      </div>

      {/* Main Container */}
      <div className="outfits-container" style={{ padding: "20px" }}>
        <h1
          className="outfits-header"
          style={{ fontFamily: "var(--font-primary)", textAlign: "center", fontSize: "32px", marginBottom: "20px" }}
        >
          MY OUTFITS
        </h1>

        <div
          className="saved-outfits-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "20px",
          }}
        >
          {(user.savedOutfits || []).length > 0 ? (
            user.savedOutfits.map((outfit, index) => (
              <div
                className="saved-outfit-card"
                key={index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "10px",
                  background: "#fff",
                }}
              >
                <div
                  className="saved-outfit-image-placeholder"
                  style={{
                    width: "100%",
                    height: "150px",
                    background: "#f4f4f4",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {outfit.image ? (
                    <img
                      src={outfit.image}
                      alt={outfit.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="18"
                        height="18"
                        rx="2"
                        ry="2"
                      ></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  )}
                </div>

                <p
                  className="saved-outfit-name"
                  style={{ fontFamily: "var(--font-primary)", textAlign: "center", marginTop: "10px" }}
                >
                  {outfit.name || `OUTFIT ${index + 1}`}
                </p>
              </div>
            ))
          ) : (
            // Placeholder empty state
            Array.from({ length: 8 }).map((_, i) => (
              <div
                className="outfit-card"
                key={i}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "10px",
                  background: "#fff",
                }}
              >
                <div
                  className="saved-outfit-image-placeholder"
                  style={{
                    width: "100%",
                    height: "150px",
                    background: "#f4f4f4",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "8px",
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    ></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>

                <p
                  className="saved-outfit-name"
                  style={{ textAlign: "center", marginTop: "10px" }}
                >
                  OUTFIT {i + 1}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div
        className="bottom-nav-bar"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "#fff",
          padding: "15px 0",
          display: "flex",
          justifyContent: "space-around",
          borderTop: "1px solid #ddd",
        }}
      >
        {/* Tag */}
        {/* <div className="nav-circle-btn">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        </div> */}

        {/* Upload */}
        <div 
          className="nav-circle-btn"
          onClick={() => window.location.href = "/wardrobe"}
          style={{ cursor: "pointer" }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>

        {/* Search */}
        {/* <div className="nav-circle-btn">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div> */}
      </div>
    </div>
  );
}