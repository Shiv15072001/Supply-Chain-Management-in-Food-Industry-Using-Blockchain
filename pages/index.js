

import { useContext, useEffect, useState } from "react";
import { SupplyChainContext} from "../conetxt/SupplyChain"; // Import Web3 context
import { AuthContext } from "../conetxt/AuthContext"; // Import Firebase Auth Context
import { getUserData } from "../lib/firebaseConfig"; // Import Firestore function
// import Register from "../components/Auth"; // Auth Component
import {UserDashboard, AddProduct,GetProduct,ViewProducts,RequestPurchase,PaymentQuality} from "../Components/index";

const Index = () => {

// USERS AUTHENTICATION CODE AND AFTER LOGIN CODE
    const { user, logout } = useContext(AuthContext); // Firebase user
    const { connectWallet, currentUser, setCurrentUser,addProducts, getFarmerProductDetails,getAllProducts,requestPurchase,confirmDelivery } = useContext(SupplyChainContext); // Web3 User Context

    const [walletAddress, setWalletAddress] = useState(""); // Registered wallet address
    const [role, setRole] = useState(""); // Store role
    const [shopName, setShopName] = useState(""); // Store shop name
    const [loading, setLoading] = useState(true); // Loading state
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Wallet authentication status

    // USERS AUTHENTICATION CODE AND AFTER LOGIN CODE
    // MODALS OPENING BASED ON CLICK FOR FARMER
    const [addProductModal, setAddProductModal] = useState(false);
    const [getProductModal, setGetProductModal] = useState(false)
    // MODALS OPENING BASED ON CLICK FOR MANUFACTURER
    const [getAllProductsModal, setGetAllProductsModal] = useState(false)
    const [requestPurchaseModal, setRequestPurchaseModal] = useState(false)
    const [confirmDeliveryModal, setConfirmDeliveryModal] = useState(false)
    


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
                    console.log(getAllProductsModal)
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
        <>
        <UserDashboard loading = {loading}
        isAuthenticated={isAuthenticated}
        walletAddress={walletAddress}
        shopName={shopName}
        handleConnectWallet={handleConnectWallet}
        logout={logout}
        user={user}
        role={role}
        setAddProductModal={setAddProductModal}
        setGetProductModal={setGetProductModal}
        setGetAllProductsModal={setGetAllProductsModal}
        setRequestPurchaseModal={setRequestPurchaseModal}
        setConfirmDeliveryModal={setConfirmDeliveryModal}
        />
        <AddProduct addProductModal={addProductModal} setAddProductModal={setAddProductModal}
        addProducts={addProducts}/>

        <GetProduct getProductModal={getProductModal}
        setGetProductModal={setGetProductModal}
        getFarmerProductDetails={getFarmerProductDetails}
        />
        <ViewProducts getAllProductsModal={getAllProductsModal}
        setGetAllProductsModal={setGetAllProductsModal}
        getAllProducts={getAllProducts}
        />
        <RequestPurchase requestPurchaseModal={requestPurchaseModal}
        setRequestPurchaseModal={setRequestPurchaseModal}
        requestPurchase={requestPurchase}
        />
        <PaymentQuality confirmDeliveryModal={confirmDeliveryModal}
        setConfirmDeliveryModal={setConfirmDeliveryModal}
        confirmDelivery={confirmDelivery}
        />
        </>
    );
    
};

export default Index;

