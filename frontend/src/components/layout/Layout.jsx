import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navabar/Navbar";
import Footer from "../footer/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      <Navbar />

      <main className="flex-1 w-full h-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
