import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 h-[100px] border-t-3 border-slate-700 ">
      <div className="flex flex-col justify-center items-center h-full  w-full md:gap-5">
        <p>&copy; 2024 CodeVault. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a
            href="https://linkedin.com/in/rahulxcode"
            target="_blank"
            className="hover:text-blue-400 transition-colors"
          >
            <Linkedin />
          </a>
          <a
            href="https://x.com/RahulSain714"
            target="_blank"
            className="hover:text-blue-400 transition-colors"
          >
            <Twitter />
          </a>
          <a
            href="https://github.com/Anos714"
            target="_blank"
            className="hover:text-blue-400 transition-colors"
          >
            <Github />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
