import { useState, useEffect } from "react";
import { subscribeToUsers, searchUsers } from "../services/userService";

export const useUsers = (currentUserId) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;
    
    const unsubscribe = subscribeToUsers(currentUserId, (fetchedUsers) => {
      setUsers(fetchedUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      // Client-side fallback for instant feedback, though service also has server-side
      const lower = searchTerm.toLowerCase();
      setFilteredUsers(users.filter(u => u.displayName.toLowerCase().includes(lower)));
    }
  }, [searchTerm, users]);

  return { users: filteredUsers, searchTerm, setSearchTerm, loading };
};