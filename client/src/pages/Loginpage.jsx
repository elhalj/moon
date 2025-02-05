import { useState } from "react";
import { useAuthStore } from "../store/useAthStore.js";
import arriere3 from "../assets/arriere3.jpg";
import arriere2 from "../assets/arriere2.jpeg";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";

function Loginpage() {
  const [showPassword, setShowPassword] = useState(false);

  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });

  const { login, isLogin } = useAuthStore();

  const validateForm = () => {
    if (!formdata.email.trim()) return toast.error("email is require");
    if (formdata.password.length < 6)
      return toast.error("password must be greater than 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) login(formdata);
    return
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col xl:flex xl:flex-row rounded-lg"
      style={{ backgroundImage: `url(${arriere3})` }}
    >
      <h1 className="text-start absolute p-4 m-4 text-3xl text-blue-200">
        Hello! <br /> Welcome back
      </h1>
      <div className="flex flex-col items-center justify-center h-full xl:border-r-2 border-black drop-shadow-xl">
        <div className="bg-opacity-50 border-1 border-slate-500 drop-shadow-lg box-shadow-lg p-8 rounded-xl shadow-lg">
          <h1 className="text-start text-2xl mb-20 xl:mb-0">Login account</h1>
          <form
            onSubmit={handleSubmit}
            className="h-[300px] md:h-[500px] md:w-[500px] flex flex-col items-center justify-center gap-20"
          >
            <div>
              <h1 className="text-white">Email</h1>
              <input
                type="email"
                value={formdata.email}
                onChange={(e) =>
                  setFormdata({ ...formdata, email: e.target.value })
                }
                className="h-8 md:h-10 border-b-2 bg-blue-100 bg-opacity-20 text-white outline-none md:w-[300px] p-1 rounded-md"
              />
            </div>
            <div className="relative">
              <h1 className="text-white">Password</h1>
              <input
                type={showPassword ? "text" : "password"}
                value={formdata.password}
                onChange={(e) =>
                  setFormdata({ ...formdata, password: e.target.value })
                }
                className="h-8 md:h-10 border-b-2 bg-blue-100 bg-opacity-20 text-white outline-none md:w-[300px] p-1 rounded-md"
              />
              {showPassword ? (
                <EyeOff
                  className="absolute right-0 bottom-2 inline -translate-x-2 text-blue-400 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <Eye
                  className="absolute right-0 bottom-2 inline -translate-x-2 text-blue-400 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            <div className="absolute bottom-24 xl:bottom-48 lg:bottom-48 md:bottom-48 text-blue-300 underline hover:text-white duration-300">
              <NavLink to="/signup">Dont have an account?</NavLink>
            </div>
            <div>
              <button
                className="btn btn-outline btn-primary tracking-wider"
              >
                {isLogin ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    loading....
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="hidden xl:block">
        <img src={arriere2} alt="bg" className="h-screen bg-cover bg-center " />
      </div>
    </div>
  );
}

export default Loginpage;
