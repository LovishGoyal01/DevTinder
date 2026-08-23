import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="glass-nav fixed bottom-0 left-0 right-0 z-40 px-4 md:px-8 py-2.5 text-slate-400 border-t border-slate-800/60 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs font-medium">
        {/* Left - Brand & Heart */}
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 rounded-md p-0.5 shadow-sm flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[4px] flex items-center justify-center">
              <span className="text-pink-400 font-extrabold text-[9px] tracking-tighter">&lt;/&gt;</span>
            </div>
          </div>
          <span className="text-slate-300 flex items-center gap-1.5 text-xs font-semibold">
            <span>© {new Date().getFullYear()}</span>
            <span className="hidden sm:inline text-white font-bold">DevMatch</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="flex items-center gap-1">
              Built with
              <Heart size={12} className="text-pink-500 fill-pink-500 animate-pulse inline-block" />
              for developers
            </span>
          </span>
        </div>


        {/* Right - Social Links */}
        <div className="flex items-center gap-2">
          <a
            href="https://x.com/LovishGoyal2005"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X / Twitter"
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-sky-500/40 text-slate-400 hover:text-sky-400 transition-all duration-200 group shadow-sm"
            title="Twitter / X"
          >
            <FaTwitter size={14} className="group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="https://www.linkedin.com/in/lovishgoyal01/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-blue-500/40 text-slate-400 hover:text-blue-400 transition-all duration-200 group shadow-sm"
            title="LinkedIn"
          >
            <FaLinkedin size={14} className="group-hover:scale-110 transition-transform" />
          </a>

          <a
            href="https://github.com/LovishGoyal01"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-purple-500/40 text-slate-400 hover:text-slate-100 transition-all duration-200 group shadow-sm"
            title="GitHub"
          >
            <FaGithub size={14} className="group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
