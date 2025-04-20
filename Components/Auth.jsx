"use client";
import { useState, useContext } from "react";
import { registerUsers, loginUser, getUserWalletAddress,/*isWalletRegisteredInFirestore*/} from "../lib/firebaseConfig";
import { SupplyChainContext } from "@/conetxt/SupplyChain";

const Auth = ({ setUser }) => {
    const { registerUser } = useContext(SupplyChainContext);
    
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [shopName, setShopName] = useState("");
    const [role, setRole] = useState("1"); // Default: Farmer
    const [walletAddress, setWalletAddress] = useState("");

    const [firebaseWallet, setFirebaseWallet] = useState(""); // Wallet from Firestore
    const [connectedWallet, setConnectedWallet] = useState(""); // MetaMask connected wallet
    const [showMetaMaskButton, setShowMetaMaskButton] = useState(false); //Track if MetaMask button should be shown
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Prevent unauthorized users from proceeding
    // To diabled the register button once user click on that
    const [loading, setLoading] = useState(false)


    // 🔹 Connect to MetaMask
    const connectMetaMask = async () => {
        if (!window.ethereum) {
            alert("MetaMask not installed!");
            return null;
        }
        console.log("isnnsnsnsnsnn")

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setConnectedWallet(accounts[0]);
            return accounts[0]; //Return connected wallet
        } catch (error) {
            console.error("MetaMask Connection Failed:", error);
            return null;
        }
    };

    // 🔹 Handle Register/Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            let userData;

            if (isRegistering) {
                const blockchainRegistered = await registerUser(role,walletAddress);
                if (!blockchainRegistered) {
                    // ❌ Blockchain registration failed, stop here
                    setLoading(false);
                    return;
                }
                userData = await registerUsers(email, password, shopName, role, walletAddress);
            } else {
// 🔹 Login user & fetch registered wallet from Firestore
                userData = await loginUser(email, password);
                const registeredWallet = await getUserWalletAddress(email);
                setFirebaseWallet(registeredWallet);

                // 🔹 Ask user to connect MetaMask & get wallet address
                const walletConnected = await connectMetaMask();
                if (!walletConnected) return; // Prevent login if wallet not connected

                //  **Check if connected wallet matches registered wallet**
                if (walletConnected.toLowerCase() !== registeredWallet.toLowerCase()) {
                    alert(" Authentication Failed: Please connect the correct wallet used during registration.");
                    setIsAuthenticated(false); // Prevent user from proceeding
                    return; // Stop execution here 🚫
                }

                alert(" Login Successful with Verified Wallet!");
                setIsAuthenticated(true); //  Allow login
            }

            //  Only proceed if the user is authenticated
            if (isAuthenticated) {
                setShowMetaMaskButton(true);
                setUser(userData);
            }
        } catch (error) {
            console.error("🚨 Auth flow error:", error.message);
            // setErrorMessage(error.message || "Something went wrong. Please try again.");
            alert(error.message || "Something went wrong."); // Optional: replace with toast
        } finally {
            setLoading(false); // Stop loading in any case
        }
    };

    return (
        
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{isRegistering ? "Register" : "Login"}</h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    
                    {isRegistering && (
                        <>
                            <input type="text" placeholder="Shop Name" value={shopName} onChange={(e) => setShopName(e.target.value)} required />
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="1">Farmer</option>
                                <option value="2">Manufacturer</option>
                                <option value="3">Supplier</option>
                                <option value="4">Retailer</option>
                                <option value="5">Consumer</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Enter your Wallet Address"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                required
                            />
                        </>
                    )}

                    <button type="submit" className="p-2 bg-blue-500 text-white rounded" disabled={loading}>
                        {loading ? "Processing..." :isRegistering ? "Register" : "Login"}
                    </button>
                </form>

                {/*  Show Connect MetaMask Button After Registration/Login */}
                {showMetaMaskButton && isAuthenticated && (
                    <button onClick={connectMetaMask} className="p-2 bg-green-500 text-white rounded mt-4">
                        {connectedWallet ? `Connected: ${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)}` : "Connect MetaMask"}
                    </button>
                )}

                <button onClick={() => setIsRegistering(!isRegistering)} className="mt-4 text-blue-600 hover:underline">
                    {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
                </button>
            </div>
            
        </div>
    );
};

export default Auth;

