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
        padding: "30px",
        fontFamily: "sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* Top Row */}
      <div
        className="top-row"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <img src="/logo.png" height="40" alt="Logo" />

        <button
          className="button-primary"
          style={{
            padding: "10px 20px",
            borderRadius: "20px",
            border: "1px solid #000",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Settings
        </button>
      </div>

      {/* Profile Section */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        {/* Profile Picture with Upload */}
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={user.profilePic || "/default-avatar.png"}
            alt="Profile"
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            }}
          />
          
          {/* Upload Button Overlay */}
          <label
            htmlFor="profile-pic-upload"
            style={{
              position: "absolute",
              bottom: "5px",
              right: "5px",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#000",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: uploading ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              fontSize: "20px",
            }}
          >
            {uploading ? "..." : "📷"}
          </label>
          
          <input
            id="profile-pic-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePicUpload}
            disabled={uploading}
          />
        </div>

        <h1 style={{ marginTop: "20px", fontSize: "32px" }}>
          {user.name?.toUpperCase()}
        </h1>

        {/* Profile Details Card */}
        <div
          className="section-card"
          style={{
            width: "400px",
            margin: "30px auto",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            textAlign: "left",
            background: "#fafafa",
          }}
        >
          <h3 style={{ marginTop: "0", marginBottom: "15px", fontSize: "20px" }}>
            Account Details
          </h3>
          
          <p><strong>Email:</strong> {user.email}</p>
          <p style={{ marginBottom: "0" }}><strong>Age:</strong> {user.age}</p>
        </div>

        {/* Recent Searches */}
        <h2 style={{ marginTop: "40px" }}>Recent Searches</h2>
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
        <h2 style={{ marginTop: "40px" }}>Saved Outfits</h2>

        <div
          className="outfit-grid"
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "20px",
          }}
        >
          {(user.savedOutfits || []).map((o, i) => (
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
              <img
                src={o.image}
                alt="Outfit"
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <p style={{ textAlign: "center", marginTop: "10px" }}>{o.name}</p>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          className="button-primary"
          style={{
            marginTop: "40px",
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