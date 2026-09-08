import { useState } from "react";
import { Settings, X, Save } from "lucide-react";
import { useCurrentUser } from "../hooks/useCurrentUser";
import toast from "react-hot-toast";

export default function UserProfile() {
  const { user, updateUserName } = useCurrentUser();
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");

  if (!user) return null;

  const handleSave = () => {
    if (newName.trim().length < 2) {
      toast.error("Name too short");
      return;
    }
    updateUserName(newName.trim());
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <Settings className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Edit Profile</h3>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              <button 
                onClick={handleSave}
                className="w-full bg-primary text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
              >
                <Save className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}