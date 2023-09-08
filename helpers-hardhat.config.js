const { ethers } = require("ethers");

const networkConfig = {
  default: {
    name: "hardhat",
    interval: "30",
},
11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    subscriptionId: "5080",
    gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    mintFee: "10000000000000000", // 0.01 ETH
    callbackGasLimit: "500000",

  },
  31337: {
    name: "localhost",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    gasLane: "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    mintFee: "10000000000000000",
    callbackGasLimit: "50000",

  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = "18"
const INITIAL_PRICE = "200000000000000000000"

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_PRICE
};
