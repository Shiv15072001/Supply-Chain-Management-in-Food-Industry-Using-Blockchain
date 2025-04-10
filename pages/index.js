

import { useContext, useEffect, useState } from "react";
import { SupplyChainContext } from "../conetxt/SupplyChain"; // Import Web3 context
import { AuthContext } from "../conetxt/AuthContext"; // Import Firebase Auth Context
import { getUserData } from "../lib/firebaseConfig"; // Import Firestore function
import Register from "../components/Auth"; // Auth Component

const Index = () => {
    const { user, logout } = useContext(AuthContext); // Firebase user
    const { connectWallet, currentUser, setCurrentUser } = useContext(SupplyChainContext); // Web3 User Context

    const [walletAddress, setWalletAddress] = useState(""); // Registered wallet address
    const [role, setRole] = useState(""); // Store role
    const [shopName, setShopName] = useState(""); // Store shop name
    const [loading, setLoading] = useState(true); // Loading state
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Wallet authentication status

    // 🔹 Fetch user data from Firestore when user logs in
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (user) {
                try {
                    console.log("🔹 Fetching Firestore user data...");
                    const userData = await getUserData(user.uid); // Fetch from Firestore

                    setWalletAddress(userData.walletAddress);
                    setRole(userData.role.toString());
                    setShopName(userData.shopName);
                    setLoading(false); // Stop loading when data is fetched

                    console.log(" Firestore User Data:", userData);
                    console.log(currentUser)

                    // Ensure correct wallet is connected
                    if (currentUser && currentUser.toLowerCase() === userData.walletAddress.toLowerCase()) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setLoading(false);
                }
            }
        };

        fetchUserDetails();
    }, [user, currentUser]); // Runs when user or current wallet changes

    // 🔹 Handle MetaMask connection and enforce correct wallet
    const handleConnectWallet = async () => {
        if (!window.ethereum) {
            alert(" MetaMask is not installed!");
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const selectedWallet = accounts[0]; // Get the first selected wallet

            // 🔹 Update the current connected wallet
            setCurrentUser(selectedWallet);

            if (selectedWallet.toLowerCase() === walletAddress.toLowerCase()) {
                alert(" Successfully connected to the correct wallet!");
                setIsAuthenticated(true);
            } else {
                alert(" Incorrect Wallet! Please switch to the registered wallet.");
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error(" Error connecting MetaMask:", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
            {user ? (
                <>
                    <h2 className="text-2xl font-bold">Welcome, {user.email}</h2>

                    {/* Show user details after fetching */}
                    {loading || !isAuthenticated  ? (
                        <p className="text-lg mt-2 text-gray-600">Fetching user data...</p>
                    ) : (
                        <>
                            <p className="text-lg mt-2">Wallet Address: {walletAddress}</p>
                            <p className="text-lg mt-2">Shop Name: {shopName}</p>
                            <p className="text-lg mt-2">
                                Role Type: {role == 1 ? "Farmer" : role == 2 ? "Manufacturer" : role == 3 ? "Supplier" : role == 4 ? "Retailer" : "Consumer"}
                            </p>
                        </>
                    )}

                    {/*  Show "Connect MetaMask" button if user is not authenticated */}
                    {/* {!isAuthenticated && (
                        <h5>Warning</h5>
                        <h1>Please connect to correct wallet & Once it connected the button will disappear
                        1) Disconnect current connected wallet
                        2) Try to connect with Orginal wallet </h1>
                    )} */}
                    {!isAuthenticated && (
                        <>
                            <div id="alert-additional-content-4" class="p-4 mb-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800" role="alert">
                                <div class="flex items-center">
                                    <svg class="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                                    </svg>
                                    <span class="sr-only">Info</span>
                                    <h3 class="text-lg font-medium">Warning</h3>
                                </div>
                                <div class="mt-2 mb-4 text-sm">
                                Please connect to correct wallet & Once it connected the Warning will disappear:-
                                </div>
                                <div class="mt-2 mb-4 text-sm">
                                1) Disconnect current connected wallet
                                </div>
                                <div class="mt-2 mb-4 text-sm">
                                2) Try to connect with Orginal wallet - {walletAddress.slice(0,15)}...{walletAddress.slice(-4)} 
                                </div>
                                <div class="flex">
                                    <button onClick={handleConnectWallet} type="button" class="text-white bg-yellow-800 hover:bg-yellow-900 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-yellow-300 dark:text-gray-800 dark:hover:bg-yellow-400 dark:focus:ring-yellow-800">
                                        
                                        Connect MetaMask
                                        </button>
                                </div>
                            </div>
                        </>
                    )}

                    <button onClick={logout} className="p-2 bg-red-500 text-white rounded mt-4">
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold mb-4">Connect to MetaMask & Register</h2>
                    <Register />
                </>
            )}
        </div>
    );
};

export default Index;

