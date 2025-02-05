import { Circle, LogOut, Menu, MessageCircleMore, Settings } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAthStore";
import { useState } from "react";
import avatar from "../assets/arriere2.jpeg";

function Navbar() {
  const { logout, authUser } = useAuthStore();

  const [showMenu, setShowmenu] = useState(false);

  // const menuRef = useRef(null);

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setShowmenu(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [menuRef]);

  return (
    <header
      className={
        showMenu
          ? "bg-amber-500 bg-opacity-20 fixed top-0 w-screen p-4 z-20 duration-300"
          : "bg-opacity-0 md:bg-amber-500 md:bg-opacity-20 lg:bg-amber-500 lg:bg-opacity-20 xl:bg-amber-500 xl:bg-opacity-20 fixed top-0 w-screen p-4 z-20 duration-300"
      }
    >
      <div className="flex flex-col lg:flex lg:flex-row md:flex md:flex-row justify-between">
        <div className="flex">
          <Menu
            className="xl:hidden md:hidden cursor-pointer text-amber-500"
            onClick={() => setShowmenu(!showMenu)}
          />
          <Link to="/">
            <h1 className="ml-2 text-xl xl:text-4xl font-serif text-blue-700">MoonChat<MessageCircleMore  className="inline m-1 text-amber-700 xl:size-8 animate-bounce"/></h1>
          </Link>
        </div>
        <div
          className={
            showMenu
              ? "flex flex-row justify-around xl:flex xl:flex-row lg:flex lg:flex-row md:flex md:flex-row mt-4 gap-10"
              : "hidden xl:flex xl:flex-row lg:flex lg:flex-row md:flex md:flex-row gap-10 justify-center items-center"
          }
        >
          <button onClick={() => console.log(authUser)}>
            <NavLink
              className="flex flex-col xl:flex xl:flex-row gap-2 justify-center"
              to="/profile"
            >
              <div className="relative">
                {authUser ? (
                  <img
                    src={authUser.profilePic || avatar}
                    alt="profile"
                    className="size-12 rounded-full object-cover border-2 p-1"
                  />
                ) : (
                  ""
                )}
                <Circle className="absolute top-0 right-0 size-4 bg-green-500 rounded-full border animate-pulse"/>
              </div>
              {/* <User2 /> */}
            </NavLink>
          </button>
          <NavLink to="/setting">
            <Settings />
          </NavLink>
          <button
            className="flex gag-2 border-1 border-amber-600"
            onClick={logout}
            to="/login"
          >
            <LogOut />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
