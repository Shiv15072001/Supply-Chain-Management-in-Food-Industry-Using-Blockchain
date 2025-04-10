import { createContext, useState, useEffect } from "react";
import { auth, loginUser, registerUsers, logoutUser } from "../lib/firebaseConfig"; // Import Firebase functions
import { onAuthStateChanged } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loginUser, registerUsers, logout: logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
