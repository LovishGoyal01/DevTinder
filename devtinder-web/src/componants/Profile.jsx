import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import toast from "react-hot-toast";
import { useEffect } from "react";

const Profile = ()=> {

  const user = useSelector((store) => store.user.data); 
  const isLoaded = useSelector((store) => store.user.isLoaded);

  useEffect(() => {
    if (!isLoaded) return;

    if (user && !user.isProfileCompleted) {
      setTimeout(() => {
       toast.error("Complete Profile First");
       }, 1000);
    }
  }, [user, isLoaded]);
  
  return (
    <>
   {user && <div className="flex items-center"><EditProfile user={user} /></div> }
    </>
  )
}

export default Profile;