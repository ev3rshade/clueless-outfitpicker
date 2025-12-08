import React, { useEffect, useState } from "react";

export default function Account() {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);

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
        alert("Session expired");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    loadUser();
  }, []);

  async function handleProfilePicUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8000/upload-profile-pic", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUser({ ...user, profilePic: data.profilePic });
        alert("Profile picture updated successfully!");
      } else {
        alert(data.error || "Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  }

  if (!user) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

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

      {/* Profile Section */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        {/* GENERIC THEME COLORED PROFILE AVATAR */}
<div
  style={{
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    background: "var(--terra-cotta)",
    color: "var(--latte)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "var(--font-primary)",
    fontSize: "60px",
    fontWeight: "bold",
    margin: "0 auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
    userSelect: "none",
  }}
>
  {user.name?.charAt(0).toUpperCase() || "?"}
</div>


        {/* Name */}
      <h1
        style={{
          fontFamily: "var(--font-primary)",
          fontSize: "48px",
          letterSpacing: "2px",
          marginBottom: "40px",
          color: "var(--terra-cotta)",
        }}
      >
        {user.name?.toUpperCase()}
      </h1>

        {/* SPLIT BELOW INTO LEFT & RIGHT */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
        width: "85%",
        margin: "0 auto",
        alignItems: "flex-start",
      }}
    >
      {/* LEFT SIDE — ACCOUNT DETAILS */}
      <div>
        <div
          className="section-card"
          style={{
            width: "400px",
            padding: "20px",
            borderRadius: "25px",
            border: "1px solid var(--terra-cotta)",
            background: "var(--latte)",
            boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-primary)",
              fontSize: "22px",
              letterSpacing: "2px",
              color: "var(--terra-cotta)",
              marginBottom: "15px",
            }}
          >
            Account Details
          </h3>

          <p style={{ fontFamily: "var(--font-primary)" }}><strong>Email:</strong> {user.email}</p>
          <p style={{ fontFamily: "var(--font-primary)" }}><strong>Age:</strong> {user.age}</p>
        </div>
      </div>

      {/* RIGHT SIDE — RECENT SEARCHES + SAVED OUTFITS */}
      <div>
        {/* Recent Searches */}
        <h2 style={{ fontFamily: "var(--font-primary)" }}>Recent Searches</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {(user.recentSearches || []).map((s, i) => (
            <li
              key={i}
              style={{
                padding: "8px 0",
                borderBottom: "1px solid #eee",
                fontSize: "16px",
              }}
            >
              {s}
            </li>
          ))}
        </ul>

        {/* Saved Outfits */}
        <h2 style={{ fontFamily: "var(--font-primary)" }}>Saved Outfits</h2>

        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "15px",
          }}
        >
          {(user.savedOutfits || []).map((o, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "10px",
                background: "#fff",
              }}
            >
              <img
                src={o.image}
                alt="Outfit"
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <p style={{ textAlign: "center", marginTop: "10px" }}>{o.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* LOGOUT BUTTON */}
    <button
      style={{
        marginTop: "40px",
        borderRadius: "12px",
        background: "red",
        color: "white",
        padding: "12px 25px",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
      }}
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}
    >
      Log Out
    </button>
  </div>
  </div>
);
}