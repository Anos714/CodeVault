import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../navabar/Navbar";
import Footer from "../footer/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <Navbar />
      </div>
      <div className="flex-1 w-full h-full bg-[#020617]">
        <Outlet />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
