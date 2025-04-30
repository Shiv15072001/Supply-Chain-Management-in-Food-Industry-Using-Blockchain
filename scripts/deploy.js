// const hre = require("hardhat");

// async function main() {
//     const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
//     const supplychain = await SupplyChain.deploy();

//     await supplychain.waitForDeployment(); // ✅ Correct method in Ethers v6

//     console.log("SupplyChain deployed to:", await supplychain.getAddress()); // ✅ Correct way to get address in Ethers v6
// }

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });


// scripts/deploy.js
const fs = require("fs");
const hre = require("hardhat");

async function main() {
    // Compile if not already
    await hre.run('compile');

    // Get contract factory
    const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");

    // Deploy contract
    console.log("🚀 Deploying SupplyChain...");
    const supplyChain = await SupplyChain.deploy();
    await supplyChain.waitForDeployment();

    const contractAddress = await supplyChain.getAddress();
    console.log("✅ Contract deployed to:", contractAddress);

    // Save deployed address to frontend
    const addressData = `export const CONTRACT_ADDRESS = "${contractAddress}";\n`;
    // fs.mkdirSync("./frontend/constants", { recursive: true })
    fs.writeFileSync("./frontend/constants/contractAddress.js", addressData);

    // Save updated ABI to frontend
    const artifact = await hre.artifacts.readArtifact("SupplyChain");
    // fs.mkdirSync("./frontend/constants", { recursive: true });
    fs.writeFileSync("./frontend/constants/SupplyChain.json", JSON.stringify(artifact, null, 2));

    console.log("✅ Address and ABI updated for frontend successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
