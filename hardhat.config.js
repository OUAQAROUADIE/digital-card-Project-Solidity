require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {
      chainId: 1337, // Hardhat Network par défaut
    },
    localhost: {
      url: "http://127.0.0.1:8545", // URL du réseau local Hardhat
    },
  },
};