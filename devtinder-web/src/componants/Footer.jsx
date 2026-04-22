import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <div>
      <footer className="footer sm:footer-horizontal fixed bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800/50 text-gray-400 items-center p-4 bottom-0 w-full">
        <aside className="grid-flow-col items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">&lt;/&gt;</span>
            </div>
            <p className="text-sm text-gray-300 flex items-center gap-1">
              © {new Date().getFullYear()} DevTinder. Made with
              <Heart size={14} className="text-pink-500 fill-pink-500" />
            </p>
          </div>
        </aside>

        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-gray-400 hover:text-pink-400 transition-colors duration-200 hover:scale-110 transform"
          >
            <FaTwitter size={20} />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-gray-400 hover:text-pink-400 transition-colors duration-200 hover:scale-110 transform"
          >
            <FaLinkedin size={20} />
          </a>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-gray-400 hover:text-pink-400 transition-colors duration-200 hover:scale-110 transform"
          >
            <FaGithub size={20} />
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
