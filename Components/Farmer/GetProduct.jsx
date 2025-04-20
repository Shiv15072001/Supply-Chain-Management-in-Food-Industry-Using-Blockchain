
import { useState } from 'react'
import { Str1 } from '../index.js';

export default ({ getProductModal, setGetProductModal, getFarmerProductDetails}) => {
    const [products, setProducts] = useState([]); // Handle array of products

    const getProductDetail = async () => {
        try {
            const getData = await getFarmerProductDetails(); 
            setProducts(getData); // Set array
            console.log(getData);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const removeProduct = () => {
        setGetProductModal(false)
        setProducts([])
    }

    const converTime = (time) => {
        const newTime = new Date(time);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        }).format(newTime);
    };

    return getProductModal ? (
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
                        <h4 className='text-xl font-semibold text-gray-800'>Farmer's Products</h4>
                        <button
                            onClick={getProductDetail}
                            className='mt-4 py-2 px-4 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg'
                        >
                            View My Products
                        </button>
                    </div>

                    {products.length === 0 ? (
                        <div className='text-center text-gray-600'>No products found or not yet fetched.</div>
                    ) : (
                        <div className='grid grid-cols-1 gap-4'>
                            {products.map((product, index) => (
                                <div key={index} className='p-4 border rounded-lg bg-gray-50 shadow-sm'>
                                    <p><strong>ID:</strong> {product.id}</p>
                                    <p><strong>Crop Type:</strong> {product.cropType}</p>
                                    <p><strong>Harvest Date:</strong> {converTime(product.harvestDate)}</p>
                                    <p><strong>Location:</strong> {product.location}</p>
                                    <p><strong>Farming Practices:</strong> {product.farmingPractices}</p>
                                    <p><strong>Certifications:</strong> {product.certifications}</p>
                                    <p><strong>Temperature:</strong> {product.temperature}°C</p>
                                    <p><strong>Price:</strong> {product.price}</p>
                                    <p><strong>Farmer:</strong> {product.farmer.slice(0, 25)}...</p>
                                    <p><strong>Sold:</strong> {product.isSold ? "✅ Yes" : "❌ No"}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};



