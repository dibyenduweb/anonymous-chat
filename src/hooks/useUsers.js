import { useState, useEffect, useMemo } from "react";
import { subscribeToUsers } from "../services/userService";

export const useUsers = (currentUserId) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUserId) return;

    const unsubscribe = subscribeToUsers(currentUserId, (fetchedUsers) => {
      setUsers(fetchedUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const lower = searchTerm.toLowerCase();
    return users.filter((u) => u.displayName.toLowerCase().includes(lower));
  }, [searchTerm, users]);

  return { users: filteredUsers, searchTerm, setSearchTerm, loading };
};
