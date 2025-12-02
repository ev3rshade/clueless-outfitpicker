import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Account from "./pages/account";
import Wardrobe from "./pages/wardrobe";
import Home from "./pages/home"; // your landing page

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/account" element={<Account />} />
      <Route path="/wardrobe" element={<Wardrobe />} />
    </Routes>
  </BrowserRouter>
);
