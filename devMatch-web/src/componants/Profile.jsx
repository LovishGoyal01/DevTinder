import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user.data);

  return (
    <>
      {user && (
        <div className="w-full flex items-center justify-center">
          <EditProfile user={user} />
        </div>
      )}
    </>
  );
};

export default Profile;