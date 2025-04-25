import { useState, useEffect } from "react";
import { Str1 } from "../index.js";
import { getFarmerPurchaseRequests } from "@/utils/firebaseHelpers";
import { ethers } from "ethers";


export default ({
    getSalesRequestModal,
    setGetSalesRequestModal,
    walletAddress,
}) => {
    const [requests, setRequests] = useState([]);

    

    const purchaseRequest = async () => {
        const data = await getFarmerPurchaseRequests(walletAddress);
        console.log(data)
        setRequests(data);
    }

    const removeData = async () => {
        setGetSalesRequestModal(false)
        setRequests("")
    }

    return getSalesRequestModal ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
                className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={() => removeData()}
            />
            <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-3xl p-6 mx-auto bg-white rounded-md shadow-lg">
                    <div className="flex justify-end">
                        <button
                            className="p-2 text-gray-400 rounded-md hover:bg-gray-100"
                            onClick={() => removeData()}
                        >
                            <Str1 />
                        </button>
                    </div>

                    <div className="text-center mb-4">
                        <h4 className="text-xl font-semibold text-gray-800">
                            Sales Requests:
                        </h4>
                        <button
                            onClick={purchaseRequest}
                            className="mt-4 py-2 px-4 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                        >
                            View Requests
                        </button>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4">My Sales Requests</h2>
                        {requests.length === 0 ? (
                            <p>No sales requests fetched yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {requests.map((req) => (
                                    <li key={req.id} className="p-4 bg-gray-100 rounded shadow">
                                        <p><strong>Product ID:</strong> {req.productId}</p>
                                        <p><strong>Amount Paid:</strong> {ethers.formatEther(req.amountPaid)} ETH</p>
                                        <p><strong>Manufacturer Adddress:</strong> {req.manufacturer.slice(0,10)}...{req.manufacturer.slice(25)}</p>
                                        <p><strong>Farmer Adddress:</strong> {req.farmer.slice(0,10)}...{req.farmer.slice(25)}</p>
                                        {/* <p><strong>Tx Hash:</strong> {req.txHash.slice(0, 10)}...{req.txHash.slice(35)}</p> */}
                                        <p><strong>Time:</strong> {new Date(req.timestamp).toLocaleString()}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    
                </div>
            </div>
        </div>
    ) : null;
};
