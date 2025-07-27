
import { useState,useEffect } from 'react'
import { Str1 } from '../index.js';

export default ({ startShipmentModal,setStartShipmentModal, startShipment }) => {
    const [index, setIndex] = useState(0);
    const [addedSuccessfully, setAddedSuccessfully] = useState(false);
    const [info,setInfo] =  useState("")

    const getStartShipment = async () => {
        if (index === 0) {
            return alert("Please fill in all the details!");
        }
        try {
            const getData = await startShipment(index); // Set array
            console.log(getData);
            setInfo(getData);
            setAddedSuccessfully(true);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    const removeData = () => {
        setStartShipmentModal(false);
        setIndex(0); // Reset index to 0
        setInfo("");  // Optional: reset info
        setAddedSuccessfully(false);  // Optional: reset success flag
    }

    useEffect(() => {
        if (addedSuccessfully) {
            const timer = setTimeout(() => {
                setAddedSuccessfully(false);
                setRequestPurchaseModal(false);
            }, 10000); // Hide after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [addedSuccessfully]);


    return startShipmentModal ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className='fixed inset-0 w-full h-full bg-black opacity-40' onClick={() => removeData()}>
            </div>
            <div className='flex items-center min-h-screen px-4 py-8'>
                <div className='relative w-full max-w-3xl p-6 mx-auto bg-white rounded-md shadow-lg'>
                    <div className='flex justify-end'>
                        <button className='p-2 text-gray-400 rounded-md hover:bg-gray-100' onClick={() => removeData()}>
                            <Str1 />
                        </button>
                    </div>
                    <div className="max-w-sm mx-auto py-3 space-y-3 text-center">
                        <h4 className="text-lg font-medium text-gray-800">Start Shipment</h4>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className='relative mt-3'>
                            <input type="number" placeholder="Product ID" className='w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg' min={1} onChange={(e) => setIndex(e.target.value)} />
                        </div>

                        <button onClick={() => getStartShipment()} className='block w-full mt-3 py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg ring-offset-2 ring-indigo-600 focus:ring-2'>
                            Start Shipmant
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
    ) : ("");
};



