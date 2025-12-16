import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "./index";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black/80 backdrop-blur-md border-b border-white/10 text-white font-sans selection:bg-primary/30 max-w-[1400px] mx-auto">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
