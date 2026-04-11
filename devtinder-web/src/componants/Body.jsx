import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import NavBar from "./NavBar";

const Body = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const Base_URL = import.meta.env.VITE_BASE_URL

  const user = useSelector((store) => store.user);

  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    if (!user) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(Base_URL + "/profile/view", {
       withCredentials: true,
      });

      if (data.success) {
        dispatch(addUser(data.user));

        if (isLoginPage) {
         toast.success("Welcome " + data.user.firstName);
         navigate("/profile");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
       console.error(error);
        if (!isLoginPage) {
          navigate("/login");
        }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${ isLoginPage ? "bg-gradient-to-b from-rose-500 to-purple-800" : "bg-gradient-to-br from-rose-500 to-indigo-400"}`}>
     
      {/* AUTH HEADER (LOGIN ONLY) */}
      {!isLoginPage && <NavBar /> } 

      <main className="flex-1 flex justify-center">
        <Outlet />
      </main>

      {!isLoginPage && <Footer />}
    </div>
  );
};

export default Body;
