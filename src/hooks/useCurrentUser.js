import { useState, useEffect } from "react";
import { generateUserId } from "../utils/generateUserId";
import { createUser, updateUserPresence } from "../services/userService";
import toast from "react-hot-toast";

const getStoredUser = () => {
  const storedId = localStorage.getItem("anon_chat_userId");
  const storedName = localStorage.getItem("anon_chat_displayName");
  if (storedId && storedName) {
    return { userId: storedId, displayName: storedName };
  }
  return null;
};

export const useCurrentUser = () => {
  // Lazily seed the current user from localStorage on the very first render.
  const [user, setUser] = useState(getStoredUser);

  // Register the stored user's Firestore record once on mount.
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      createUser(stored.userId, stored.displayName);
    }
  }, []);

  // Presence tracking — re-subscribes only when `user` actually changes.
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
    await createUser(user.userId, newName); // merge: true in service
    toast.success("Name updated!");
  };

  return { user, initializeUser, updateUserName };
};
