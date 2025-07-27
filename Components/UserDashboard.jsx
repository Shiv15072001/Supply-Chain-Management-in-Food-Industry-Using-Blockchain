import Register from "./Auth"; // Auth Component
import image from "../images/index"; // Import images
import Image from 'next/image';

export default ({ loading, isAuthenticated, walletAddress, shopName, handleConnectWallet, logout, user, role,setAddProductModal,setGetProductModal,setGetSalesRequestModal,setGetSalesListModal,setGetAllProductsModal,setRequestPurchaseModal,setConfirmDeliveryModal,setPurchaseRequestListModal,setPurchaseListModal,setProcessProductModal,setProcessedProductModal,setApprovedShipmentModal,setGetAllProcessedProductModal,setRequestShipmentModal,setMyShipmentStatusModal,setStartShipmentModal ,setGetAcceptedProductDetailsModal, setGetRetailerProductModal,setCompleteShipmentModal,setGetFinalProductModal,setAddInventoryModal,setViewInventoryModal}) => {

    const roleActions = {
        1: [
            { name: "Add Product", avatar: image.addProduct, action: () => setAddProductModal(true) },
            { name: "Get Product", avatar: image.getProduct, action: () => setGetProductModal(true) },
            { name: "Sales Request", avatar: image.salesRequest, action: () => setGetSalesRequestModal(true) },
            { name: "Sales List", avatar: image.salesList, action: () => setGetSalesListModal(true) },
        ],
        2: [
            { name: "View Products", avatar: image.viewProduct, action: () => setGetAllProductsModal(true) },
            { name: "Request Purchase", avatar: image.requestPurchase, action: () => setRequestPurchaseModal(true) },
            { name: "Purchase Request List ", avatar: image.purchaseRequestList, action: () => setPurchaseRequestListModal(true) },
            { name: "Quality Check", avatar: image.paymentQualityCheck, action: () => setConfirmDeliveryModal(true) },
            { name: "Purchase List", avatar: image.purchaseList, action: () => setPurchaseListModal(true) },
            { name: "Process Product", avatar: image.processProduct, action: () => setProcessProductModal(true) },
            { name: "Processed Product", avatar: image.processedProduct, action: () => setProcessedProductModal(true) },
            { name: "Approved Shipment", avatar: image.approvedShipment, action: () => setApprovedShipmentModal(true) },
        ],
        3: [
            { name: "Available Shipments", avatar: image.availableShipment, action: () => setGetAllProcessedProductModal(true) },
            { name: "Request Shipment", avatar: image.requestShipment, action: () => setRequestShipmentModal(true) },
            { name: "My Shipments Status", avatar: image.myshipemntStatus, action: () => setMyShipmentStatusModal(true) },
            { name: "Start Shipment", avatar: image.startShipment, action: () => setStartShipmentModal(true) },
        ],
        4: [
            { name: "Retailer Shipments", avatar: image.retailerShipments, action: () => setGetAcceptedProductDetailsModal(true)},
            { name: "In Transit Shipments", avatar: image.intransit, action: () => setGetRetailerProductModal(true) },
            { name: "Complete Shipment", avatar: image.completeshipment, action: () => setCompleteShipmentModal(true) },
            { name: "Final Products", avatar: image.finalProduct, action: () => setGetFinalProductModal(true) },
            { name: "Add Inventory", avatar: image.addInventory, action: () => setAddInventoryModal(true) },
            { name: "View Inventory", avatar: image.viewInventory, action: () => setViewInventoryModal(true) },
        ],
        5: [
            { name: "Scan Product", avatar: image.scanProduct, action: () => alert("Scan Product action") },
            { name: "Verify Source", avatar: image.verifySource, action: () => alert("Verify Source action") },
        ],
    };
    const actions = roleActions[role] || [];

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 py-10 px-4">
            {user ? (
                <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 space-y-8">

                    {/* 🖼️ Action buttons at the top */}

{isAuthenticated && !loading && actions.length > 0 && (
    <section>
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-8">
            {actions.map((item, index) => (
                <div
                    key={index}
                    onClick={item.action}
                    className="cursor-pointer flex flex-col items-center bg-gradient-to-r from-white to-gray-100 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-4"
                >
                    <div className="w-full h-40 flex items-center justify-center mb-3">
                        <Image
                            src={item.avatar}
                            alt={item.name}
                            width={150}
                            height={150}
                            className="object-contain"
                        />
                    </div>
                    <span className="text-base font-semibold text-gray-700 text-center">{item.name}</span>
                </div>
            ))}
        </div>
    </section>
)}




                    {/* 📄 User Details */}
                    <section className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Welcome, {user.email}</h2>

                        {loading || !isAuthenticated ? (
                            <p className="text-lg text-gray-600">Fetching your information...</p>
                        ) : (
                            <div className="space-y-2 text-gray-700">
                                <p className="text-lg">
                                    <strong className="text-gray-900">Wallet Address:</strong><br /> {walletAddress}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-900">Shop Name:</strong> {shopName}
                                </p>
                                <p className="text-lg">
                                    <strong className="text-gray-900">Role:</strong>{" "}
                                    {role == 1 ? "Farmer" : role == 2 ? "Manufacturer" : role == 3 ? "Supplier" : role == 4 ? "Retailer" : "Consumer"}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* ⚠️ Wallet Warning */}
                    {!isAuthenticated && (
                        <div className="p-4 text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50">
                            <div className="flex items-center mb-2">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.257 3.099c.366-.446.957-.71 1.577-.71s1.211.264 1.577.71l6.092 7.429A1.25 1.25 0 0116.748 13H3.252a1.25 1.25 0 01-1.005-2.472l6.01-7.429zM11 14a1 1 0 10-2 0 1 1 0 002 0z" />
                                </svg>
                                <h3 className="text-lg font-medium">Warning: Wallet Mismatch</h3>
                            </div>
                            <p className="text-sm mb-2">
                                Please connect your original wallet to access actions.
                            </p>
                            <ul className="text-sm list-disc list-inside mb-2">
                                <li>Disconnect your current wallet.</li>
                                <li>Connect your original wallet: {walletAddress.slice(0, 15)}...{walletAddress.slice(-4)}</li>
                            </ul>
                            <button
                                onClick={handleConnectWallet}
                                className="mt-2 text-white bg-yellow-800 hover:bg-yellow-900 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-3 py-1.5"
                            >
                                Connect MetaMask
                            </button>
                        </div>
                    )}

                    {/* 🚪 Logout */}
                    <div className="text-center">
                        <button
                            onClick={logout}
                            className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Connect to MetaMask & Register</h2>
                    <Register />
                </div>
            )}
        </div>
    );
};
