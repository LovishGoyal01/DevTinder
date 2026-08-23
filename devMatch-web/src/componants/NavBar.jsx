import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { disconnectSocket } from "../utils/socket";
import { FiHome, FiUser, FiUsers, FiMail, FiLogOut } from "react-icons/fi";

const NavBar = () => {
  const Base_URL = import.meta.env.VITE_BASE_URL;
  const user = useSelector((store) => store.user?.data);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (!user) {
      navigate("/login");
    }else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(Base_URL + "/logout", {}, { withCredentials: true });
      disconnectSocket();
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;
  const isActive2 = (path) => location.pathname.startsWith(path);

  return (
    <header className="glass-nav fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left - Logo */}
        <div className="flex items-center">
          <div
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 rounded-xl p-0.5 shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 group-hover:scale-105 transition-all duration-200">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-pink-400 font-extrabold text-sm tracking-tighter group-hover:text-pink-300">&lt;/&gt;</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight flex items-center">
                <span className="text-white">Dev</span>
                <span className="text-gradient-pink">Match</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">Dev Network</span>
            </div>
          </div>
        </div>

        {/* Center - Navigation Items */}
        {user && (
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 shadow-inner">
            {/* Feed Link */}
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive("/")
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <FiHome className="text-base" />
              <span>Feed</span>
            </Link>

            {/* Profile Link */}
            <Link
              to="/profile"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive("/profile")
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <FiUser className="text-base" />
              <span>Profile</span>
            </Link>

            {/* Connections Link */}
            <Link
              to="/connections"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive2("/connections")
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <FiUsers className="text-base" />
              <span>Connections</span>
            </Link>

            {/* Requests Link */}
            <Link
              to="/requests"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive("/requests")
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <FiMail className="text-base" />
              <span>Requests</span>
            </Link>
          </nav>
        )}

        {/* Right - User Avatar & Quick Actions */}
        {user && (
          <div className="flex items-center gap-3">
            {/* Mobile Nav Links Icon Bar */}
            <div className="flex md:hidden items-center gap-2 mr-1">
              <Link to="/" className={`p-2 rounded-lg ${isActive('/') ? 'text-pink-400' : 'text-slate-400'}`}>
                <FiHome className="text-lg" />
              </Link>
              <Link to="/connections" className={`p-2 rounded-lg ${isActive2('/connections') ? 'text-pink-400' : 'text-slate-400'}`}>
                <FiUsers className="text-lg" />
              </Link>
              <Link to="/requests" className={`p-2 rounded-lg ${isActive('/requests') ? 'text-pink-400' : 'text-slate-400'}`}>
                <FiMail className="text-lg" />
              </Link>
            </div>

            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs text-slate-400 font-medium">Logged in as</span>
              <span className="text-sm font-bold text-slate-100 leading-tight">
                {user.firstName} {user.lastName ? user.lastName[0] + "." : ""}
              </span>
            </div>

            {/* Avatar with status ring */}
            <Link to="/profile" className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-xl overflow-hidden p-0.5 bg-gradient-to-br from-pink-500 to-purple-600 group-hover:scale-105 transition-transform duration-200 shadow-md">
                <img
                  alt="User Photo"
                  src={user.photoURL}
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-all duration-200"
              title="Log out"
            >
              <FiLogOut className="text-base" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
