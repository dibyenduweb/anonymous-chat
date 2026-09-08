import { useState } from "react";
import { MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function WelcomeScreen({ onStart }) {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }
    if (trimmed.length > 20) {
      toast.error("Name must be less than 20 characters");
      return;
    }
    onStart(trimmed);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Anonymous Chat</h1>
        <p className="text-gray-500 mb-8">Connect privately with others. No registration required.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Enter your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20"
          >
            Start Chat
          </button>
        </form>
      </div>
    </div>
  );
}