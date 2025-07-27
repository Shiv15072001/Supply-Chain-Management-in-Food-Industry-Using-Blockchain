
import { useState } from 'react'
import { Str1 } from '../index.js';
import { ethers } from 'ethers';

export default ({ getRetailerProductModal, setGetRetailerProductModal, getIntransitProductDetails }) => {
    const [processedProducts, setProcessedProducts] = useState([]); // Handle array of products

    const [Info, setInfo] = useState(""); // Optional: to store additional info

    const getRetailerProcessedProductDetail = async () => {
        try {
            const getData = await getIntransitProductDetails();
            setProcessedProducts(getData); // Set array
            console.log("p_length",processedProducts.length)
            // console.log(typeof(getData[0].productId))
            console.log(getData);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const removeProduct = () => {
        setGetRetailerProductModal(false)
        setProcessedProducts([])
    }

    const converTime = (time) => {
        const newTime = new Date(time);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            
        }).format(newTime);
    };


    const formatDate = (timestamp) => {
        const date = new Date(Number(timestamp));
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    }


    return getRetailerProductModal ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className='fixed inset-0 w-full h-full bg-black opacity-40' onClick={() => removeProduct()} />
            <div className='flex items-center min-h-screen px-4 py-8'>
                <div className='relative w-full max-w-3xl p-6 mx-auto bg-white rounded-md shadow-lg'>
                    <div className='flex justify-end'>
                        <button className='p-2 text-gray-400 rounded-md hover:bg-gray-100' onClick={() => removeProduct()}>
                            <Str1 />
                        </button>
                    </div>

                    <div className='text-center mb-4'>
                        <h4 className='text-xl font-semibold text-gray-800'>In Transit Products</h4>
                        <button
                            onClick={getRetailerProcessedProductDetail}
                            className='mt-4 py-2 px-4 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg'
                        >
                            View My Products
                        </button>
                    </div>

                    {processedProducts.length === 0 ? (
                        <div className='text-center text-gray-600'>No In Transit Shipments found or not yet fetched.</div>
                    ) : (
                        <div className='grid grid-cols-1 gap-4'>
                            {processedProducts.map((product, index) => (
                                <div key={index} className='p-4 border rounded-lg bg-gray-50 shadow-sm'>
                                    <p><strong>ID:</strong> {product.productId}</p>
                                    <p><strong>Processing Date:</strong> {converTime(product.processingDate)}</p>
                                    <p><strong>Methods:</strong> {product.methods}</p>
                                    <p><strong>Additives:</strong> {product.additives}</p>
                                    <p><strong>Price:</strong> {ethers.formatEther(product.price)} ETH</p>
                                    <p><strong>Manufacturer:</strong> {product.manufacturer} </p>
                                    <p>
                                        <strong>ShipmentStatus:</strong> {product.shipmentStatus == 0 ? "NOT APPROVED" : product.shipmentStatus == 1 ? "PENDING APPROVAL" : product.shipmentStatus == 2 ? "ACCEPTED":product.shipmentStatus == 3 ? "IN TRANSIT" : "DELIVERED"}
                                    </p>
                                    <p><strong>Supplier:</strong> {product.supplier} </p>
                                    <p><strong>Retailer:</strong> {product.retailer} </p>
                                    <p><strong>PickupTime:</strong> {product.pickupTime > 0 ?   formatDate(product.pickupTime)  : "N/A"}</p>
                                    <p><strong>DeliveryTime:</strong> {product.deliveryTime > 0 ?formatDate(product.deliveryTime) : "N/A"}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};



