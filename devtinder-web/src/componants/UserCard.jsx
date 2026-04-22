import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose, AiOutlineHeart } from "react-icons/ai";

const UserCard = ({ user }) => {
  if (!user) return null;

  const Base_URL = import.meta.env.VITE_BASE_URL;

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

  const MAX_TOTAL_CHARS = 50;
  const MAX_SKILLS = 3;
  const LONG_SKILL_THRESHOLD = 12;

  const hasLongSkill = skills.some(
    (skill) => skill.length > LONG_SKILL_THRESHOLD,
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

  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      setIsSending(true);

      const { data } = await axios.post(
        `${Base_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true },
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
    <div className=" mx-auto w-[370px]  h-[515px] rounded-[26px] overflow-hidden border border-white/10 bg-slate-950/95 shadow-[0_40px_100px_rgba(236,72,153,0.2)]">
      <div className="relative overflow-hidden h-[300px] bg-slate-900">
        <img
          className="w-full h-full object-cover"
          src={photoURL}
          alt={`${firstName} ${lastName}`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />

        <div className="absolute bottom-0 left-0 right-0   bg-gradient-to-t from-black/60 to-black/10  backdrop-blur-sm text-white">
          <div className="flex items-start ml-4 mb-1 justify-between gap-4">
            <div>
              <h2 className="text-gray-300 text-xl font-semibold tracking-tight">
                {firstName} {lastName}
              </h2>
              <p className="mt-1 ml-0.5 text-xs font-semibold text-gray-400">
                {age ? `${age}  ·  ${gender}` : gender || "Developer"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 h-[215px] py-4 space-y-3">
        <p className="text-gray-400 h-[70px] text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {about ||
            "Frontend engineer who loves clean UI, polished animations, and great team collaboration."}
        </p>

        <div className=" flex flex-wrap gap-2">
          {visibleSkills.map((skill, index) => (
            <span
              key={index}
              title={skill}
              className="rounded-full border border-white/10 bg-white/5 
              px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em]
               text-gray-400 hover:text-gray-200 shadow-sm shadow-black/20"
            >
              {skill}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="rounded-full border border-white/10 bg-pink-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-pink-200">
              +{hiddenCount}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-gray-600/70 ">
          <button
            className=" mt-2 flex items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-pink-500/50 hover:bg-slate-800"
            disabled={isSending}
            onClick={() => handleSendRequest("ignored", _id)}
          >
            <AiOutlineClose className="text-lg text-pink-400" />
            Ignore
          </button>
          <button
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-400 disabled:opacity-70"
            disabled={isSending}
            onClick={() => handleSendRequest("interested", _id)}
          >
            <AiOutlineHeart className="text-lg " />
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
