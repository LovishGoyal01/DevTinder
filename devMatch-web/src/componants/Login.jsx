import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCode, FiMessageSquare, FiZap, FiArrowRight } from "react-icons/fi";

const Login = () => {
  const Base_URL = import.meta.env.VITE_BASE_URL;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastname] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");

  const [isDisable, setIsDisable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((store) => store.user.data);

  useEffect(() => {
    if (!user) return;
    navigate("/profile");
  }, [user, navigate]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsDisable(true);
      const { data } = await axios.post(
        Base_URL + "/login",
        { emailId, password },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        dispatch(addUser(data.user));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsDisable(false);
    }
  };

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    try {
      setIsDisable(true);
      const { data } = await axios.post(
        Base_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        dispatch(addUser(data.user));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsDisable(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative py-12 px-4">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* LEFT SIDE HERO */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 text-left px-2 md:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider w-fit">
            <FiZap className="text-sm" /> The Developer Matchmaking Network
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Connect with devs who speak your <span className="text-gradient-pink">code language.</span>
          </h1>

          <p className="text-slate-400 text-base leading-relaxed">
            Discover passionate engineers, match based on tech stacks & interests, and start real-time conversations to collaborate on awesome projects.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="glass-card p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <FiCode className="text-xl" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Tech Stack</h4>
                <p className="text-[11px] text-slate-400">Match by skills</p>
              </div>
            </div>

            <div className="glass-card p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <FiMessageSquare className="text-xl" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Live Chat</h4>
                <p className="text-[11px] text-slate-400">Real-time sockets</p>
              </div>
            </div>

            <div className="glass-card p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <FiZap className="text-xl" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Collab</h4>
                <p className="text-[11px] text-slate-400">Build together</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE FORM CARD */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Toggle Header Tabs */}
            <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 mb-8">
              <button
                type="button"
                onClick={() => setIsLoginForm(true)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isLoginForm
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsLoginForm(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  !isLoginForm
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Create Account
              </button>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {isLoginForm ? "Welcome back 👋" : "Join DevMatch 🚀"}
            </h2>
            <p className="text-slate-400 text-xs mb-6">
              {isLoginForm
                ? "Enter your credentials to access your developer feed"
                : "Create a dev profile and showcase your skills to the community"}
            </p>

            <form onSubmit={isLoginForm ? handleLogin : handleSignup} className="space-y-4">
              {!isLoginForm && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input
                      type="text"
                      placeholder="First Name"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-500 focus:border-pink-500 focus:bg-slate-900 transition"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required={!isLoginForm}
                    />
                  </div>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-500 focus:border-pink-500 focus:bg-slate-900 transition"
                      value={lastName}
                      onChange={(e) => setLastname(e.target.value)}
                      required={!isLoginForm}
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type="email"
                  placeholder="Developer Email"
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-pink-500 focus:bg-slate-900 transition"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:border-pink-500 focus:bg-slate-900 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <FiEyeOff className="text-base" /> : <FiEye className="text-base" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isDisable}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50"
              >
                {isDisable ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLoginForm ? "Sign In to Account" : "Complete Registration"}</span>
                    <FiArrowRight className="text-base" />
                  </>
                )}
              </button>
            </form>

            <p
              onClick={() => setIsLoginForm(!isLoginForm)}
              className="mt-6 text-center text-xs text-slate-400 hover:text-pink-400 cursor-pointer transition"
            >
              {isLoginForm
                ? "Don't have an account yet? Create one now"
                : "Already registered? Sign in here"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;