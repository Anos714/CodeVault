import React from "react";
import { motion } from "motion/react";
import { SiExpress } from "react-icons/si";
import { SiMongodb } from "react-icons/si";
import { FaNodeJs } from "react-icons/fa";
import { FaReact } from "react-icons/fa";

import {
  Code2,
  Search,
  Database,
  Lock,
  Terminal,
  Layers,
  CheckCircle2,
  ArrowRight,
  Github,
  X,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const features = [
    {
      icon: <Terminal className="w-8 h-8 text-cyan-400" />,
      title: "Native Coding Experience",
      desc: "Powered by Monaco Editor (VS Code engine) for familiar editing, indentation, and formatting.",
    },
    {
      icon: <Layers className="w-8 h-8 text-purple-400" />,
      title: "Smart Organization",
      desc: "Tag-based system. Organize snippets using tags like #auth, #regex, #react-hooks.",
    },
    {
      icon: <Search className="w-8 h-8 text-green-400" />,
      title: "Instant Search",
      desc: "Find snippets by title, tags, or keywords in milliseconds. No more digging.",
    },
    {
      icon: <Code2 className="w-8 h-8 text-pink-400" />,
      title: "Syntax Highlighting",
      desc: "Automatic language detection for over 50+ languages for clear readability.",
    },
    {
      icon: <Lock className="w-8 h-8 text-yellow-400" />,
      title: "Secure Auth",
      desc: "Private snippets protected with JWT-based authentication and Bcrypt hashing.",
    },
    {
      icon: <Database className="w-8 h-8 text-blue-400" />,
      title: "Cloud Library",
      desc: "Centralized database using MongoDB. Access your code from anywhere.",
    },
  ];

  const stack = [
    {
      name: "MongoDB",
      role: "Database",
      color: "text-green-500",
      icon: <SiMongodb className="text-green-400 text-5xl" />,
    },
    {
      name: "Express.js",
      role: "Backend API",
      color: "text-gray-400",
      icon: <SiExpress className=" text-5xl" />,
    },
    {
      name: "React.js",
      role: "Frontend",
      color: "text-cyan-400",
      icon: <FaReact className="text-blue-500 text-5xl" />,
    },
    {
      name: "Node.js",
      role: "Runtime",
      color: "text-green-600",
      icon: <FaNodeJs className="text-green-400 text-5xl" />,
    },
  ];
  return (
    <div>
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#020617]">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            Work in Progress
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
          >
            The Developer’s <br />
            <span className="text-blue-400 overflow-hidden">Second Brain</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-10"
          >
            Stop digging through old GitHub repos and random text files.
            CodeVault is your centralized, syntax-aware, and searchable cloud
            library.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold text-lg shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer">
              Start Storing Code{" "}
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold text-lg border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Github className="w-5 h-5" /> View on GitHub
            </button>
          </motion.div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-20 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why CodeVault?
            </h2>
            <p className="text-slate-400">
              Solving the "Déjà Code" problem once and for all.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Problem */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-950 p-8 rounded-2xl border border-red-500/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <AlertTriangle className="w-24 h-24 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" /> The Struggle
              </h3>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                  Forgetting a useful utility function written months ago.
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                  Losing complex regex patterns in Slack chats.
                </li>
                <li className="flex items-start gap-3">
                  <X className="w-5 h-5 text-red-500 shrink-0 mt-1" />
                  Rewriting solutions that you know you've solved before.
                </li>
              </ul>
            </motion.div>

            {/* The Solution */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-slate-800/50 p-8 rounded-2xl border border-green-500/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Lightbulb className="w-24 h-24 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
                <Lightbulb className="w-6 h-6" /> The Solution
              </h3>
              <ul className="space-y-4 text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                  A centralized library for your personal code snippets.
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                  Syntax-aware searching (find code by logic, not just text).
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
                  First-class citizen treatment for code snippets.
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Power Tools for Devs
            </h2>
            <p className="text-slate-400">
              Everything you need to manage your codebase knowledge.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all group"
              >
                <div className="mb-4 bg-slate-950 w-14 h-14 rounded-lg flex items-center justify-center border border-slate-800 group-hover:border-cyan-500/30 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack */}
      <section
        id="tech-stack"
        className="py-20 bg-slate-900/30 border-y border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Built with Modern Tech
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stack.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center justify-center p-6 bg-slate-950 rounded-xl border border-slate-800"
              >
                <div className="">{tech.icon}</div>
                <h4 className="text-lg font-bold text-white">{tech.name}</h4>
                <p className="text-sm text-slate-500">{tech.role}</p>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 text-slate-400 text-sm">
            Enhanced with{" "}
            <span className="text-cyan-400 font-mono">Monaco Editor</span> and
            Secured with{" "}
            <span className="text-purple-400 font-mono">JWT + Bcrypt</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
