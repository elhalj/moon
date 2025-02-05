import { useState, useEffect } from 'react';
import SideBarSkeleton from "./skeletons/SideBarSkeleton";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from '../store/useAthStore';
import arriere from '../assets/arriere2.jpeg'
import { User2 } from 'lucide-react'; // Assurez-vous d'importer correctement l'icône User2

function Sidebare() {
  const { getUser, users = [], selectedUser, setSelectedUser, isUserLoading } = useChatStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { isOnlineUsers = [] } = useAuthStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    console.log("Users state:", Array.isArray(users), users);
  }, [users]);

  const filteredUsers = Array.isArray(users) 
    ? (showOnlineOnly 
      ? users.filter((user) => isOnlineUsers.includes(user._id))
      : users)
    : [];"../store/useAuthStore";

  if (isUserLoading) return <SideBarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <User2 className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({isOnlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || arriere }
                  alt={user.fullname}
                  className="size-12 object-cover rounded-full"
                />
                {isOnlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullname}</div>
                <div className="text-sm text-zinc-400">
                  {isOnlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <p className="text-center text-sm text-zinc-500">No users found</p>
        )}
      </div>
    </aside>
  );
}

export default Sidebare;
