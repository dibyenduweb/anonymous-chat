import { useState } from "react";
import { formatTime } from "../utils/formatTime";
import { X } from "lucide-react";

export default function MessageBubble({ message, isMe, showName }) {
  const [imageModal, setImageModal] = useState(null);

  return (
    <>
      <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-slide-up`}>
        <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 shadow-sm relative group ${
          isMe ? 'bg-bubble-out rounded-tr-sm' : 'bg-bubble-in rounded-tl-sm'
        }`}>
          {showName && !isMe && (
            <p className="text-xs font-bold text-primary mb-1">{message.senderName}</p>
          )}
          
          {message.type === "image" && message.imageData ? (
            <div className="mb-1">
              <img 
                src={message.imageData} 
                alt="Shared" 
                className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setImageModal(message.imageData)}
                loading="lazy"
              />
            </div>
          ) : null}
          
          {message.text && (
            <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{message.text}</p>
          )}
          
          <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="text-[10px]">{formatTime(message.createdAt)}</span>
            {isMe && message.readBy?.length > 1 && (
              <span className="text-[10px] text-blue-500">✓✓</span>
            )}
          </div>
        </div>
      </div>

      {imageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setImageModal(null)}>
          <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full">
            <X className="w-6 h-6" />
          </button>
          <img src={imageModal} alt="Full preview" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
        </div>
      )}
    </>
  );
}