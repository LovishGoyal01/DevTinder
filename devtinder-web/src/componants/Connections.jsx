import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Chat from "./Chat";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { targetUserId } = useParams();
  const [selectedUserId, setSelectedUserId] = useState(targetUserId || null);

  const Base_URL = import.meta.env.VITE_BASE_URL;

  const fetchConnections = async () => {
    try {
      const { data } = await axios.get(Base_URL + "/user/connections", {
        withCredentials: true,
      });

      if (data.success) {
        dispatch(addConnections(data.connections));
        toast.success(data.message);
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

  if (!connections) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h1 className="text-white text-2xl font-semibold">
          Fetching connections…
        </h1>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h1 className="text-white text-2xl font-semibold mb-2">
          No connections yet 👋
        </h1>
        <p className="text-white/80 text-sm max-w-md">
          Go to the feed and start exploring to find people you’d like to
          connect with.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col fixed items-center pt-24 pb-24 w-full max-w-[1200px] mx-auto">

      <div className="flex flex-col lg:flex-row gap-4 w-full">
        <div className="lg:w-[380px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-2.5 border-b">
            <h2 className="text-lg font-semibold text-slate-900">
              Your Connections
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a contact to open the chat.
            </p>
          </div>

          <div className="divide-y divide-slate-200">
            {connections.map((user) => {
              const isActive = user._id === selectedUserId;
              return (
                <Link key={user._id} to={`/connections/${user._id}`}>
                  <div
                    className={`flex items-center gap-4 px-4 py-4 hover:bg-slate-100 transition ${isActive ? "bg-slate-100" : "bg-white"}`}
                  >
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                      <h3 className="font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <h2>{user.age} {user.gender}</h2>
                      </div>
                     
                      <p className="text-sm text-slate-500 line-clamp-2">
                        {user.about}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-[500px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
          {selectedUserId ? (
            <Chat
              targetUserId={selectedUserId}
              chatUser={connections.find((user) => user._id === selectedUserId)}
              embedded
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Select a connection
              </h2>
              <p className="text-slate-600 max-w-md">
                Click any connection on the left to start chatting without
                leaving the page.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-20" />
    </div>
  );
};

export default Connections;
