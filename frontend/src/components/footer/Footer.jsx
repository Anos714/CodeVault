import React from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 pb-10 border-t border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-900 text-slate-500 text-sm">
        <p>&copy; 2024 CodeVault. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a
            href="https://linkedin.com/in/rahulxcode"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            <Linkedin />
          </a>
          <a
            href="https://x.com/RahulSain714"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            <Twitter />
          </a>
          <a
            href="https://github.com/Anos714"
            target="_blank"
            className="hover:text-white transition-colors"
          >
            <Github />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
