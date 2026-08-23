import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Chat from "./Chat";
import { FiSearch, FiMessageSquare, FiUserCheck } from "react-icons/fi";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { targetUserId } = useParams();
  const [selectedUserId, setSelectedUserId] = useState(targetUserId || null);
  const [searchQuery, setSearchQuery] = useState("");

  const Base_URL = import.meta.env.VITE_BASE_URL;

  const fetchConnections = async () => {
    try {
      const { data } = await axios.get(Base_URL + "/user/connections", {
        withCredentials: true,
      });

      if (data.success) {
        if (!connections || connections.length === 0) {
          toast.success(data.message);
        }
        dispatch(addConnections(data.connections));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    if (targetUserId) {
      setSelectedUserId(targetUserId);
    }
  }, [targetUserId]);

  useEffect(() => {
    if (!connections || connections.length === 0) return;
    if (targetUserId) return;

    const firstConnectionId = connections[0]._id;
    setSelectedUserId(firstConnectionId);
    navigate(`/connections/${firstConnectionId}`, { replace: true });
  }, [connections, targetUserId, navigate]);

  const filteredConnections = (connections || []).filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!connections) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-semibold text-lg">Fetching connections...</span>
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="glass-card max-w-md p-8 rounded-3xl border border-slate-800 flex flex-col items-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-3xl mb-4 border border-purple-500/20">
            <FiUserCheck />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No connections yet</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Swipe right or send interest requests on the developer feed to form mutual matches and unlock messaging.
          </p>
          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition"
          >
            Explore Developer Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-20 bottom-16 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 overflow-hidden z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-full overflow-hidden">
        {/* LEFT SIDEBAR: CONNECTIONS LIST */}
        <div className="lg:col-span-4 glass-card rounded-3xl border border-slate-800/80 shadow-2xl flex flex-col h-full overflow-hidden">
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-800/80 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Connections</span>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-xs font-bold">
                  {connections.length}
                </span>
              </h2>
            </div>

            {/* Filter Input */}
            <div className="relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
              <input
                type="text"
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 transition"
              />
            </div>
          </div>

          {/* Connections List Scroll Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-800/40 p-2 space-y-1">
            {filteredConnections.map((user) => {
              const isActive = user._id === selectedUserId;
              return (
                <Link key={user._id} to={`/connections/${user._id}`}>
                  <div
                    className={`flex items-center gap-3.5 p-3 rounded-2xl transition duration-200 ${
                      isActive
                        ? "bg-slate-800/90 border border-pink-500/40 shadow-lg shadow-pink-500/10"
                        : "hover:bg-slate-900/80 border border-transparent"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={user.photoURL}
                        alt="User"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-bold text-sm text-slate-100 truncate">
                          {user.firstName} {user.lastName}
                        </h3>
                        {user.age && (
                          <span className="text-[11px] font-medium text-slate-400">
                            {user.age}y
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {user.about || user.skills?.[0] || "Developer"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}

            {filteredConnections.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-xs">
                No connections matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CHAT PANE */}
        <div className="lg:col-span-8 glass-card rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col h-full">
          {selectedUserId ? (
            <Chat
              targetUserId={selectedUserId}
              chatUser={connections.find((user) => user._id === selectedUserId)}
              embedded
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center text-2xl border border-pink-500/20">
                <FiMessageSquare />
              </div>
              <h2 className="text-xl font-bold text-white">Select a connection</h2>
              <p className="text-slate-400 text-xs max-w-sm">
                Choose any developer connection from the list on the left to launch real-time messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Connections;
