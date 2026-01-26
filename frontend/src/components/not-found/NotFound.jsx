import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Ghost, FileQuestion, Home, ArrowLeft, Terminal } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  const float = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const glitch = {
    initial: { x: 0 },
    animate: {
      x: [0, -2, 2, -1, 1, 0],
      transition: {
        repeat: Infinity,
        repeatDelay: 3,
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          variants={float}
          animate="animate"
          className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center"
        >
          <Ghost className="w-48 h-48 text-slate-800 absolute drop-shadow-2xl" strokeWidth={1} />
          <Ghost className="w-48 h-48 text-cyan-500 relative z-10 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" strokeWidth={1.5} />

          <motion.div
            animate={{ y: [0, 15, 0], x: [0, 10, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute top-0 right-0"
          >
            <FileQuestion className="w-12 h-12 text-slate-400" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0], x: [0, -10, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
            className="absolute bottom-4 left-4"
          >
            <Terminal className="w-10 h-10 text-blue-500/50" />
          </motion.div>

          <div className="absolute -z-10 text-xs font-mono text-cyan-500/20 top-10 left-10">01001</div>
          <div className="absolute -z-10 text-xs font-mono text-cyan-500/20 bottom-20 right-10">10100</div>
        </motion.div>

        <div className="relative mb-6">
          <motion.h1
            variants={glitch}
            initial="initial"
            animate="animate"
            className="text-9xl font-black text-white tracking-tighter"
          >
            404
          </motion.h1>
          <span className="absolute top-0 left-0 w-full h-full text-9xl font-black text-cyan-500 -z-10 translate-x-[2px] opacity-50">404</span>
          <span className="absolute top-0 left-0 w-full h-full text-9xl font-black text-red-500 -z-10 -translate-x-[2px] opacity-50">404</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Oops! The snippet you are looking for seems to have been deleted or moved to an alternate dimension.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 transition-all w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>

          <button
            onClick={() => navigate("/snippets")}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-500/20 transition-all w-full sm:w-auto justify-center"
          >
            <Home className="w-4 h-4" /> Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;