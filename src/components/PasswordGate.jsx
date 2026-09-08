import { useState } from "react";
import { Lock } from "lucide-react";

// Fixed access password for the secure gate.
const ACCESS_PASSWORD = "4561";
const STORAGE_KEY = "chat_unlocked";

export default function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ACCESS_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      onUnlock();
    } else {
      setError("Incorrect password");
    }
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center"
      >
        <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">Secure Access</h1>
        <p className="text-sm text-gray-500 mb-6">Enter the password to continue</p>

        <input
          type="password"
          value={password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all mb-4"
          autoFocus
        />

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20"
        >
          Unlock
        </button>
      </form>
    </div>
  );
}
