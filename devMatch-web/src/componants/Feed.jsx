import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const Base_URL = import.meta.env.VITE_BASE_URL;

  const feed = useSelector((store) => store.feed);

  const user = useSelector((store) => store.user.data);
  const isLoaded = useSelector((store) => store.user.isLoaded);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      navigate("/login");
    }
  }, [user, isLoaded]);

  const getFeed = async (currentPage) => {
    if (loading || !hasMore) return;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${Base_URL}/user/feed?page=${currentPage}&limit=${limit}`,
        { withCredentials: true },
      );
      if (data.success) {
        dispatch(addFeed(data.feed));
        setHasMore(data.hasMore);
        if (data.hasMore) {
          setPage((prev) => prev + 1);
        }

        if (currentPage === 1 && data.feed.length > 0) {
          toast.success("Feed fetched successfully!");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasMore && feed.length === 0) {
      getFeed(page);
    }
  }, [feed.length, hasMore]);

  if (!hasMore && feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="glass-card max-w-md p-8 rounded-3xl border border-slate-800 flex flex-col items-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 text-pink-400 flex items-center justify-center text-3xl mb-4 border border-pink-500/30">
            🎉
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">You're all caught up!</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            No more developer profiles available right now. Check back soon or update your profile skills to match with new engineers.
          </p>
          <button
            onClick={() => getFeed(1)}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-pink-400 font-semibold text-xs border border-pink-500/30 hover:border-pink-500/60 transition duration-200"
          >
            Refresh Feed
          </button>
        </div>
      </div>
    );
  }

  if (loading && feed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="glass-card w-[380px] h-[525px] rounded-[28px] p-6 border border-slate-800 flex flex-col justify-between animate-pulse">
          <div className="w-full h-64 bg-slate-800/60 rounded-2xl mb-4" />
          <div className="space-y-3">
            <div className="h-6 bg-slate-800/80 rounded-lg w-2/3" />
            <div className="h-4 bg-slate-800/50 rounded-lg w-full" />
            <div className="h-4 bg-slate-800/50 rounded-lg w-4/5" />
          </div>
          <div className="flex gap-2 pt-4">
            <div className="h-10 bg-slate-800/80 rounded-xl flex-1" />
            <div className="h-10 bg-slate-800/80 rounded-xl flex-1" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-4">
      <div className="w-full max-w-[420px]">
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;
