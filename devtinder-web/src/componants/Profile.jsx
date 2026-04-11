import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import toast from "react-hot-toast";
import { useEffect } from "react";

const Profile = ()=> {

  const user = useSelector((store) => store.user); 
  useEffect(() => {
    if (user && !user.isProfileCompleted) {
     toast.error("Complete Profile First");
    }
  }, [user]);
  
  return (
    <>
   {user && <div className="flex items-center"><EditProfile user={user} /></div> }
    </>
  )
}

export default Profile;