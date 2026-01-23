import React, { useState } from "react";
import { Lock, X, Menu } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              CodeVault
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {["Features", "Tech Stack", "Roadmap"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="hover:text-cyan-400 transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                >
                  {item}
                </a>
              ))}
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium border border-slate-700 transition-all cursor-pointer">
                Sign In
              </button>
              <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg shadow-cyan-500/20 transition-all cursor-pointer">
                Get Started
              </button>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white cursor-pointer"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 flex flex-col items-center pb-4"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {["Features", "Tech Stack", "Roadmap"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium text-center"
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="flex gap-5">
              <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium border border-slate-700 transition-all cursor-pointer">
                Sign In
              </button>
              <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md text-sm font-medium shadow-lg shadow-cyan-500/20 transition-all cursor-pointer">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
