import { useState } from "react";
import { useAuthStore } from "../store/useAthStore";
import arriere3 from "../assets/arriere3.jpg";
import arriere2 from "../assets/arriere2.jpeg";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";

function Signuppage() {
  const [showPassword, setShowPassword] = useState(false);

  const [formdata, setFormdata] = useState({
    email: "",
    fullname: "",
    password: "",
  });

  const { signup, isSignup } = useAuthStore();

  const validateForm = () => {
    if (!formdata.fullname.trim()) return toast.error("fullname is require");
    if (!formdata.email.trim()) return toast.error("email is require");
    // regular expression for email
    // regular expression for email
    if (!formdata.password.trim()) return toast.error("password is require");
    if (formdata.password.length < 6)
      return toast.error("password must be greater than 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formdata);
  };

  return (
    <div
      className="h-screen bg-cover bg-center flex flex-col xl:flex xl:flex-row rounded-lg"
      style={{ backgroundImage: `url(${arriere3})` }}
    >
      <h1 className="text-start absolute p-4 m-4 text-3xl text-blue-200">
        Hello! <br /> Good morning
      </h1>
      <div className="flex flex-col items-center justify-center h-full xl:border-r-2 border-black drop-shadow-xl">
        <div className=" bg-opacity-50 border-1 border-slate-500 drop-shadow-lg box-shadow-lg p-8 rounded-xl shadow-lg">
          {/* Form content here */}
          <h1 className="text-start text-2xl mb-20 xl:mb-0 ">
            Signup account
          </h1>
          <form
            onSubmit={handleSubmit}
            className="h-[300px] md:h-[500px] md:w-[500px] flex flex-col items-center justify-center gap-16"
          >
            <div>
              <h1 className="text-white">email</h1>
              <input
                type="email"
                value={formdata.email}
                onChange={(e) =>
                  setFormdata({ ...formdata, email: e.target.value })
                }
                className="h-8 md:h-10 border-b-2 bg-blue-100 bg-opacity-20 text-white outline-none md:w-[300px] p-1 rounded-md"
              />
            </div>
            <div>
              <h1 className="text-white">fullname</h1>
              <input
                type="text"
                value={formdata.fullname}
                onChange={(e) =>
                  setFormdata({ ...formdata, fullname: e.target.value })
                }
                className="h-8 md:h-10 border-b-2 bg-blue-100 bg-opacity-20 text-white outline-none md:w-[300px] p-1 rounded-md"
              />
            </div>
            <div className="relative">
              <h1 className="text-white">password</h1>
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
            <div className="absolute bottom-8 xl:bottom-32 lg:bottom-28 md:bottom-32 text-blue-300 underline hover:text-white duration-300">
              <NavLink to="/login">You have an account ?</NavLink>
            </div>
            <div>
              <div>
                <button
                  type="submit"
                  className="btn btn-outline btn-primary tracking-wider"
                >
                  {isSignup ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
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

export default Signuppage;
