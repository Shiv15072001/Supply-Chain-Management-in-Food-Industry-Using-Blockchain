import { useState, useContext } from 'react';
import { Nav1, Nav2 } from "../Components/index";
import { SupplyChainContext } from '@/conetxt/SupplyChain';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { connectWallet, currentUser } = useContext(SupplyChainContext);

    const navigation = [
        { title: "Home", path: "#" },
        { title: "Services", path: "#" },
        { title: "Contact Us", path: "#" },
        { title: "ERC20", path: "#" },
    ];

    return (
        <nav className="bg-white shadow-md relative">
            <div className="max-w-screen-xl mx-auto px-4 md:flex md:items-center md:justify-between py-4">
                {/* Logo */}
                <div className="flex items-center justify-between">
                    <a href="#">
                        <img
                            src="https://www.floatui.com/logo.svg"
                            width={120}
                            height={50}
                            alt="Float UI Logo"
                            className="object-contain"
                        />
                    </a>
                    <div className="md:hidden">
                        <button
                            className="text-gray-700 hover:text-gray-900 focus:outline-none"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <Nav1 /> : <Nav2 />}
                        </button>
                    </div>
                </div>

                {/* Menu Items */}
                <div className={`flex-1 justify-between items-center mt-6 md:mt-0 md:flex ${isMenuOpen ? "block" : "hidden"}`}>
                    <ul className="flex flex-col space-y-4 md:flex-row md:space-x-8 md:space-y-0">
                        {navigation.map((item, idx) => (
                            <li key={idx}>
                                <a
                                    href={item.path}
                                    className="text-gray-700 hover:text-indigo-600 font-medium transition duration-200"
                                >
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* Connect Wallet Button */}
                    <div className="mt-4 md:mt-0">
                        {currentUser ? (
                            <p className="flex items-center py-2 px-4 text-white bg-green-600 hover:bg-green-700 rounded-full transition duration-300 font-semibold text-sm">
                                {currentUser.slice(0, 6)}...{currentUser.slice(-4)}
                            </p>
                        ) : (
                            <button
                                onClick={connectWallet}
                                className="py-2 px-6 bg-indigo-600 hover:bg-indigo-700 rounded-full text-white font-semibold text-sm transition duration-300"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
