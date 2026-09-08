import { doc, setDoc, updateDoc, serverTimestamp, collection, query, where, limit, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const createUser = async (userId, displayName) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    userId,
    currentUserId: userId, // Required for Firestore rules
    displayName,
    searchLower: displayName.toLowerCase(),
    online: true,
    lastSeen: serverTimestamp(),
    createdAt: serverTimestamp()
  }, { merge: true });
};

export const updateUserPresence = async (userId, online) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    currentUserId: userId, // Required for Firestore rules
    online,
    lastSeen: serverTimestamp()
  });
};

export const subscribeToUsers = (currentUserId, callback) => {
  const q = query(collection(db, "users"), limit(50));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs
      .map(doc => doc.data())
      .filter(user => user.userId !== currentUserId)
      .sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0) || (b.lastSeen?.toDate() - a.lastSeen?.toDate()));
    callback(users);
  });
};

export const searchUsers = async (currentUserId, searchTerm) => {
  if (!searchTerm) return [];
  const lowerTerm = searchTerm.toLowerCase();
  const q = query(
    collection(db, "users"),
    where("searchLower", ">=", lowerTerm),
    where("searchLower", "<=", lowerTerm + '\uf8ff'),
    limit(20)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => doc.data())
    .filter(user => user.userId !== currentUserId);
};