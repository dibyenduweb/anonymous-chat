import { useState, useRef } from "react";
import { Send, Smile, Image as ImageIcon, X } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { sendMessage } from "../services/chatService";
import { processImageForChat } from "../services/imageService";
import toast from "react-hot-toast";

export default function MessageComposer({ chatId, currentUserId, currentUserName, receiverId, onTyping }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
    onTyping(e.target.value.length > 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed && !imagePreview) return;

    setIsProcessing(true);
    try {
      await sendMessage(
        chatId,
        currentUserId,
        currentUserName,
        trimmed,
        imagePreview ? "image" : "text",
        imagePreview,
        receiverId
      );
      setText("");
      setImagePreview(null);
      onTyping(false);
      if (textareaRef.current) textareaRef.current.focus();
    } catch (error) {
      toast.error("Failed to send message. Image might be too large.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const compressed = await processImageForChat(file);
      setImagePreview(compressed);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
      e.target.value = "";
    }
  };

  const onEmojiClick = (emojiObject) => {
    setText(prev => prev + emojiObject.emoji);
    setShowEmoji(false);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const isDisabled = (!text.trim() && !imagePreview) || isProcessing;

  return (
    <div className="bg-white border-t border-gray-200 p-3 md:p-4">
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-gray-200" />
          <button 
            onClick={() => setImagePreview(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      
      <div className="flex items-end gap-2 w-full max-w-full">
        {/* Emoji Button - Fixed Size */}
        <button 
          onClick={() => setShowEmoji(!showEmoji)}
          className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 w-10 h-10 flex items-center justify-center"
        >
          <Smile className="w-5 h-5" />
        </button>
        
        {/* Image Upload Button - Fixed Size */}
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 flex-shrink-0 w-10 h-10 flex items-center justify-center"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          onChange={handleImageSelect}
        />

        {/* Text Input - Constrained Width */}
        <div className="flex-1 min-w-0 relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full bg-gray-100 rounded-2xl px-4 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 max-h-32 overflow-hidden"
            style={{ minHeight: '44px' }}
          />
          
          {showEmoji && (
            <div className="absolute bottom-full left-0 mb-2 z-20 shadow-xl rounded-xl overflow-hidden">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        {/* Send Button - Fixed Size, Always Visible */}
        <button 
          onClick={handleSend}
          disabled={isDisabled}
          className={`flex-shrink-0 w-10 h-10 rounded-full transition-all flex items-center justify-center ${
            isDisabled 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg'
          }`}
        >
          {isProcessing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}