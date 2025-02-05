import { Camera, Circle, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAthStore";
// import Camera from 'lucide-react';
import avatar from "../assets/arriere2.jpeg";
import { useState } from "react";

function Profilepage() {
  const { authUser, isUpdatingProfile, updatedProfile } = useAuthStore();

  const [selectedImg, setSelectedImage] = useState(null);

  const handleUpdated = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image)
      await updatedProfile({profilePic:base64Image});
    }
  };

  // Fonction pour formater la date
  // const formatDate = (dateString) => {
  //   const options = { year: 'numeric', month: 'long', day: 'numeric' };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div>
        <div className=" flex flex-col justify-center items-center  gap-4 xl:gap-8 bg-amber-300 bg-opacity-20 p-4 xl:p-10 rounded-xl">
          <div className="text-center mb-4 flex flex-col gap-2">
            <h1 className="text-3xl">Profile</h1>
            <p>Your profile information</p>
          </div>
          {/* upload avatar section */}
          <div className="relative">
            <img
              src={selectedImg || authUser.profilePic || avatar}
              alt="profile"
              className="size-32 rounded-full object-cover border-4 p-1"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200 ${
                isUpdatingProfile ? "animate-pulse pointer-event-none" : ""
              }`}
            >
              <Camera className="w-5 h-5 text-base-200" />
              <input
                type="file"
                className="hidden"
                id="avatar-upload"
                accept="image/*"
                onChange={handleUpdated}
                disabled={isUpdatingProfile}
              />
            </label>
          </div>
          <p className="text-sm text-zinc-400">
            {isUpdatingProfile
              ? "Uploading"
              : "Click on the camera icon to update your photo"}
          </p>
          {/* upload avatar section */}
        </div>
        <div className="space-y-6 mt-2">
          <div className="space-y-1.5">
            <div className="flex gap-2 items-center">
              <User className="w-4 h-4"/>
              Fulname
            </div>
            <p className="bg-base-200 py-2.5 px-4 rounded-lg border">{authUser?.fullname}</p>
          </div>
          <div className="space-y-1.5">
            <div className="flex gap-2 items-center">
              <Mail className="w-4 h-4"/>
              Email
            </div>
            <p className="bg-base-200 py-2.5 px-4 rounded-lg border">{authUser?.email}</p>
          </div>
        </div>
        <div className="bg-base-300 p-6 rounded-xl mt-6 font-serif">
          <h1 className="mb-2">Account Information</h1>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center border-b border-zinc-700">
              <span>Member since</span>
              <span>{authUser.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Account status</span>
              <span>Active <Circle className="inline size-2 text-green-500 bg-green-500 rounded-full animate-pulse"/></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profilepage;
