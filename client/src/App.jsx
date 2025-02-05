import { useEffect } from "react";
import { useAuthStore } from "./store/useAthStore.js";
import { Loader } from "lucide-react";
import Navbar from './components/Navbar.jsx';
import Signuppage from "./pages/Signuppage.jsx";
import Loginpage from './pages/Loginpage.jsx';
import Settingpage from './pages/settingpage.jsx';
import Logoutpage from './pages/Logoutpage.jsx';
import Homepage from './pages/Homepage.jsx';
import { Navigate, Route, Routes } from "react-router-dom";
import Profilepage from "./pages/Profilepage.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  const { authUser, checkAuth, isCheckingAuth, isOnlineUsers = [] } = useAuthStore();

  console.log({isOnlineUsers})

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <>
      {authUser && <Navbar />}
      <Routes>
        <Route path="/" element={authUser ? <Homepage /> : <Navigate to={"/login"} />} />
        <Route path="/signup" element={!authUser ? <Signuppage /> : <Navigate to={"/"} />} />
        <Route path="/login" element={!authUser ? <Loginpage /> : <Navigate to={"/"} />} />
        <Route path="/setting" element={<Settingpage />} />
        <Route path="/profile" element={authUser ? <Profilepage /> : <Navigate to={"/login"} />} />
        <Route path="/logout" element={<Logoutpage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
