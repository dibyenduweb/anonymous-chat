import { useState, useEffect } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { formatLastSeen } from "../utils/formatTime";

export default function ChatHeader({ user, chatId, onBack }) {
  const [typingUser, setTypingUser] = useState(null);
  const initials = user.displayName.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (!chatId) return;
    const chatRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const typing = data.typing || {};
        const otherUserId = user.userId;
        
        if (typing[otherUserId]) {
          const timestamp = typing[otherUserId].toDate ? typing[otherUserId].toDate() : new Date();
          const diff = Date.now() - timestamp.getTime();
          if (diff < 3000) {
            setTypingUser(user.displayName);
            return;
          }
        }
        setTypingUser(null);
      }
    });
    return () => unsubscribe();
  }, [chatId, user]);

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3 shadow-sm z-10">
      <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full">
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>
      
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-bold text-sm">
          {initials}
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.online ? 'bg-green-500' : 'bg-gray-300'}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{user.displayName}</h3>
        <p className="text-xs text-gray-500">
          {typingUser ? (
            <span className="text-primary font-medium animate-pulse">typing...</span>
          ) : (
            user.online ? 'Online' : formatLastSeen(user.lastSeen)
          )}
        </p>
      </div>
      
      <button className="p-2 hover:bg-gray-100 rounded-full">
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}