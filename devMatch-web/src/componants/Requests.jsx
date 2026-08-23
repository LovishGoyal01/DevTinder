import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addRequest, removeRequest } from "../utils/requestSlice";
import toast from "react-hot-toast";
import { FiCheck, FiX, FiInbox } from "react-icons/fi";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();

  const Base_URL = import.meta.env.VITE_BASE_URL;

  const [iSDisable, setIsDisable] = useState(false);

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(Base_URL + "/user/requests/received", {
        withCredentials: true,
      });
      if (data.success) {
        if (!requests || requests.length === 0) {
          toast.success(data.message);
        }
        dispatch(addRequest(data.connectionRequest));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRequest = async (status, requestId) => {
    try {
      setIsDisable(true);

      const { data } = await axios.post(
        Base_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true }
      );
      if (data.success) {
        dispatch(removeRequest(requestId));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsDisable(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold text-lg">Fetching requests...</span>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="glass-card max-w-md p-8 rounded-3xl border border-slate-800 flex flex-col items-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center text-3xl mb-4 border border-pink-500/20">
            <FiInbox />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Requests Yet</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            When other developers express interest in matching with you, their requests will show up here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto pb-10">
      <div className="flex items-center justify-between w-full mb-6 px-2">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Match Requests</h1>
          <p className="text-xs text-slate-400">Developers who want to connect with you</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-400 text-xs font-bold">
          {requests.length} Pending
        </span>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {requests.map((request) => {
          const user = request.fromUserId;

          return (
            <div
              key={request._id}
              className="glass-card p-4 rounded-3xl border border-slate-800/80 shadow-xl flex flex-col sm:flex-row items-center gap-4 transition duration-200 hover:border-slate-700"
            >
              {/* Left Avatar */}
              <div className="relative shrink-0">
                <img
                  src={user.photoURL}
                  alt="User"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-700 shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
              </div>

              {/* Middle Info */}
              <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h2 className="font-bold text-base text-white tracking-tight">
                    {user.firstName} {user.lastName}
                  </h2>
                  {user.age && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 w-fit mx-auto sm:mx-0">
                      {user.age} · {user.gender}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {user.about || "Developer interested in working together."}
                </p>

                {user.skills?.length > 0 && (
                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
                    {user.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-900/90 text-pink-300 border border-slate-800 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 3 && (
                      <span className="bg-pink-500/10 text-pink-300 border border-pink-500/20 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                        +{user.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Right Action Buttons */}
              <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                <button
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-pink-500/25 flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  disabled={iSDisable}
                  onClick={() => handleRequest("accepted", request._id)}
                >
                  <FiCheck className="text-sm" />
                  Accept
                </button>

                <button
                  className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                  disabled={iSDisable}
                  onClick={() => handleRequest("rejected", request._id)}
                >
                  <FiX className="text-sm" />
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
