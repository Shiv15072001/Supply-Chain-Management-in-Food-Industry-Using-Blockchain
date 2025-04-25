import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebaseConfig"; // adjust this path

export const isWalletRegisteredInFirestore = async (walletAddress) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("walletAddress", "==", walletAddress));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("🔥 Firestore wallet check error:", error);
        throw error;
    }
};

// fetch for the purchase Request event logged solidity
export const fetchPurchaseRequestsForManufacturer = async (manufacturerAddress) => {
    try {
        const q = query(
            collection(db, "purchaseRequests"),
            where("manufacturer", "==", manufacturerAddress)
        );

        const querySnapshot = await getDocs(q);

        const requests = [];
        querySnapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() });
        });

        console.log("Fetched Purchase Requests:", requests);
        return requests;
    } catch (error) {
        console.error("Error fetching purchase requests:", error);
        return [];
    }
};



export const getFarmerPurchaseRequests = async (farmerAddress) => {
    const purchasesRef = collection(db, "purchaseRequests");

    const q = query(purchasesRef, where("farmer", "==", farmerAddress));
    const querySnapshot = await getDocs(q);

    const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));

    console.log("Farmer Purchase Requests:", requests);
    return requests;
};



// fetch for the payment released event logged solidity
export const fetchPurchaseListForManufacturer = async (manufacturerAddress) => {
    try {
        const q = query(
            collection(db, "paymentInfo"),
            where("manufacturer", "==", manufacturerAddress.toLowerCase())
        );

        const querySnapshot = await getDocs(q);

        const requests = [];
        querySnapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() });
        });

        console.log("Fetched Payment Released:", requests);
        return requests;
    } catch (error) {
        console.error("Error fetching payment released:", error);
        return [];
    }
};


export const fetchSalesListForFarmer = async (farmerAddress) => {
    try {
        const q = query(
            collection(db, "paymentInfo"),
            where("farmer", "==", farmerAddress)
        );

        const querySnapshot = await getDocs(q);

        const requests = [];
        querySnapshot.forEach((doc) => {
            requests.push({ id: doc.id, ...doc.data() });
        });

        console.log("Fetched Payment Released:", requests);
        return requests;
    } catch (error) {
        console.error("Error fetching payment released:", error);
        return [];
    }
};