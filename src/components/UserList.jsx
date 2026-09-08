import { Search, User } from "lucide-react";
import UserItem from "./UserItem";
import UserProfile from "./UserProfile";

export default function UserList({ users, loading, currentUserId, onSelectUser, searchTerm, setSearchTerm }) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Chats</h2>
          <UserProfile currentUserId={currentUserId} />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 p-4 text-center">
            <User className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm">No other users available right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {users.map((user) => (
              <UserItem 
                key={user.userId} 
                user={user} 
                currentUserId={currentUserId} 
                onClick={() => onSelectUser(user)} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}