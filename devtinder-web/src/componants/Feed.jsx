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
    } else if (!user.isProfileCompleted) {
      navigate("/profile");
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
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h1 className="text-white text-2xl font-semibold mb-2">
          You're all caught up 🎉
        </h1>
        <p className="text-white/80 text-sm max-w-md">
          No more profiles to show right now. Check back later or refresh the
          feed to discover new connections.
        </p>
      </div>
    );
  }

  if (loading && feed.length === 0) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <h1 className="text-white text-2xl font-semibold">Fetching users...</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center px-4  pb-10">
      <div className="w-full max-w-[420px]">
        <UserCard user={feed[0]} />
      </div>
    </div>
  );
};

export default Feed;
