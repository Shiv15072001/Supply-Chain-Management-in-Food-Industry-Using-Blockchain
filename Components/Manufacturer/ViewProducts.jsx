import { useState, useEffect } from "react";
import { Str1 } from "../index.js";

export default ({
    getAllProductsModal,
    setGetAllProductsModal,
    getAllProducts,
}) => {
    const [products, setProducts] = useState([]); // Handle array of products
    const [productLength, setProductLength] = useState(0); // Handle array of products

    const viewAllProduct = async () => {
        try {
            const getData = await getAllProducts(); // Assuming smart contract returns an array
            console.log("Received raw data:", getData);

            const parsedProducts = getData.map((product) => ({
                id: product.id,
                cropType: product.cropType,
                harvestDate: new Date(Number(product.harvestDate)),
                location: product.location,
                farmingPractices: product.farmingPractices,
                certifications: product.certifications,
                temperature: product.temperature,
                price: product.price,
                farmer: product.farmer,
                isSold: product.isSold,
            }));

            console.log("Parsed Products:", parsedProducts);
            setProducts(parsedProducts); // Set array of real objects now ✅
            setProductLength(getData.length);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const removeProduct = () => {
        setGetAllProductsModal(false)
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

    // It would call automatically everytime just to get the product count
    // const getProductCount = async () => {
    //     try {
    //         const getData = await getAllProducts();
    //         setProductLength(getData.length);
    //     } catch (error) {
    //         console.error("Error fetching product count:", error);
    //     }
    // };

    // useEffect(() => {
    //     getProductCount();
    // }, []);


    return getAllProductsModal ? (
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
                            Available Products: {productLength}
                        </h4>
                        <button
                            onClick={viewAllProduct}
                            className="mt-4 py-2 px-4 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
                        >
                            View Products
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
                                        <strong>ID:</strong> {product.id?.toString()}
                                    </p>
                                    <p>
                                        <strong>Crop Type:</strong> {product.cropType}
                                    </p>
                                    <p>
                                        <strong>Harvest Date:</strong>{" "}
                                        {converTime(product.harvestDate)}
                                    </p>
                                    <p>
                                        <strong>Location:</strong> {product.location}
                                    </p>
                                    <p>
                                        <strong>Farming Practices:</strong>{" "}
                                        {product.farmingPractices}
                                    </p>
                                    <p>
                                        <strong>Certifications:</strong> {product.certifications}
                                    </p>
                                    <p>
                                        <strong>Temperature:</strong>{" "}
                                        {product.temperature?.toString()} °C
                                    </p>
                                    <p>
                                        <strong>Price:</strong> {product.price?.toString()}
                                    </p>
                                    <p>
                                        <strong>Farmer:</strong> {product.farmer.slice(0, 25)}...
                                    </p>
                                    <p>
                                        <strong>Sold:</strong> {product.isSold ? "✅ Yes" : "❌ No"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    ) : null;
};
