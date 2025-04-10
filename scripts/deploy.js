const hre = require("hardhat");

async function main() {
    const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
    const supplychain = await SupplyChain.deploy();

    await supplychain.waitForDeployment(); // ✅ Correct method in Ethers v6

    console.log("SupplyChain deployed to:", await supplychain.getAddress()); // ✅ Correct way to get address in Ethers v6
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
