import { useState } from "react";
import { ethers } from "ethers";

const MetaMaskConnect = ({ user }) => {
    const [account, setAccount] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
        } else {
            alert("MetaMask not detected!");
        }
    };

    return (
        <div>
            <h2>Welcome, {user?.email || "Guest"} ({user?.role})</h2>
            <button onClick={connectWallet}>Connect MetaMask</button>
            {account && <p>Connected Wallet: {account}</p>}
        </div>
    );
};

export default MetaMaskConnect;
