import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

// use isWalletRegisteredInFirestore function here in firebase
// import { isWalletRegisteredInFirestore } from "../utils/firebaseHelpers"; // adjust path


// Import Smart Contract ABI
import supplyChainABI from "../conetxt/SupplyChain.json";

// Smart Contract Address (Replace with deployed contract address)
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Fetch Smart Contract
const fetchContract = (signerOrProvider) =>
    new ethers.Contract(CONTRACT_ADDRESS, supplyChainABI.abi, signerOrProvider);

// Create Context
// export const SupplyChainContext = createContext();
export const SupplyChainContext = React.createContext();

export const SupplyChainProvider = ({ children }) => {
    // State Variables
    const DappName = "SupplyChain DApp";
    const [currentUser, setCurrentUser] = useState("");
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    //**Check if Wallet is Connected**
    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum) {
                console.log("MetaMask is not installed.");
                return;
            }

            const accounts = await window.ethereum.request({ method: "eth_accounts" });
            if (accounts.length) {
                setCurrentUser(accounts[0]);
                await fetchUserRole(accounts[0]); // Fetch role on connect
            } else {
                console.log("No accounts found. Please connect MetaMask.");
            }
        } catch (error) {
            console.error("Error checking wallet connection:", error);
        } finally {
            setIsLoading(false);
        }
    };

    //**Connect Wallet**
    const connectWallet = async () => {
        try {
            if (!window.ethereum) {
                alert("Please install MetaMask.");
                return;
            }

            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setCurrentUser(accounts[0]);
            // await fetchUserRole(accounts[0]); // Fetch role on connect

            console.log("Connected Wallet:", accounts[0]);
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    const registerUser = async (role) => {
        try {
            if (!currentUser) {
                alert("Please connect your wallet first.");
                return;
            }

            // // 🔍 Check Firestore first
            // const walletExists = await isWalletRegisteredInFirestore(currentUser);
            // if (walletExists) {
            //     alert("❌ This wallet address is already registered in Firestore!");
            //     return;
            // }
            // console.log("Wallet Exist", walletExists)
    
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);
    
            //  Fetch user role
            const existingRole = await contract.getRole(currentUser);
            console.log("Fetched role for user:", existingRole);
    
            //  Extract role from tuple
            const [, roleValue, isRegistered] = existingRole;
    
            //  Ensure correct check for registration
            if (isRegistered || roleValue.toString() !== "0") {
                alert(" You are already registered!");
                return;
            }
    
            //  Register the user
            const tx = await contract.register(role);
            await tx.wait();
    
            console.log(" User Registered:", role);
            await fetchUserRole(currentUser); // Update user role after registration
        } catch (error) {
            console.error("Error registering user:", error);
            alert(" Registration failed: " + (error.reason || error.message));
        }
    };
    
    
    

    //**Fetch User Role**
    const fetchUserRole = async (address) => {
        try {
            if (!window.ethereum) {
                console.log("MetaMask is not installed.");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = fetchContract(provider);

            const role = await contract.getRole(address);
            setUserRole(role);
            console.log("User Role:", role);
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    return (
        <SupplyChainContext.Provider
            value={{
                DappName,
                currentUser,
                userRole,
                isLoading,
                connectWallet,
                registerUser,
                fetchUserRole,
                setCurrentUser
            }}
        >
            {children}
        </SupplyChainContext.Provider>
    );
};


