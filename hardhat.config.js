// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.28",
// };


require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200, // Lower value => smaller contract size; Higher => cheaper execution gas (but bigger deployment)
      },
    },
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
