import { useState, useEffect } from "react";
import { generateUserId } from "../utils/generateUserId";
import { createUser, updateUserPresence } from "../services/userService";
import toast from "react-hot-toast";

export const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user once from localStorage on mount (no setState in here afterwards).
  useEffect(() => {
    const storedId = localStorage.getItem("anon_chat_userId");
    const storedName = localStorage.getItem("anon_chat_displayName");
    if (storedId && storedName) {
      setUser({ userId: storedId, displayName: storedName });
      createUser(storedId, storedName);
    }
    setLoading(false);
  }, []);

  // Presence tracking — only re-subscribes when `user` actually changes.
  useEffect(() => {
    if (!user) return;
    const userId = user.userId;

    const handleBeforeUnload = () => {
      updateUserPresence(userId, false).catch(() => {});
    };
    const handleVisibilityChange = () => {
      updateUserPresence(userId, !document.hidden);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      updateUserPresence(userId, false).catch(() => {});
    };
  }, [user]);

  const initializeUser = async (displayName) => {
    try {
      const userId = generateUserId();
      localStorage.setItem("anon_chat_userId", userId);
      localStorage.setItem("anon_chat_displayName", displayName);
      await createUser(userId, displayName);
      setUser({ userId, displayName });
    } catch (error) {
      toast.error("Failed to initialize user. Check Firebase config.");
      console.error(error);
    }
  };

  const updateUserName = async (newName) => {
    if (!user) return;
    localStorage.setItem("anon_chat_displayName", newName);
    const updatedUser = { ...user, displayName: newName };
    setUser(updatedUser);
    await createUser(user.userId, newName);
    toast.success("Name updated!");
  };

  return { user, loading, initializeUser, updateUserName };
};
