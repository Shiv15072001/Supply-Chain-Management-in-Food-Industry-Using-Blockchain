// import Navbar from '@/Components/Navbar';
// import '../styles/globals.css'
// import { SupplyChainProvider } from '@/conetxt/SupplyChain';


// // {Component,pageProps}
// export default function App({Component,pageProps}){
//     return (
//     <>
//     <SupplyChainProvider>
//     <Navbar />
//     <Component {...pageProps} />
//     </SupplyChainProvider>
//     </>
//     );
// }

import Navbar from "@/components/Navbar";
import "../styles/globals.css";
import { SupplyChainProvider } from "@/conetxt/SupplyChain";
import { AuthProvider } from "@/conetxt/AuthContext"; // New Auth Provider for Firebase

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider> {/* Wrap App in Firebase Auth Provider */}
            <SupplyChainProvider> {/* Wrap App in Web3 Provider */}
                <Navbar />
                <Component {...pageProps} />
            </SupplyChainProvider>
        </AuthProvider>
    );
}

