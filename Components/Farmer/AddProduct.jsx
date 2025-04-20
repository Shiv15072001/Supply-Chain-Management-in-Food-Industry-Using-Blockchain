import { useState,useEffect } from 'react'
import { Str1 } from '../index.js';



export default ({ setAddProductModal,addProductModal,addProducts
}) => {
    const [addProduct,setAddProduct] = useState({
        croptype : "",
        harvestdate : "",
        location : "",
        farmingpractice : "",
        certification : "",
        temperature : "",
        price : ""
    })

    
    const [addedSuccessfully, setAddedSuccessfully] = useState(false);
    const [productId, setProductId] = useState(null);
    const addProductToBlock = async () => {
        try{
            const p_id = await addProducts(addProduct);
            setProductId(p_id);
            setAddedSuccessfully(true);
        }
        catch(error) {
            console.log("Getting error while adding product")
        }
    }

    useEffect(() => {
        if (addedSuccessfully) {
            const timer = setTimeout(() => {
                setAddedSuccessfully(false);
                setAddProductModal(false);
            }, 3000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [addedSuccessfully]);

    return addProductModal ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={() => setAddProductModal(false)}>
            </div>
            <div className='flex items-center min-h-screen px-4 py-8'>
                <div className='relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg'>
                    <div className='flex justify-end' >
                        <button className='p-2 text-gray-400 rounded-md hover:bg-gray-100' onClick={() => setAddProductModal(false)}>
                            <Str1 />
                        </button>
                    </div>
                    <div className="max-w-sm mx-auto py-3 space-y-3 text-center">
                        <h4 className="text-lg font-medium text-gray-800">Complete The ADD PRODUCT</h4>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="relative mt-3">
                                <input
                                    type="text"
                                    placeholder="crop-type"
                                    className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    onChange={(e) => setAddProduct({
                                        ...addProduct,
                                        croptype: e.target.value,
                                    })}
                                />
                            </div>
                            <div className='relative mt-3'>
                                <input
                                    type="date"
                                    placeholder="harvest-date"
                                    className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    onChange={(e) => setAddProduct({
                                        ...addProduct,
                                        harvestdate: e.target.value,
                                    })}  
                                />
                            </div>
                            <div className='relative mt-3'>
                                <input
                                    type="text"
                                    placeholder="location"
                                    className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    onChange={(e) => setAddProduct({
                                        ...addProduct,
                                        location: e.target.value,
                                    })} 
                                />
                            </div>
                            <div className='relative mt-3'>
                                <input
                                    type="text"
                                    placeholder="farming-practice"
                                    className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    onChange={(e) => setAddProduct({
                                        ...addProduct,
                                        farmingpractice: e.target.value,
                                    })}  
                                />
                            </div>
                            <div className='relative mt-3'>
                                <input
                                    type="text"
                                    placeholder="certification"
                                    className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    onChange={(e) => setAddProduct({
                                        ...addProduct,
                                        certification: e.target.value,
                                    })}  
                                />
                            </div>
                            <div className='relative mt-3'>
                                <input
                                    type="number"
                                    placeholder="temperature"
                                    className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    onChange={(e) => setAddProduct({
                                        ...addProduct,
                                        temperature: e.target.value,
                                    })}  
                                />
                            </div>
                            <div className='relative mt-3'>
                                <input
                                    type="number"
                                    placeholder="price (eth)"
                                    className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    onChange={(e) => setAddProduct({
                                        ...addProduct,
                                        price: e.target.value,
                                    })}  
                                />
                            </div>

                            <button onClick={() => addProductToBlock()}  className='block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg ring-offset-2 ring-indigo-600 focus:ring-2'>
                                Add Product
                            </button>
                        </form>

                        {addedSuccessfully && (
                            <div className="flex items-center w-full max-w-xs p-4 mt-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800">
                                <div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414Z" />
                                    </svg>
                                </div>
                                <div className="ml-3 text-sm font-normal">Product added successfully! Product ID:- {productId}</div>
                                <button
                                    onClick={() => setAddedSuccessfully(false)}
                                    className="ml-auto text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5"
                                >
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 13" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    ) : (""
    )
}






