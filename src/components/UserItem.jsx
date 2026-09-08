import { formatLastSeen } from "../utils/formatTime";

export default function UserItem({ user, currentUserId, onClick }) {
  const initials = user.displayName.slice(0, 2).toUpperCase();
  
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors text-left group"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-sm">
          {initials}
        </div>
        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${user.online ? 'bg-green-500' : 'bg-gray-300'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold text-gray-800 truncate">{user.displayName}</h3>
          {user.unreadCount?.[currentUserId] > 0 && (
            <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {user.unreadCount[currentUserId]}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">
          {user.online ? 'Online' : formatLastSeen(user.lastSeen)}
        </p>
      </div>
    </button>
  );
}