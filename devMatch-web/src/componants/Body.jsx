import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import NavBar from "./NavBar";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const Base_URL = import.meta.env.VITE_BASE_URL;

  const [loading, setLoading] = useState(true);

  const user = useSelector((store) => store.user.data);

  const isLoginPage = location.pathname === "/login";
  const isProfilePage = location.pathname === "/profile";

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(Base_URL + "/profile/view", {
        withCredentials: true,
      });

      if (data.success) {
        dispatch(addUser(data.user));

        if (isLoginPage) {
          toast.success("Welcome " + data.user.firstName);
          navigate("/profile");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      if (!isLoginPage) {
        navigate("/login");
      }
    } finally {
      setLoading(false); // ✅ IMPORTANT
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] text-white">
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-0.5 animate-pulse mb-4 shadow-lg shadow-pink-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-pink-400 font-extrabold text-sm tracking-tighter">&lt;/&gt;</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-300 font-medium tracking-wide text-sm">Initializing DevMatch...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 relative overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Ambient background glow spotlights */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[128px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Header Navigation */}
      {!isLoginPage && <NavBar />}

      {/* Main Content Area */}
      <main className={`flex-1 flex justify-center items-start z-10 ${
        isLoginPage ? "pt-0 px-0" : isProfilePage ? "pt-20 px-4 pb-4" : "pt-24 px-4 pb-16"
      }`}>
        <Outlet />
      </main>

      {/* Footer Navigation */}
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default Body;
