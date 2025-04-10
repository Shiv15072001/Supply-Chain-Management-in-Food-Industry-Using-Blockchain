import {useState, useEffect, useContext} from 'react'

// import { TrackingContext } from '../Conetxt/Tracking';
import {Nav1,Nav2, Nav3} from "../Components/index"
import { SupplyChainContext } from '@/conetxt/SupplyChain';

// import {}


export default () => {
    const [state, setState] = useState(true);
    const { connectWallet,currentUser } = useContext(SupplyChainContext);

    const navigation = [

        {
            title: "Home",
            path: "#"
        },
        {
            title: "Services",
            path: "#"
        },
        {
            title: "Contact Us",
            path: "#"
        },
        {
            title: "Erc20",
            path: "#"
        }
    ];

    // useEffect(() => {
    //     document.onclick = (e) => {
    //         const target = e.target;
    //         if (!target.closest(".menu-btn")) setState(false);
    //     };
    // }, []);

    return (
        <nav
            className={`bg-white pb5 md:text-sm ${state ? "shadow-lg roundedxl border mx-2 mt-2 md:shadow-none md:border-none md:mx-2 md:mt-0" : ""}`}
        >
            <div className='gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8'>
                <div className='flex items-center justify-between py-5 md:block'>
                    <a href="javascript:void(0)">
                        <img
                            src="https://www.floatui.com/logo.svg"
                            width={120}
                            height={50}
                            alt="Float UI logo"
                        />
                    </a>
                    <div className='md:hidden'>
                        <button
                            className="menu-btn text-gray-500 hover:text-grey-800"
                            
                        >
                            {state ? <Nav1 /> : <Nav2 />}
                        </button>
                    </div>
                </div>
                <div
                    className={`flex-1 items-center mt-8 md:mt-0 md:flex ${state ? "block" : "hidden"}`}>
                    <ul className='justify-center items-center space-y-6 md:flex md:space-x-6 md:space-y-0'>
                        {navigation.map((item, idx) => {
                            return (
                                <li key={idx} className='text-grey-700 hover:text-gray-900'>
                                    <a href={item.path} className='block'>
                                        {item.title}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                    <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6 md:flex md:space-y-0 md:mt-0">
                        (
                            <p className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex"></p>
                        ) : (
                            <button 
                            onClick={() => connectWallet()}
                                className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex" >
                                {`${currentUser == "" ? `Connect Wallet`: currentUser.slice(0,25)}`}
                                
                            </button>
                        )
                    </div>

                </div>
            </div>
        </nav>

    )
}

