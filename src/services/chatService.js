import { doc, setDoc, updateDoc, serverTimestamp, collection, query, orderBy, onSnapshot, addDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { generateChatId } from "../utils/generateChatId";

export const getOrCreateChat = async (userId1, userId2, user1Name, user2Name) => {
  const chatId = generateChatId(userId1, userId2);
  const chatRef = doc(db, "chats", chatId);
  
  await setDoc(chatRef, {
    chatId,
    currentUserId: userId1, // Required for Firestore rules
    participants: [userId1, userId2],
    participantNames: { [userId1]: user1Name, [userId2]: user2Name },
    createdAt: serverTimestamp(),
    lastMessage: "",
    lastMessageAt: serverTimestamp(),
    unreadCount: { [userId1]: 0, [userId2]: 0 }
  }, { merge: true });

  return chatId;
};

export const sendMessage = async (chatId, senderId, senderName, text, type = "text", imageData = null, receiverId) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const chatRef = doc(db, "chats", chatId);

  const messageData = {
    currentUserId: senderId, // Required for Firestore rules
    senderId,
    senderName,
    text,
    type,
    imageData,
    readBy: [senderId],
    createdAt: serverTimestamp()
  };

  await addDoc(messagesRef, messageData);

  await updateDoc(chatRef, {
    currentUserId: senderId, // Required for Firestore rules
    lastMessage: type === "image" ? "📷 Image" : text,
    lastMessageAt: serverTimestamp(),
    [`unreadCount.${receiverId}`]: increment(1)
  });
};

export const markMessagesAsRead = async (chatId, currentUserId) => {
  const chatRef = doc(db, "chats", chatId);
  
  await updateDoc(chatRef, {
    currentUserId: currentUserId, // Required for Firestore rules
    [`unreadCount.${currentUserId}`]: 0
  });
};

export const subscribeToMessages = (chatId, callback) => {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

export const updateTypingStatus = async (chatId, userId, isTyping) => {
  const chatRef = doc(db, "chats", chatId);
  const updateData = { currentUserId: userId }; // Required for Firestore rules
  
  if (isTyping) {
    updateData[`typing.${userId}`] = serverTimestamp();
  } else {
    updateData[`typing.${userId}`] = null;
  }
  
  await updateDoc(chatRef, updateData);
};