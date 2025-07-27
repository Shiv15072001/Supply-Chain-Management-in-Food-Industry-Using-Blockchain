

import { useContext, useEffect, useState } from "react";
import { SupplyChainContext} from "../conetxt/SupplyChain"; // Import Web3 context
import { AuthContext } from "../conetxt/AuthContext"; // Import Firebase Auth Context
import { getUserData } from "../lib/firebaseConfig"; // Import Firestore function
// import Register from "../components/Auth"; // Auth Component
import {UserDashboard, AddProduct,GetProduct,SalesRequest,SalesList,ViewProducts,RequestPurchase,PaymentQuality,PurchaseRequestList,PurchaseList,ProcessProduct,ProcessedProduct,ApprovedShipment,AvailableShipment,RequestShipment,MyShipmentStatus,StartShipment,AcceptedShipments,InTransitShipments,CompleteShipment,FinalProducts,AddInventory,ViewInventory} from "../Components/index";

const Index = () => {

// USERS AUTHENTICATION CODE AND AFTER LOGIN CODE
    const { user, logout } = useContext(AuthContext); // Firebase user
    const { connectWallet, currentUser, setCurrentUser,addProducts, getFarmerProductDetails,getAllProducts,requestPurchase,confirmDelivery,processProduct,getProcessedProductDetails,approvedShipment,getAllProcessedProducts,requestShipment,getMyShipmentStatus,startShipment,getAcceptedProductDetails,getIntransitProductDetails,completeShipment,getFinalProductDetails,addInventory,getViewInventory} = useContext(SupplyChainContext); // Web3 User Context

    const [walletAddress, setWalletAddress] = useState(""); // Registered wallet address
    const [role, setRole] = useState(""); // Store role
    const [shopName, setShopName] = useState(""); // Store shop name
    const [loading, setLoading] = useState(true); // Loading state
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Wallet authentication status

    // USERS AUTHENTICATION CODE AND AFTER LOGIN CODE
    // MODALS OPENING BASED ON CLICK FOR FARMER
    const [addProductModal, setAddProductModal] = useState(false);
    const [getProductModal, setGetProductModal] = useState(false);
    const [getSalesRequestModal, setGetSalesRequestModal] = useState(false);
    const [getSalesListModal,setGetSalesListModal] = useState(false);  
    // MODALS OPENING BASED ON CLICK FOR MANUFACTURER
    const [getAllProductsModal, setGetAllProductsModal] = useState(false)
    const [requestPurchaseModal, setRequestPurchaseModal] = useState(false)
    const [confirmDeliveryModal, setConfirmDeliveryModal] = useState(false)
    const [purchaseRequestListModal, setPurchaseRequestListModal] = useState(false)
    const [purchaseListModal, setPurchaseListModal] = useState(false)
    const [processProductModal, setProcessProductModal] = useState(false)
    const [processedProductModal, setProcessedProductModal] = useState(false)
    const [approvedShipmentModal, setApprovedShipmentModal] = useState(false)
    // MODALS OPENING BASED ON CLICK FOR SUPPLIER

    const [getAllProcessedProductModal, setGetAllProcessedProductModal] = useState(false)
    const [requestShipmentModal, setRequestShipmentModal] = useState(false)
    const [myShipmentStatusModal, setMyShipmentStatusModal] = useState(false)
    const [startShipmentModal, setStartShipmentModal] = useState(false)
    // MODALS OPENING BASED ON CLICK FOR RETAILER
    const [getAcceptedProductDetailsModal, setGetAcceptedProductDetailsModal] = useState(false)
    const [getRetailerProductModal, setGetRetailerProductModal] = useState(false)
    const [completeShipmentModal,setCompleteShipmentModal] = useState(false)
    const [getFinalProductModal,setGetFinalProductModal] = useState(false); // For final products
    const [addInventoryModal, setAddInventoryModal] = useState(false); // For adding inventory
    const [viewInventoryModal, setViewInventoryModal] = useState(false); // For viewing inventory

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
        //Farmer
        setAddProductModal={setAddProductModal}
        setGetProductModal={setGetProductModal}
        setGetSalesRequestModal={setGetSalesRequestModal}
        setGetSalesListModal={setGetSalesListModal}
        // Manufacturer
        setGetAllProductsModal={setGetAllProductsModal}
        setRequestPurchaseModal={setRequestPurchaseModal}
        setConfirmDeliveryModal={setConfirmDeliveryModal}
        setPurchaseRequestListModal={setPurchaseRequestListModal}
        setPurchaseListModal={setPurchaseListModal}
        setProcessProductModal={setProcessProductModal}
        setProcessedProductModal={setProcessedProductModal}
        setApprovedShipmentModal={setApprovedShipmentModal}
        // Supplier
        setGetAllProcessedProductModal={setGetAllProcessedProductModal}
        setRequestShipmentModal={setRequestShipmentModal}
        setMyShipmentStatusModal={setMyShipmentStatusModal}
        setStartShipmentModal={setStartShipmentModal}
        // Reatiler
        setGetAcceptedProductDetailsModal={setGetAcceptedProductDetailsModal}
        setGetRetailerProductModal={setGetRetailerProductModal}
        setCompleteShipmentModal={setCompleteShipmentModal}
        setGetFinalProductModal={setGetFinalProductModal}
        setAddInventoryModal={setAddInventoryModal}
        setViewInventoryModal={setViewInventoryModal}
        />
        {/* farmer start */}
        <AddProduct addProductModal={addProductModal} setAddProductModal={setAddProductModal}
        addProducts={addProducts}/>

        <GetProduct getProductModal={getProductModal}
        setGetProductModal={setGetProductModal}
        getFarmerProductDetails={getFarmerProductDetails}
        />
        <SalesRequest getSalesRequestModal={getSalesRequestModal}
        setGetSalesRequestModal={setGetSalesRequestModal}
        walletAddress={walletAddress}
        />
        <SalesList getSalesListModal={getSalesListModal}
        setGetSalesListModal={setGetSalesListModal}
        walletAddress={walletAddress}
        />
        {/* farmer end */}
        {/* manufacturer start */}
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
        <PurchaseRequestList purchaseRequestListModal={purchaseRequestListModal}
        setPurchaseRequestListModal={setPurchaseRequestListModal}
        walletAddress={walletAddress}
        />
        <PurchaseList purchaseListModal={purchaseListModal}
        setPurchaseListModal={setPurchaseListModal}
        walletAddress={walletAddress}
        />
        <ProcessProduct processProductModal={processProductModal}
        setProcessProductModal={setProcessProductModal}
        processProduct={processProduct}
        />
        <ProcessedProduct processedProductModal={processedProductModal}
        setProcessedProductModal={setProcessedProductModal}
        getProcessedProductDetails={getProcessedProductDetails}
        />
        <ApprovedShipment approvedShipmentModal={approvedShipmentModal}
        setApprovedShipmentModal={setApprovedShipmentModal}
        approvedShipment={approvedShipment}
        />
        {/* manufacturer end */}
        {/* Supplier */}
        <AvailableShipment
        getAllProcessedProductModal={getAllProcessedProductModal}
        setGetAllProcessedProductModal={setGetAllProcessedProductModal}
        getAllProcessedProducts={getAllProcessedProducts}
        />
        <RequestShipment
        requestShipmentModal={requestShipmentModal}
        setRequestShipmentModal={setRequestShipmentModal}
        requestShipment={requestShipment}
        />

        <MyShipmentStatus
        myShipmentStatusModal={myShipmentStatusModal}
        setMyShipmentStatusModal={setMyShipmentStatusModal}
        getMyShipmentStatus={getMyShipmentStatus}
        />

        <StartShipment
        startShipmentModal={startShipmentModal}
        setStartShipmentModal={setStartShipmentModal}
        startShipment={startShipment}
        />
        {/* Reatiler */}

        <AcceptedShipments
        getAcceptedProductDetailsModal={getAcceptedProductDetailsModal}
        setGetAcceptedProductDetailsModal={setGetAcceptedProductDetailsModal}
        getAcceptedProductDetails={getAcceptedProductDetails}
        />

        <InTransitShipments
        getRetailerProductModal={getRetailerProductModal}
        setGetRetailerProductModal={setGetRetailerProductModal}
        getIntransitProductDetails={getIntransitProductDetails}
        />


        <CompleteShipment
        completeShipmentModal={completeShipmentModal}
        setCompleteShipmentModal={setCompleteShipmentModal}
        completeShipment={completeShipment}
        />

        <FinalProducts
        getFinalProductModal={getFinalProductModal}
        setGetFinalProductModal={setGetFinalProductModal}
        getFinalProductDetails={getFinalProductDetails}
        />

        <AddInventory
        addInventoryModal={addInventoryModal}
        setAddInventoryModal={setAddInventoryModal}
        addInventory={addInventory}
        />

        <ViewInventory
        viewInventoryModal={viewInventoryModal}
        setViewInventoryModal={setViewInventoryModal}
        getViewInventory={getViewInventory}
        />
        </>
    );
    
};

export default Index;

