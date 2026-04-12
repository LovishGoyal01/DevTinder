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

  const [isAILoading, setIsAILoading] = useState(false);
  const [aiAbout, setAiAbout] = useState("");
  const [showAIPreview, setShowAIPreview] = useState(false);

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

  const handleAIImprove = async () => {
    try {
      setIsAILoading(true);

      const { data } = await axios.get(Base_URL + "/profile/gptAbout", {
        withCredentials: true,
      });

      if (data.success) {
        setAiAbout(data.about);
        setShowAIPreview(true);
        toast.success("AI suggestion ready ✨");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "AI generation failed";
      toast.error(message);
    } finally {
      setIsAILoading(false);
    }
  };

  if (isAILoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-pink-500"></span>
        <p className="mt-2 font-medium">Improving your profile with AI…</p>
      </div>
    );
  }

  if (showAIPreview) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p className="text-gray-700 text-center max-w-md">{aiAbout}</p>

        <div className="flex gap-4">
          <button
            className="btn bg-green-500 text-white"
            onClick={() => {
              setAbout(aiAbout);
              setShowAIPreview(false);
            }}
          >
            Accept
          </button>

          <button
            className="btn bg-gray-300"
            onClick={() => setShowAIPreview(false)}
          >
            Reject
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-10 ">
      {/* EDIT FORM */}
      <div className="card bg-white w-[420px] shadow-md">
        <div className="card-body p-4">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Edit Profile</h2>

          {/* Name */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-600">
                First Name
              </label>
              <input
                className="input w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-600">
                Last Name
              </label>
              <input
                className="input w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          {/* Profile Photo */}
          <div className="mt-2">
            <label className="text-sm font-medium text-gray-600">
              Profile Photo
            </label>
            <button
              type="button"
              className="ml-2 btn btn-sm bg-white border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 hover:border-blue-500 transition-all duration-150"
              onClick={() => document.getElementById("photoFile").click()}
            >
              {photoURL === "Uploading..." ? "Uploading..." : "Select Image"}
            </button>
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

          {/* Gender & Age */}
          <div className="flex gap-4 mt-2">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-600">
                Gender
              </label>
              <select
                className="select w-full"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>
                  Select
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-600">Age</label>
              <input
                type="number"
                className="input w-full"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>

          {/* About */}
          <div className="mt-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-600">About</label>
              <button
                type="button"
                onClick={handleAIImprove}
                className="text-xs font-medium text-pink-500 hover:text-sm hover:font-semibold "
              >
                ✨ Improve with AI
              </button>
            </div>
            <textarea
              className="textarea w-full resize-none h-[64px]"
              maxLength={150}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
            <p className="text-xs text-gray-500 text-right">
              {about.length}/150 characters
            </p>
          </div>

          {/* Skills */}
          <div className="-mt-2">
            <label className="text-sm font-medium text-gray-600">
              {" "}
              Skills (comma separated)
            </label>
            <input
              className="input w-full"
              placeholder="React, Node.js, MongoDB"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
            />
          </div>

          {/* Save */}
          <button
            disabled={
              parsedSkills.length === 0 ||
              !photoURL ||
              photoURL === "Uploading..." ||
              about.length < 75
            }
            className="btn bg-pink-500 disabled:bg-pink-300 hover:bg-pink-600 text-white mt-2"
            onClick={handleEdit}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* LIVE PREVIEW */}
      <div className="sticky top-10">
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
