import { MessageSquare } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-chat-bg p-8 text-center animate-fade-in">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
        <MessageSquare className="w-10 h-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">Welcome to Anonymous Chat</h3>
      <p className="text-gray-500 max-w-sm">
        Select someone from the list to start a private, encrypted 1-to-1 conversation.
      </p>
    </div>
  );
}