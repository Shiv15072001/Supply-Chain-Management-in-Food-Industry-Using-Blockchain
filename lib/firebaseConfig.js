

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import { isWalletRegisteredInFirestore } from "../utils/firebaseHelpers";

// import { collection, query, where, getDocs } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const registerUsers = async (email, password, shopName, role, walletAddress) => {
    try {

        console.log("🔹 Checking if wallet already exists in Firestore...");
        const walletExists = await isWalletRegisteredInFirestore(walletAddress);

        if (walletExists) {
            throw new Error("This wallet address is already registered with another account.");
        }
        console.log(" Registering user with Firebase...");
        //  Check if wallet is already registered

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(" Firebase Auth Success:", user.uid);

        console.log(" Storing user in Firestore...");
        await setDoc(doc(db, "users", user.uid), {  //  Use UID
            email: email,
            shopName: shopName,
            role: role,
            walletAddress: walletAddress,
        });

        console.log(" User saved in Firestore:", user.uid);
        return user;
    } catch (error) {
        // console.error(" Firebase Registration Error:", error);
        // throw error;
        console.error(" Firebase Registration Error:", error.message);
        throw new Error(error.message);
    }
};






export const getUserWalletAddress = async (email) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            throw new Error("User not authenticated. Please log in.");
        }

        //  Fetch the user's wallet address using the UID
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            throw new Error("User data not found.");
        }

        return userDoc.data().walletAddress;
    } catch (error) {
        console.error("Error fetching user wallet:", error);
        throw error;
    }
};



export const getUserData = async (userId) => {
    try {
        console.log(" Fetching user data for:", userId);
        const userDoc = await getDoc(doc(db, "users", userId));

        if (!userDoc.exists()) {
            console.error(" User data not found!");
            throw new Error("User data not found.");
        }

        console.log(" User data:", userDoc.data());
        return userDoc.data();
    } catch (error) {
        console.error(" Firebase Get User Data Error:", error);
        throw error;
    }
};

// 

export const loginUser = async (email, password) => {
    try {
        console.log("Attempting login with:", email, password);
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log(" Login successful:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error(" Firebase Login Error:", error.message);
        alert(" Invalid email or password!");
    }
}

//  Logout User
export async function logoutUser() {
    await signOut(auth);
}





// 

