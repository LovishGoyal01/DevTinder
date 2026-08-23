import { Route, Routes } from "react-router-dom";
import Body from "./componants/Body";
import Login from "./componants/Login";
import Profile from "./componants/Profile";
import Feed from "./componants/Feed";
import Connections from "./componants/Connections";
import Requests from "./componants/Requests";
import Chat from "./componants/Chat";

import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster
        position="bottom-right"
        containerStyle={{
          bottom: 24,
          right: 24,
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow:
              "0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(236, 72, 153, 0.15)",
            borderRadius: "14px",
            padding: "12px 18px",
            fontSize: "14px",
            fontWeight: "500",
            maxWidth: "420px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#0f172a",
            },
          },
          error: {
            iconTheme: {
              primary: "#f43f5e",
              secondary: "#0f172a",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<Feed />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="connections" element={<Connections />} />
          <Route path="connections/:targetUserId" element={<Connections />} />
          <Route path="requests" element={<Requests />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
