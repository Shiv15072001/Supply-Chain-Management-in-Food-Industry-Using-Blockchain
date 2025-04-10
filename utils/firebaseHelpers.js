import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig"; // adjust this path

export const isWalletRegisteredInFirestore = async (walletAddress) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("walletAddress", "==", walletAddress));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("🔥 Firestore wallet check error:", error);
        throw error;
    }
};
