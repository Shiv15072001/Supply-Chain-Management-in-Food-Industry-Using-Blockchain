import React, { useState } from "react";
import { Str1 } from "../index.js";

export default function ViewProductCustomerModal({
    viewProductCustomerModal,
    setViewProductCustomerModal,
    getViewInventoryConsumer,
    onViewFinalProduct
}) {
    const [viewInventories, setViewInventories] = useState([]);

    const getProductDetail = async () => {
        try {
            const inventories = await getViewInventoryConsumer();
            setViewInventories(inventories);
        } catch (error) {
            console.error("❌ Error fetching inventory details:", error);
        }
    };

    const handleDetailClick = async (productId) => {
        await onViewFinalProduct(productId); // This will set and show the final product modal
    };

    const removeProduct = () => {
        setViewProductCustomerModal(false);
        setViewInventories([]);
    };

    const formatDate = (dateObj) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(dateObj);
    };

    return viewProductCustomerModal ? (
        <div className="fixed inset-0 z-40 overflow-y-auto">
            <div className="fixed inset-0 w-full h-full bg-black opacity-40" onClick={removeProduct} />
            <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-3xl p-6 mx-auto bg-white rounded-md shadow-lg z-50">
                    <div className="flex justify-end">
                        <button className="p-2 text-gray-400 rounded-md hover:bg-gray-100" onClick={removeProduct}>
                            <Str1 />
                        </button>
                    </div>

                    <div className="text-center mb-4">
                        <h4 className="text-xl font-semibold text-gray-800">Inventory</h4>
                        <button
                            onClick={getProductDetail}
                            className="mt-4 py-2 px-4 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                        >
                            View My Inventory
                        </button>
                    </div>

                    {viewInventories.length === 0 ? (
                        <div className="text-center text-gray-600">No inventory found or not fetched yet.</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {viewInventories.map((product, index) => (
                                <div key={index} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                                    <p><strong>Product ID:</strong> {product.productId}</p>
                                    <p><strong>Arrival Date:</strong> {formatDate(product.arrivalDate)}</p>
                                    <p><strong>Shelf Life:</strong> {product.shelfLife} days</p>
                                    <p><strong>Storage Conditions:</strong> {product.storageConditions}</p>
                                    <p><strong>Retailer:</strong> {product.retailer}</p>
                                    <button
                                        onClick={() => handleDetailClick(product.productId)}
                                        className="mt-4 py-2 px-4 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                                    >
                                        Detail
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;
}
