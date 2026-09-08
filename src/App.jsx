import { useState } from "react";
import { Toaster } from "react-hot-toast";
import WelcomeScreen from "./components/WelcomeScreen";
import UserList from "./components/UserList";
import ChatWindow from "./components/ChatWindow";
import EmptyChat from "./components/EmptyChat";
import PasswordGate from "./components/PasswordGate";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { useUsers } from "./hooks/useUsers";

export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem("chat_unlocked") === "true"
  );
  const { user, initializeUser } = useCurrentUser();
  const { users, searchTerm, setSearchTerm, loading: usersLoading } = useUsers(user?.userId);
  const [selectedUser, setSelectedUser] = useState(null);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  if (!user) {
    return (
      <>
        <Toaster position="top-center" />
        <WelcomeScreen onStart={initializeUser} />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar: User List */}
        <div className={`w-full md:w-80 md:flex-shrink-0 bg-white flex flex-col h-full ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
          <UserList 
            users={users} 
            loading={usersLoading}
            currentUserId={user.userId}
            onSelectUser={setSelectedUser}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        {/* Main Area: Chat or Empty State */}
        <div className={`flex-1 flex flex-col h-full ${selectedUser ? 'flex w-full md:w-auto' : 'hidden md:flex'}`}>
          {selectedUser ? (
            <ChatWindow 
              targetUser={selectedUser} 
              currentUserId={user.userId} 
              onBack={() => setSelectedUser(null)} 
            />
          ) : (
            <EmptyChat />
          )}
        </div>
      </div>
    </>
  );
}