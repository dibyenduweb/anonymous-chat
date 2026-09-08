import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCkiwtLxkVlcq0p_g7mIyAQe44VcVOTi0U",
  authDomain: "pvt-chat-2bc48.firebaseapp.com",
  projectId: "pvt-chat-2bc48",
  storageBucket: "pvt-chat-2bc48.firebasestorage.app",
  messagingSenderId: "660742564110",
  appId: "1:660742564110:web:bc6bd2c3098cd71fff8f5f"
};

// Note: Firebase Storage is intentionally NOT initialized per requirements.
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);