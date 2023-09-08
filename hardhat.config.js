require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-gas-reporter")





/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP = process.env.COINMARKETCAP

module.exports = {

defaultNetwork:"hardhat",

networks:{
  hardhat:{
    chainId:31337,
    // blockconfirmations:1
  },
  sepolia:{
    url:SEPOLIA_RPC_URL,
    accounts:[PRIVATE_KEY],
    saveDeployments: true,
    chainId:11155111,
    // blockconfirmations:1
  }
},
solidity: {
  compilers: [
      {
          version: "0.8.8",
      },
     
  ],
},

  gasReporter: {
    enabled:false,
    outputFile:"gasReporter.txt",
    noColors:true,
    currency:"USD",
    coinmarketcap:COINMARKETCAP,
    token:"ETH"
  },
  etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
        sepolia: ETHERSCAN_API_KEY,
    },
    // In case the module can't find the rinkeby etherscan automatically
    customChains: [
        {
            network: "sepolia",
            chainId: 11155111,
            urls: {
                apiURL: "https://api-sepolia.etherscan.io/api",
                browserURL: "https://sepolia.etherscan.io",
            },
        },
    ],
},
  namedAccounts: {
    deployer: {
        default: 0,
    },
    player: {
        default: 1,
    },
},
mocha: {
  timeout: 300000, // Set a higher timeout value
},
};
