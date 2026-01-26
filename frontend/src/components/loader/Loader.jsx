import React from "react";
import { motion } from "motion/react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] w-full fixed top-0 left-0 z-50">
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 border-t-4 border-b-4 border-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute w-16 h-16 border-r-4 border-l-4 border-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
        />

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)]"
        />

        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-12 text-cyan-500 font-mono text-sm tracking-widest"
        >
          INITIALIZING...
        </motion.p>
      </div>
    </div>
  );
};

export default Loader;
