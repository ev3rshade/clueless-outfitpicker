import React, { useEffect, useState } from "react";

export default function SavedOutfits() {
  const [user, setUser] = useState(null);
  const [savedOutfits, setSavedOutfits] = useState([]);

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
        const outfitIds = data.user.savedOutfits || [];

        const outfits = await Promise.all(
          outfitIds.map(async (id) => {
            const outfitRes = await fetch(`http://localhost:8000/outfits/${id}`);
            const outfitData = await outfitRes.json();
            return outfitData.success ? outfitData.outfit : null;
          })
        );
        
        console.log(outfits);

        setSavedOutfits(outfits);
      } else {
        window.location.href = "/login";
      }
    }

    loadUser();
  }, []);

  // ----------------------------------
  // DELETE OUTFIT HANDLER
  // ----------------------------------
  async function handleDelete(outfitId) {
    const confirmDelete = window.confirm("Delete this outfit?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:8000/outfits/${outfitId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      // Remove deleted outfit from UI
      setSavedOutfits((prev) => prev.filter((o) => o._id !== outfitId));
    } else {
      alert("Could not delete outfit.");
    }
  }


  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--white)" }}>
      {/* Main Container */}
      <div className="outfits-container" style={{ padding: "20px" }}>
        <h1
          className="outfits-header"
          style={{
            fontFamily: "var(--font-primary)",
            textAlign: "center",
            fontSize: "32px",
            marginBottom: "20px",
          }}
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
          {savedOutfits.length > 0 ? (
            savedOutfits.map((outfit, index) => (
              <div
                className="saved-outfit-card"
                key={outfit._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  padding: "10px",
                  background: "#fff",
                  position: "relative",
                }}
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(outfit._id)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>

                {/* Outfit Image */}
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
                  {outfit.outfitImage ? (
                    <img
                      src={`data:image/png;base64,${outfit.outfitImage}`}
                      alt={`Outfit ${index + 1}`}
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
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  )}
                </div>

                <p
                  className="saved-outfit-name"
                  style={{
                    fontFamily: "var(--font-primary)",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  OUTFIT {index + 1}
                </p>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", width: "100%" }}>
              No saved outfits yet.
            </p>
          )}
        </div>
      </div>
<<<<<<< HEAD

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
      </div>
=======
>>>>>>> 812f7ba45134c1e26771cb66f7907516d3bc134d
    </div>
  );
}