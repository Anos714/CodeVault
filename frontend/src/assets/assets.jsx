//Home page assets
import { Code2, Search, Database, Lock, Terminal, Layers } from "lucide-react";
import { SiExpress } from "react-icons/si";
import { SiMongodb } from "react-icons/si";
import { FaNodeJs } from "react-icons/fa";
import { FaReact } from "react-icons/fa";
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
    icon: <SiExpress className="text-5xl" />,
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

export { features, stack };
