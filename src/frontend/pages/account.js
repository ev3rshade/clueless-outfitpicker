import React, { useEffect, useState } from "react";

export default function Account() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		async function loadUser() {
			const token = localStorage.getItem("token");

			const res = await fetch("http://localhost:3000/account", {
				method: "GET",
				headers: { Authorization: `Bearer ${token}` },
			});

			const data = await res.json();
			if (res.ok) setUser(data.user);
			else {
				alert("Session expired");
				localStorage.removeItem("token");
				window.location.href = "/login";
			}
		}

    	loadUser();
  	}, []);

  	if (!user) return <h2>Loading...</h2>;

	return (
		<div className="page-container">
			<div className="top-row">
				<img src="/logo.png" height="40" alt="Logo" />
				<button className="button-primary">Settings</button>
			</div>

			<div style={{ textAlign: "center", marginTop: "40px" }}>
				{/* Profile Picture */}
				<img
					src={user.profilePic || "/default-avatar.png"}
					alt="Profile"
					style={{
						width: "140px",
						height: "140px",
						borderRadius: "50%",
						objectFit: "cover",
						boxShadow: "var(--shadow-soft)",
					}}
        		/>

				<h1 style={{ marginTop: "20px", fontSize: "32px" }}>
					{user.name.toUpperCase()}
				</h1>

				{/* Profile Details */}
				<div className="section-card" style={{ width: "400px", margin: "30px auto" }}>
					<p><strong>Email:</strong> {user.email}</p>
					<p><strong>Username:</strong> {user.username}</p>
					<p><strong>Age:</strong> {user.age}</p>
				</div>

				{/* Recent Searches */}
				<h2>Recent Searches</h2>
				<ul>
					{user.recentSearches.map((s, i) => (
						<li key={i}>{s}</li>
					))}
				</ul>

				{/* Saved Outfits */}
				<h2>Saved Outfits</h2>
				<div className="outfit-grid">
					{user.savedOutfits.map((o, i) => (
						<div className="outfit-card" key={i}>
							<img src={o.image} alt="Outfit" />
							<p>{o.name}</p>
						</div>
					))}
				</div>

				<button
					className="button-primary"
					style={{ marginTop: "40px", background: "red" }}
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
