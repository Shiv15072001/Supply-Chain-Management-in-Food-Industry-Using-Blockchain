import React, { useState, useEffect } from "react";
// import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { auth, db } from "../lib/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";  // Important!
// Import Smart Contract ABI
import { CONTRACT_ADDRESS } from "../frontend/constants/contractAddress";
import supplyChainArtifact from "../frontend/constants/SupplyChain.json";


// // Smart Contract Address (Replace with deployed contract address)
// import supplyChainABI from "../conetxt/SupplyChain.json";
// const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Fetch Smart Contract
const fetchContract = (signerOrProvider) =>
    new ethers.Contract(CONTRACT_ADDRESS, supplyChainArtifact.abi, signerOrProvider);

// Fetch Smart Contract
// const fetchContract = (signerOrProvider) =>
//     new ethers.Contract(CONTRACT_ADDRESS, supplyChainABI.abi, signerOrProvider);


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
                alert("No accounts found. Please connect MetaMask.");
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

    const registerUser = async (role, walletAddress) => {
        try {
            if (!currentUser) {
                alert("Please connect your wallet first.");
                return false;
            }
            if (currentUser.toLowerCase() !== walletAddress.toLowerCase()) {
                alert("Please Connect to Correct Wallet.");
                return false;
            }

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
                alert("You are already registered!");
                return false;
            }

            //  Register the user
            const tx = await contract.register(role);
            await tx.wait();

            console.log(" User Registered:", role);
            await fetchUserRole(currentUser); // Update user role after registration
            return `✅ User Registered Successfully! ${tx}`;
        } catch (error) {
            console.error("Error registering user:", error);
            alert(" Registration failed: " + (error.reason || error.message));
        }
    };

    const addProducts = async (productitem) => {
        try {
            const {
                croptype,
                harvestdate,
                location,
                farmingpractice,
                certification,
                temperature,
                price,
            } = productitem;

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);

            const tx = await contract.addProduct(
                croptype,
                new Date(harvestdate).getTime(),
                location,
                farmingpractice,
                certification,
                temperature,
                ethers.parseUnits(price.toString(),18)
            );

            const receipt = await tx.wait(); // Wait for transaction confirmation

            // 🔍 Extract event from logs
            const event = receipt.logs
                .map(log => {
                    try {
                        return contract.interface.parseLog(log);
                    } catch (e) {
                        return null;
                    }
                })
                .filter(log => log && log.name === "ProductAdded")[0];

            if (event) {
                const productId = event.args.id;
                const crop = event.args.cropType;
                const farmer = event.args.farmer;

                console.log("Product Added:");
                console.log("Product ID:", productId.toString());
                console.log("Crop Type:", crop);
                console.log("Farmer:", farmer);
                return productId.toString();
            } else {
                console.warn("⚠️ ProductAdded event not found in logs");
            }

        } catch (error) {
            console.error("❌ Error in adding product:", error);
        }
    };

    // Fetch all products added by the current logged-in farmer
    const getFarmerProductDetails = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);

            // 🔹 Step 1: Get product IDs for the current farmer
            const productIds = await contract.getFarmerProductIds();

            const farmerProducts = [];

            // 🔹 Step 2: Loop through each product ID and fetch its details
            for (let i = 0; i < productIds.length; i++) {
                const product = await contract.getProductDetails(productIds[i]);

                const productDetail = {
                    id: product[0].toString(),
                    cropType: product[1],
                    harvestDate: new Date(Number(product[2])),
                    location: product[3],
                    farmingPractices: product[4],
                    certifications: product[5],
                    temperature: product[6].toString(),
                    price: product[7].toString(),
                    farmer: product[8],
                    isSold: product[9],
                };

                farmerProducts.push(productDetail);
            }

            console.log("Farmer's Products:", farmerProducts);
            return farmerProducts;

        } catch (error) {
            console.error("Error fetching farmer's products:", error);
            return [];
        }
    };



    // Manufacture view products of all farmer 
    const getAllProducts = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);

            const product = await contract.getAllProducts();

            console.log(product);
            console.log("Contract Address:", contract.target);
            return product;

        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }



    const requestPurchase = async (index) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);
            const product = await contract.getProductDetails(index);
            console.log("Product:", product);
    
            const tx = await contract.requestPurchase(index, {
                value: product.price,
            });
    
            const transactionHash = tx.hash; // ✅ Capture immediately
            const receipt = await tx.wait();
            console.log("✅ Purchase requested successfully!", transactionHash);
    
            const event = receipt.logs
                .map(log => {
                    try {
                        return contract.interface.parseLog(log);
                    } catch (e) {
                        return null;
                    }
                })
                .filter(log => log && log.name === "PurchaseRequested")[0];
    
            if (event) {
                const productId = event.args.productId;
                const manufacturer = event.args.manufacturer;
                const amountPaid = event.args.amount;
    
                console.log("PurchaseRequested Event Data:");
                console.log("Product ID:", productId.toString());
                console.log("Manufacturer:", manufacturer);
                console.log("Amount Paid:", amountPaid.toString());
    
                // Check Firebase Auth
                const currentUser = getAuth().currentUser;
                if (!currentUser) {
                    throw new Error("User not authenticated in Firebase!");
                }
    
                // Save to Firebase
                await addDoc(collection(db, "purchaseRequests"), {
                    productId: productId.toString(),
                    manufacturer,
                    amountPaid: amountPaid.toString(),
                    farmer: product.farmer,
                    timestamp: new Date().toISOString(),
                    firebaseUID: currentUser.uid,
                });
    
                console.log("✅ Purchase request stored in Firebase.");
            } else {
                console.warn("⚠️ PurchaseRequested event not found in logs.");
                return "⚠️ Transaction succeeded but event not found.";
            }
    
            return "✅ Purchase requested successfully!";
        } catch (error) {
            // console.error("❌ Error in requestPurchase:", error);
    
            if (error?.shortMessage) {
                return `⚠️ ${error.shortMessage}`;
            } else if (error?.reason) {
                return `⚠️ ${error.reason}`;
            }
            return `❌ ${error.message || "Unknown error occurred!"}`;
        }
    };
    


    const confirmDelivery = async (items) => {
        try {
            const { productId, recordedtemp } = items;
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);

            console.log("Contract Address:", contract.target);
            // const balance = await contract.getContractBalance();
            // console.log("Contract Balance:", balance.toString());

            const product = await contract.getProductDetails(productId);
            console.log("Fetched product details:", product);

            // 1. Check if product exists
            if (Number(product.id) === 0) {
                return "⚠️ Product not found!";
            }

            // 2. Check if product already sold
            if (product.isSold) {
                return "⚠️ Product is already sold!";
            }

            const purchaser = await contract.purchaseRequests(productId);

            if (purchaser.toLowerCase() !== currentUser.toLowerCase()) {
                return "⚠️ You are not authorized to confirm this delivery!";
            }


            // 5. Check temperature
            if (Number(product.temperature) !== Number(recordedtemp)) {
                return `⚠️ Temperature mismatch! Expected: ${product.temperature}, but got: ${recordedtemp}`;
            }

            // ✅ All checks passed, finally call confirmDelivery
            const tx = await contract.confirmDelivery(productId, recordedtemp, {
                gasLimit: 300000,
            });

            console.log("Transaction sent, waiting...");
            // await tx.wait();

            // 
            const receipt = await tx.wait(); // Wait for transaction confirmation
    
            const event = receipt.logs
                .map(log => {
                    try {
                        return contract.interface.parseLog(log);
                    } catch (e) {
                        return null;
                    }
                })
                .filter(log => log && log.name === "PaymentReleased")[0];
    
            if (event) {
                const productId = event.args.productId;
                const farmer = event.args.farmer;
                const amountPaid = event.args.amount;
    
                console.log("PurchaseRequested Event Data:");
                console.log("Product ID:", productId.toString());
                console.log("farmer:", farmer);
                console.log("Amount Paid:", amountPaid.toString());
    
                // Check Firebase Auth
                const currentUser = getAuth().currentUser;
                if (!currentUser) {
                    throw new Error("User not authenticated in Firebase!");
                }
    
                // Save to Firebase
                await addDoc(collection(db, "paymentInfo"), {
                    productId: productId.toString(),
                    farmer,
                    amountPaid: amountPaid.toString(),
                    manufacturer: purchaser.toLowerCase(),
                    timestamp: new Date().toISOString(),
                    firebaseUID: currentUser.uid,
                });
    
                console.log("✅ Payment Info stored in Firebase.");
            } else {
                console.warn("⚠️Payment Info event not found in logs.");
                return "⚠️ Transaction succeeded but event not found.";
            }

            console.log("✅ Delivery confirmed successfully!", tx.hash);

            return `✅ Delivery confirmed successfully!`;


        } catch (error) {
            // console.error("Error in confirmDelivery:", error);

            if (error?.shortMessage) {
                return `❌ Smart contract error: ${error.shortMessage}`;
            }

            return "⚠️ Unexpected error during confirmation.";
        }
    };

    // process product by manufacturer

    

    const processProduct = async (items) => {
        try {
            const { productId, processingDate, methods, additives,price } = items;
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);
    
            // ✅ 2. If not processed yet, send transaction
            const tx = await contract.processProduct(
                productId,
                new Date(processingDate).getTime(),
                methods,
                additives,
                ethers.parseUnits(price.toString(),18),
            );
    
            await tx.wait();
            console.log("✅ Product processed successfully! Tx Hash:", tx.hash);
            return "✅ Product processed successfully!";
        } catch (error) {
            
        if (error?.shortMessage) {
            return `⚠️ ${error.shortMessage}`;
        } else if (error?.reason) {
            return `⚠️ ${error.reason}`;
        }
        return `❌ ${error.message || "Unknown error occurred!"}`;
    }
    };
    
    

        // Fetch all products proceesed by the current logged-in Manufacturer
        const getProcessedProductDetails = async () => {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = fetchContract(signer);
    
                // Get productIds processed by this manufacturer
                const productIds = await contract.getMyProcessedProductIds();
                console.log("Product IDs:", productIds);
                const processedProducts = [];
    
                // 🔹 Step 2: Loop through each product ID and fetch its details
                for (let i = 0; i < productIds.length; i++) {
                    const product = await contract.getProcessingDetails(productIds[i]);
    
                    const processedProductDetail = {
                        productId: product[0].toString(),
                        processingDate: new Date(Number(product[1])),
                        methods: product[2],
                        additives : product[3],
                        price : product[4],
                        manufacturer : product[5],
                        shipmentStatus : product[6],
                        supplier : product[7],
                        retailer : product[8],
                        pickupTime : product[9],
                        deliveryTime : product[10],
                    };
    
                    processedProducts.push(processedProductDetail);
                }
    
                console.log("Processed Products:", processedProducts);
                return processedProducts;
    
            } catch (error) {
                console.error("Error fetching farmer's products:", error);
                return [];
            }
        };

        // Manufacturer approved for the Shipment 
        const approvedShipment = async (items) => {
            const {productId, retailer,pickupDate, deliveryDate } = items
            try{
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = fetchContract(signer)

                const tx = await contract.acceptSupplier(
                    productId,
                    retailer,
                    new Date(pickupDate).getTime(),
                    new Date(deliveryDate).getTime()
                );

                await tx.wait();
                console.log("Shipment approved successfully!", tx.hash);
                return "Shipment approved successfully!";
            }
            catch(error){
                if (error?.shortMessage) {
                    return `⚠️ ${error.shortMessage}`;
                } else if (error?.reason) {
                    return `⚠️ ${error.reason}`;
                }
                return `❌ ${error.message || "Unknown error occurred!"}`;
            }
        }
    
    // Supplier can view products of all final product Processed by Manufacturer
    const getAllProcessedProducts = async () => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);
    
            // Step 1: Get all processed product IDs
            const processedProductIds = await contract.getAllProcessedProductIds();
    
            // Step 2: Loop and fetch full processing details
            const processedProducts = await Promise.all(
                processedProductIds.map(async (id) => {
                    const details = await contract.getProcessingDetails(id);
                    return {
                        productId: id.toString(),
                        ...details
                    };
                })
            );
    
            console.log("Processed Products:", processedProducts);
            return processedProducts;
    
        } catch (error) {
            console.error("❌ Error fetching processed products for supplier:", error);
            return [];
        }
    };
    

    // Supplier can request for product
    const requestShipment = async (index) => {
        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);
    
            const tx = await contract.requestToShip(index);
    
            // const transactionHash = tx.hash; // ✅ Capture immediately
            await tx.wait();
            console.log("✅ Shipment requested successfully!", tx);
            return "✅ Shipment requested successfully!";
        } catch (error) {
            // console.error("❌ Error in requestPurchase:", error);
    
            if (error?.shortMessage) {
                return `⚠️ ${error.shortMessage}`;
            } else if (error?.reason) {
                return `⚠️ ${error.reason}`;
            }
            return `❌ ${error.message || "Unknown error occurred!"}`;
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
        // connectWallet();
        checkIfWalletConnected();
    }, []);

    // Listen for wallet disconnect or account change
    useEffect(() => {
        if (typeof window.ethereum !== "undefined") {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length === 0) {
                    // Disconnected
                    setCurrentUser("");
                } else {
                    //  Switched to different account
                    setCurrentUser(accounts[0]);
                }
            });

            window.ethereum.on("disconnect", () => {
                console.log("MetaMask disconnected");
                setCurrentUser("");
            });
        }

        // Cleanup when component unmounts
        return () => {
            if (window.ethereum && window.ethereum.removeListener) {
                window.ethereum.removeListener("accountsChanged", () => { });
                window.ethereum.removeListener("disconnect", () => { });
            }
        };
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
                setCurrentUser,
                addProducts,
                getFarmerProductDetails,
                getAllProducts,
                requestPurchase,
                confirmDelivery,
                processProduct,
                getProcessedProductDetails,
                approvedShipment,
                // supplier
                getAllProcessedProducts,
                requestShipment,
            }}
        >
            {children}
        </SupplyChainContext.Provider>
    );
};


