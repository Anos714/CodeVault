import React, { useEffect, useRef, useState } from "react";
import { Lock, X, Menu, LogOut, LayoutDashboard, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useSelector, useDispatch } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userData = useSelector((state) => state.auth.user);
  const { user } = userData;

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    navigate("/login");
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/20">
              <Lock className="w-5 h-5 text-blue-500" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              CodeVault
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {["Features", "Solutions", "Tech Stack"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-slate-400 hover:text-cyan-400 transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium cursor-pointer"
                >
                  {item}
                </a>
              ))}

              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 border border-white/10">
                      {user?.username
                        ? user.username.charAt(0).toUpperCase()
                        : "O"}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-2 overflow-hidden ring-1 ring-black/5"
                      >
                        <div className="px-4 py-2 border-b border-slate-800 mb-2">
                          <p className="text-sm text-white font-medium truncate">
                            {user.username}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {user.email}
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            navigate("/dashboard");
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 flex items-center gap-2 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-red-400 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white cursor-pointer p-2"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {["Features", "Tech Stack", "Roadmap"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-lg text-base font-medium transition-colors"
                >
                  {item}
                </a>
              ))}

              <div className="border-t border-slate-800 my-4 pt-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                        {user.username
                          ? user.username.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {user.username}
                        </p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left text-slate-300 hover:text-white hover:bg-slate-800 block px-3 py-2 rounded-lg text-base font-medium transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </div>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-red-400 hover:bg-slate-800 block px-3 py-2 rounded-lg text-base font-medium transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Logout
                      </div>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3 px-3">
                    <button
                      onClick={() => {
                        navigate("/login");
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-700 transition-all"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        navigate("/register");
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg shadow-cyan-500/20 transition-all"
                    >
                      Get Started
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
