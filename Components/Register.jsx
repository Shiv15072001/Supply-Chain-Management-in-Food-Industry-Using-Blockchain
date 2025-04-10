import { useContext, useState } from 'react';

import { SupplyChainContext } from '@/conetxt/SupplyChain';

// import {}
export default () => {
    const { registerUser ,userRole} = useContext(SupplyChainContext);
    const [role, setRole] = useState();

    const getRegister = async () => {
        const h = await registerUser(role);
        console.log(h)
    }


    return (
        <>
            <div className='relative mt-3'>
                <input type="number" placeholder='role' className='w-full pl-5 pr-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-indigo-600 shadow-sm rounded-lg' onChange={(e) => setRole(e.target.value)} />
            
            <button onClick={() => getRegister()}
                className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex" >Register</button>
                </div>
                <h1>Role :- {userRole}</h1>
                
                
        </>
    )
}