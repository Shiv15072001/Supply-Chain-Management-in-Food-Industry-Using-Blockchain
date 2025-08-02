import React from "react";
import { Str1 } from "../index.js";
import { ethers } from "ethers";


export default function FinalProductDetailModal({
    product,
    setShowModal,
    showModal
}) {
    if (!product || !setShowModal) return null;

    const closeModal = () => setShowModal(false);

        const formatDate = (timestamp) => {
        const date = new Date(Number(timestamp));
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    }

        const converTime = (time) => {
        const newTime = new Date(time);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            
        }).format(newTime);
    };

    return showModal ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black opacity-40"
                onClick={closeModal}
            ></div>
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-xl p-6 bg-white rounded-md shadow-lg z-50">
                    <div className="flex justify-end">
                        <button className="p-2 text-gray-400 rounded-md hover:bg-gray-100" onClick={closeModal}>
                            <Str1 />
                        </button>
                    </div>
                    <h2 className="text-xl font-semibold text-center mb-4">
                        Final Product Details
                    </h2>
                    <div className="space-y-2">
                        <p><strong>Product ID:</strong> {product.productId}</p>
                        <p><strong>Processing Date:</strong> {new Intl.DateTimeFormat("en-US").format(new Date(product.processingDate))}</p>
                        <p><strong>Methods:</strong> {product.methods}</p>
                        <p><strong>Additives:</strong> {product.additives}</p>
                        <p><strong>Price:</strong> {ethers.formatEther(product.price)} ETH</p>
                        <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
                        <p><strong>Supplier:</strong> {product.supplier}</p>
                        <p><strong>Retailer:</strong> {product.retailer}</p>
                        <p>
                                        <strong>ShipmentStatus:</strong> {product.shipmentStatus == 0 ? "NOT APPROVED" : product.shipmentStatus == 1 ? "PENDING APPROVAL" : product.shipmentStatus == 2 ? "ACCEPTED":product.shipmentStatus == 3 ? "IN TRANSIT" : "DELIVERED"}
                                    </p>
                        <p><strong>PickupTime:</strong> {product.pickupTime > 0 ?   formatDate(product.pickupTime)  : "N/A"}</p>
                                    <p><strong>DeliveryTime:</strong> {product.deliveryTime > 0 ?formatDate(product.deliveryTime) : "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
}
