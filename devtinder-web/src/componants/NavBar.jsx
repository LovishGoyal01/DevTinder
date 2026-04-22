import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import toast from "react-hot-toast";
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
    } else if (!user.isProfileCompleted) {
      toast.error("Complete Profile First");
      navigate("/profile");
    } else {
      navigate("/");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(Base_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="navbar bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 shadow-lg border-b border-slate-800/50 
    fixed z-50 top-0 w-full px-6 py-3 ">
      {/* Left - Logo */}
      <div className="flex-1">
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">&lt;/&gt;</span>
          </div>
          <span className="text-xl font-bold">
            <span className="text-white">Dev</span>
            <span className="text-pink-500">Tinder</span>
          </span>
        </div>
      </div>

      {/* Center - Navigation Buttons */}
      {user && (
        <div className="flex gap-6 items-center">
          {/* Feed Button */}
          <Link
            to="/"
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl transition-all font-medium ${
              isActive("/")
                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <FiHome className="text-base" />
            <span>Feed</span>
          </Link>

          {/* Profile Button */}
          <Link
            to="/profile"
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl transition-all font-medium ${
              isActive("/profile")
                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <FiUser className="text-base" />
            <span>Profile</span>
          </Link>

          {/* Connections Button */}
          <Link
            to="/connections/"
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl transition-all font-medium ${
              isActive("/connections")
                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <FiUsers className="text-base" />
            <span>Connections</span>
          </Link>

          {/* Requests Button */}
          <Link
            to="/requests"
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl transition-all font-medium ${
              isActive("/requests")
                ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/30"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            <FiMail className="text-base" />
            <span>Requests</span>
          </Link>
        </div>
      )}

      {/* Right - User Section */}
      {user && (
        <div className="flex-1 flex justify-end items-center gap-4">
          <span className="text-gray-300 text-sm font-medium">
            Hi,{" "}
            <span className="font-semibold text-white">{user.firstName}</span>
          </span>

          {/* User Dropdown */}
          <div className="dropdown dropdown-end">
            <div
              className="rounded-full avatar ring-2 ring-pink-500/50 hover:ring-pink-400  w-10 h-10"
            >
              <div className="rounded-full w-full h-full overflow-hidden">
                <img
                  alt="User Photo"
                  src={user.photoURL}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Logout Icon */}
          <button
            onClick={handleLogout}
            className="btn btn-ghost btn-sm text-gray-400 hover:text-pink-400 transition-colors"
            title="Quick Logout"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
