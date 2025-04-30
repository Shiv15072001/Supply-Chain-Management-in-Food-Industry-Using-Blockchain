import { useState, useEffect } from "react";
import { Str1 } from "../index.js";
import { ethers } from "ethers";

export default ({
    getAllProcessedProductModal,
    setGetAllProcessedProductModal,
    getAllProcessedProducts,
}) => {
    const [products, setProducts] = useState([]); // Handle array of products
    // const [productLength, setProductLength] = useState(0); // Handle array of products

    const viewAllProcessedProduct = async () => {
        try {
            const getData = await getAllProcessedProducts(); // Assuming smart contract returns an array
            console.log("Received raw data:", getData);

            const parsedProducts = getData.map((product) => ({
                id: product[0].toString(),
                processedDate: new Date(Number(product[1])),
                methods: product[2],
                additives: product[3],
                price: product[4],
                manufacturer: product[5],
                shipmentStatus: Number(product[6]),
                supplier: product[7],
                retailer: product[8],
                pickupTime: Number(product[9]),
                deliveryTime: Number(product[10]),
            }));


            console.log("Parsed Products:", parsedProducts);
            setProducts(parsedProducts); // Set array of real objects now ✅
            // setProductLength(getData.length);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const removeProduct = () => {
        setGetAllProcessedProductModal(false);
        setProducts([]);
    };

    const converTime = (time) => {
        const newTime = new Date(time);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(newTime);
    };

    return getAllProcessedProductModal ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div
                className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={() => removeProduct()}
            />
            <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-full max-w-3xl p-6 mx-auto bg-white rounded-md shadow-lg">
                    <div className="flex justify-end">
                        <button
                            className="p-2 text-gray-400 rounded-md hover:bg-gray-100"
                            onClick={() => removeProduct()}
                        >
                            <Str1 />
                        </button>
                    </div>

                    <div className="text-center mb-4">
                        <h4 className="text-xl font-semibold text-gray-800">
                            Available Shipments
                        </h4>
                        <button
                            onClick={viewAllProcessedProduct}
                            className="mt-4 py-2 px-4 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                        >
                            View
                        </button>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center text-gray-600">
                            No products found or Not fetched yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {products.map((product, index) => (
                                <div
                                    key={index}
                                    className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                                >
                                    <p>
                                        <strong>ProductId:</strong> {product.id?.toString()}
                                    </p>
                                    <p>
                                        <strong>ProcessedDate:</strong>{" "}
                                        {converTime(product.processedDate)}
                                    </p>
                                    <p>
                                        <strong>Methods:</strong> {product.methods?.toString()}
                                    </p>
                                    <p>
                                        <strong>Additives:</strong> {product.additives?.toString()}
                                    </p>
                                    <p>
                                        <strong>Price:</strong>{" "}
                                        {ethers.formatEther(product.price?.toString())}
                                    </p>
                                    <p>
                                        <strong>Manufacturer:</strong>{" "}
                                        {product.manufacturer?.toString()}
                                    </p>
                                    <p>
                                        <strong>ShipmentStatus:</strong>{" "}
                                        {product.shipmentStatus == 0
                                            ? "NOT APPROVED"
                                            : product.shipmentStatus == 1
                                                ? "PENDING APPROVAL"
                                                : product.shipmentStatus == 2
                                                    ? "ACCEPTED"
                                                    : product.shipmentStatus == 3
                                                        ? "IN TRANSIT"
                                                        : "DELIVERED"}
                                    </p>
                                    <p>
                                        <strong>Supplier:</strong> {product.supplier?.toString()}
                                    </p>
                                    <p>
                                        <strong>Retailer:</strong> {product.retailer?.toString()}
                                    </p>

                                    <p><strong>PickupTime:</strong> {product.pickupTime > 0 ? converTime(product.pickupTime) : "N/A"}</p>
                                    <p><strong>DeliveryTime:</strong> {product.deliveryTime > 0 ? converTime(product.deliveryTime) : "N/A"}</p>

                                    {/* <p>
                                        <strong>Sold:</strong> {product.isSold ? "✅ Yes" : "❌ No"}
                                    </p> */}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};
