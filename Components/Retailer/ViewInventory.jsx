
import { useState } from 'react'
import { Str1 } from '../index.js';
import { ethers } from 'ethers';

export default ({ viewInventoryModal, setViewInventoryModal, getViewInventory }) => {
    const [viewInventories, setViewInventories] = useState([]); // Handle array of products
    
    const [Info, setInfo] = useState(""); // Optional: to store additional info

    const getViewInventoryDetail = async () => {
        try {
            const getData = await getViewInventory();
            setViewInventories(getData); // Set array
            console.log(getData);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const removeProduct = () => {
        setViewInventoryModal(false)
        setViewInventories([])
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


    return viewInventoryModal ? (
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
                        <h4 className='text-xl font-semibold text-gray-800'>Inventory</h4>
                        <button
                            onClick={getViewInventoryDetail}
                            className='mt-4 py-2 px-4 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg'
                        >
                            View My Inventory
                        </button>
                    </div>

                    {viewInventories.length === 0 ? (
                        <div className='text-center text-gray-600'>No products found or not yet fetched.</div>
                    ) : (
                        <div className='grid grid-cols-1 gap-4'>
                            {viewInventories.map((product, index) => (
                                <div key={index} className='p-4 border rounded-lg bg-gray-50 shadow-sm'>
                                    <p><strong>ID:</strong> {product.productId}</p>
                                    <p><strong>Arrival Date:</strong> {converTime(product.arrivalDate)}</p>
                                    <p><strong>ShelfLife:</strong> {product.shelfLife}</p>
                                    <p><strong>Storage Conditions:</strong> {product.storageConditions}</p>
                                    <p><strong>Retailer:</strong> {product.retailer} </p>
                                    
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};



