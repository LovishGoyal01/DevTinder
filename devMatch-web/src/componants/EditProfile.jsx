import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import UserCard from "./UserCard";
import toast from "react-hot-toast";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const Base_URL = import.meta.env.VITE_BASE_URL;

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");

  const [skillsInput, setSkillsInput] = useState(
    user?.skills?.join(", ") || "",
  );

  const MAX_SKILL_LENGTH = 20;
  const parsedSkills = skillsInput
    .split(",")
    .map((s) => s.trim().slice(0, MAX_SKILL_LENGTH))
    .filter(Boolean);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "user_photos");

    try {
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dkfpmhm1h/image/upload",
        formData,
      );
      return data.secure_url;
    } catch (error) {
      toast.error("Image upload failed");
      return null;
    }
  };

  const handleEdit = async () => {
    try {
      const { data } = await axios.patch(
        Base_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoURL,
          age,
          gender,
          about,
          skills: parsedSkills,
        },
        { withCredentials: true },
      );

      if (data.success) {
        const updatedUser = data.user;
        setFirstName(updatedUser.firstName || firstName);
        setLastName(updatedUser.lastName || lastName);
        setPhotoURL(updatedUser.photoURL || photoURL);
        setAge(updatedUser.age || age);
        setGender(updatedUser.gender || gender);
        setAbout(updatedUser.about || about);
        setSkillsInput(updatedUser.skills?.join(", ") || skillsInput);

        dispatch(addUser(updatedUser));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong!!";
      toast.error(message);
    }
  };


  const isFormValid =
    parsedSkills.length > 0 &&
    photoURL &&
    photoURL !== "Uploading..." &&
    about.length >= 75;

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-6 w-full max-w-5xl mx-auto">
      {/* EDIT FORM */}
      <div className="glass-card w-full max-w-[440px] p-5 md:p-6 rounded-3xl border border-slate-800/80 shadow-2xl space-y-3.5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Edit Profile</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Update your developer details to stand out in the feed.
          </p>
        </div>

        <div className="space-y-3">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                First Name
              </label>
              <input
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 transition"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Last Name
              </label>
              <input
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 transition"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Profile Photo Upload */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
              Profile Photo
            </label>
            <div className="flex items-center gap-3 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 shrink-0 relative">
                {photoURL === "Uploading..." ? (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <span className="w-4 h-4 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <img
                    src={photoURL || "https://res.cloudinary.com/dkfpmhm1h/image/upload/v1775919348/boy_t5cyyl.jpg"}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://res.cloudinary.com/dkfpmhm1h/image/upload/v1775919348/boy_t5cyyl.jpg";
                    }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-white leading-tight">Avatar</h4>
                  <p className="text-[10px] text-slate-400 truncate">
                    {photoURL === "Uploading..."
                      ? "Uploading..."
                      : photoURL
                      ? "Custom photo set"
                      : "Default avatar"}
                  </p>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-pink-400 border border-slate-700 text-[11px] font-bold transition flex items-center gap-1 shrink-0"
                  onClick={() => document.getElementById("photoFile").click()}
                >
                  {photoURL === "Uploading..." ? (
                    <span className="w-3 h-3 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Upload Photo"
                  )}
                </button>
              </div>
            </div>
            <input
              id="photoFile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                setPhotoURL("Uploading...");
                const url = await uploadToCloudinary(file);
                if (url) setPhotoURL(url);
              }}
            />
          </div>

          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Gender
              </label>
              <select
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 transition"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled className="bg-slate-900 text-slate-400">
                  Select Gender
                </option>
                <option value="Male" className="bg-slate-900 text-white">Male</option>
                <option value="Female" className="bg-slate-900 text-white">Female</option>
                <option value="Other" className="bg-slate-900 text-white">Other</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Age
              </label>
              <input
                type="number"
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 transition"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          {/* About / Bio */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Developer Bio
              </label>
              <span className={`text-[10px] font-semibold ${about.length >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
                {about.length}/150 (min 75)
              </span>
            </div>
            <textarea
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 transition resize-none h-16"
              maxLength={150}
              placeholder="Tell other devs about your background, projects, or interests..."
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
            {about.length < 75 && (
              <p className="text-[10px] text-amber-400 mt-0.5">
                ⚠️ Bio must be at least 75 characters long to save.
              </p>
            )}
          </div>

          {/* Skills Field */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1">
              Skills (Comma Separated)
            </label>
            <input
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 transition"
              placeholder="React, Node.js, TypeScript, Tailwind"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
            />
            {parsedSkills.length === 0 && (
              <p className="text-[10px] text-amber-400 mt-0.5">
                ⚠️ Please enter at least 1 skill.
              </p>
            )}
          </div>

          {/* Save Action */}
          <button
            disabled={!isFormValid}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition duration-200 disabled:opacity-40 disabled:pointer-events-none mt-1"
            onClick={handleEdit}
          >
            Save Profile Changes
          </button>
        </div>
      </div>

      {/* LIVE PREVIEW PANE */}
      <div className="w-full max-w-[380px] lg:w-auto flex flex-col items-center shrink-0">
        <UserCard
          user={{
            firstName,
            lastName,
            photoURL,
            age,
            gender,
            about,
            skills: parsedSkills,
          }}
        />
      </div>
    </div>
  );
};

export default EditProfile;
