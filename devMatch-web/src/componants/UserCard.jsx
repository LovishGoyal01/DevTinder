import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlineHeart } from "react-icons/ai";
import { useLocation } from "react-router-dom";

const DEFAULT_AVATAR = "https://res.cloudinary.com/dkfpmhm1h/image/upload/v1775919348/boy_t5cyyl.jpg";

const UserCard = ({ user }) => {
  if (!user) return null;

  const Base_URL = import.meta.env.VITE_BASE_URL;
  const location = useLocation();

  const isProfilePage = location.pathname === "/profile";

  const {
    _id,
    firstName,
    lastName,
    photoURL,
    age,
    gender,
    about,
    skills = [],
  } = user;

  const [imgError, setImgError] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();

  const isUploading = photoURL === "Uploading...";
  const displayPhoto = (!photoURL || imgError || isUploading) ? DEFAULT_AVATAR : photoURL;

  const MAX_TOTAL_CHARS = 50;
  const MAX_SKILLS = 3;
  const LONG_SKILL_THRESHOLD = 12;

  const hasLongSkill = skills.some(
    (skill) => skill.length > LONG_SKILL_THRESHOLD
  );
  const skillCap = hasLongSkill ? 2 : MAX_SKILLS;

  let visibleSkills = [];
  let totalLength = 0;

  for (let skill of skills) {
    if (
      visibleSkills.length < skillCap &&
      totalLength + skill.length + 6 <= MAX_TOTAL_CHARS
    ) {
      visibleSkills.push(skill);
      totalLength += skill.length;
    } else {
      break;
    }
  }

  const hiddenCount = Math.max(0, skills.length - visibleSkills.length);

  const handleSendRequest = async (status, userId) => {
    try {
      if (isProfilePage) return;
      setIsSending(true);

      const { data } = await axios.post(
        `${Base_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(removeUserFromFeed(userId));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[380px] h-[525px] rounded-[28px] overflow-hidden glass-card border border-slate-800/80 shadow-[0_20px_60px_rgba(236,72,153,0.18)] hover:border-pink-500/30 transition-all duration-300 flex flex-col justify-between group">
      {/* Top Image Section */}
      <div className="relative overflow-hidden h-[300px] bg-slate-900 flex-shrink-0">
        {isUploading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-pink-400 gap-2">
            <span className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-semibold">Uploading Image...</span>
          </div>
        ) : (
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={displayPhoto}
            alt={`${firstName || "Developer"} ${lastName || ""}`}
            onError={() => setImgError(true)}
          />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />


        {/* User basic metadata bottom overlay */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h2 className="text-2xl font-black tracking-tight text-white drop-shadow-md truncate">
            {firstName || "First Name"} {lastName || "Last Name"}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md border border-white/10 text-slate-200">
              {gender || "Developer"}
            </span>
            {age && (
              <span className="text-xs font-medium text-slate-300">
                {age} yrs old
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content Info & Skills */}
      <div className="px-5 py-4 flex-1 flex flex-col justify-between space-y-3">
        <p className="text-slate-300 text-xs leading-normal line-clamp-3 h-[54px] overflow-hidden">
          {about ||
            "Full-stack engineer passionate about modern Web3 & React applications, clean code architecture, and high performance APIs."}
        </p>

        {/* Skill badges */}
        <div className="flex flex-wrap gap-1.5">
          {visibleSkills.length > 0 ? (
            visibleSkills.map((skill, index) => (
              <span
                key={index}
                title={skill}
                className="rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-pink-300/90 hover:border-pink-500/40 hover:text-pink-200 transition-colors shadow-sm"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="rounded-xl border border-slate-800/80 bg-slate-900/50 px-3 py-1 text-[11px] font-medium text-slate-500 italic">
              No skills added yet
            </span>
          )}
          {hiddenCount > 0 && (
            <span className="rounded-xl border border-pink-500/30 bg-pink-500/10 px-2.5 py-1 text-[11px] font-bold text-pink-300">
              +{hiddenCount} more
            </span>
          )}
        </div>

        {/* Bottom Actions */}
        {!isProfilePage ? (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
            <button
              className="flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 py-3 text-xs font-bold text-slate-300 hover:text-rose-400 hover:bg-slate-800 hover:border-rose-500/30 transition-all duration-200 active:scale-95 disabled:opacity-50"
              disabled={isSending}
              onClick={() => handleSendRequest("ignored", _id)}
            >
              <AiOutlineClose className="text-base text-slate-400 group-hover:text-rose-400" />
              Ignore
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-pink-500/25 transition-all duration-200 active:scale-95 disabled:opacity-50"
              disabled={isSending}
              onClick={() => handleSendRequest("interested", _id)}
            >
              <AiOutlineHeart className="text-base text-white" />
              Connect
            </button>
          </div>
        ) : (
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] font-semibold text-slate-400">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span>Live Card Preview</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
