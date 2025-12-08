import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import OutfitGeneration from "./pages/OutfitGeneration.jsx";
import Wardrobe from "./pages/Wardrobe.jsx";
import Outfits from "./pages/SavedOutfits.jsx"

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Account from "./pages/Account.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      {/* Routes WITHOUT Navbar */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Routes WITH Navbar */}
      <Route element={<Layout />}>
        <Route path="/llmsearch" element={<OutfitGeneration />} />
        <Route path="/wardrobe" element={<Wardrobe/>} />
        <Route path="/outfits" element={<Outfits/>} />
        <Route path="/account" element={<Account/>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}