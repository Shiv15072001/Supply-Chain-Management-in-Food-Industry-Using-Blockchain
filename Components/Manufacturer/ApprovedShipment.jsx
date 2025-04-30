import { useState, useEffect } from 'react'
import { Str1 } from '../index.js';



export default ({setApprovedShipmentModal, approvedShipmentModal,approvedShipment }) => {
    const [addShipmentDetails, setAddShipmentDetails] = useState({
        productId: "",
        retailer: "",
        pickupDate: "",
        deliveryDate: "",
    })


    const [addedSuccessfully, setAddedSuccessfully] = useState(false);
    const [info, setInfo] = useState("");
    const addShipmentProductToBlock = async () => {
        const {productId, retailer,pickupDate, deliveryDate } = addShipmentDetails;
        if (String(productId).trim() === "" || String(retailer).trim() === "" || String(pickupDate).trim() === "" || String(deliveryDate).trim() === "" ){
            return alert("Please fill in all the details!");
        }
        try {
            const show_log = await approvedShipment(addShipmentDetails);
            setInfo(show_log);
            setAddedSuccessfully(true);
        }
        catch (error) {
            console.log("Getting error while adding process product")
        }
    }

    const removeData = async () => {
        setApprovedShipmentModal(false);
        setAddShipmentDetails({
        productId: "",
        retailer: "",
        pickupDate: "",
        deliveryDate: "",
        });
        setInfo("");  // Optional: reset info
        setAddedSuccessfully(false);  // Optional: reset success flag
    };


    useEffect(() => {
        if (addedSuccessfully) {
            const timer = setTimeout(() => {
                setAddedSuccessfully(false);
                setApprovedShipmentModal(false);
            }, 10000); // Hide after 10 seconds
            return () => clearTimeout(timer);
        }
    }, [addedSuccessfully]);

    return approvedShipmentModal ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="fixed inset-0 w-full h-full bg-black opacity-40"
                onClick={() => removeData()}>
            </div>
            <div className='flex items-center min-h-screen px-4 py-8'>
                <div className='relative w-full max-w-lg p-4 mx-auto bg-white rounded-md shadow-lg'>
                    <div className='flex justify-end' >
                        <button className='p-2 text-gray-400 rounded-md hover:bg-gray-100' onClick={() => removeData()}>
                            <Str1 />
                        </button>
                    </div>
                    <div className="max-w-sm mx-auto py-3 space-y-3 text-center">
                        <h4 className="text-lg font-medium text-gray-800">Complete the Shipment Details</h4>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="relative mt-3">
                                <input
                                    type="number"
                                    placeholder="productId"
                                    min={1}
                                    className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    onChange={(e) => setAddShipmentDetails({
                                        ...addShipmentDetails,
                                        productId: e.target.value,
                                    })}
                                />
                            </div>
                            <div className='relative mt-3'>
                                <input
                                    type="text"
                                    placeholder="retailer"

                                    className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    onChange={(e) => setAddShipmentDetails({
                                        ...addShipmentDetails,
                                        retailer: e.target.value,
                                    })}
                                />
                            </div>
                            <div className='relative mt-3'>
                                <input
                                    type="date"
                                    placeholder="pickupDate"

                                    className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    onChange={(e) => setAddShipmentDetails({
                                        ...addShipmentDetails,
                                        pickupDate: e.target.value,
                                    })}
                                />
                            </div>
                            
                            <div className='relative mt-3'>
                                <input
                                    type="date"
                                    placeholder="deliveryDate"

                                    className="w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                    onChange={(e) => setAddShipmentDetails({
                                        ...addShipmentDetails,
                                        deliveryDate: e.target.value,
                                    })}
                                />
                            </div>
                            



                            <button onClick={() => addShipmentProductToBlock()} className='block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg ring-offset-2 ring-indigo-600 focus:ring-2'>
                                Add Shipment Details
                            </button>
                        </form>

                        {addedSuccessfully && (
                            <div className="flex items-center w-full max-w-xs p-4 mt-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800">

                                <div className="ml-3 text-sm font-normal">{info}</div>
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






