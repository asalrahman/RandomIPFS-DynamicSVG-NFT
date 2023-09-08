const {  network,ethers } = require("hardhat");

const { developmentChains,networkConfig } = require("../helpers-hardhat.config");
const{verify}=require("../utils/verify")

const FUND_AMOUNT = ethers.utils.parseEther("1");

let tokenUris = [
    "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
    "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
    "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
]

 module.exports =async function({deployments,getNamedAccounts}){
    const{deploy,log}=deployments;
    const{deployer}= await getNamedAccounts();
    const chainId = network.config.chainId

    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock;

    if (chainId == 31337) {
      
      vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
      vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
  
      const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
      const transactionReceipt = await transactionResponse.wait();
      console.log("dfdcf");
      subscriptionId = transactionReceipt.events[0].args.subId;
    
      // Fund the subscription
      // Our mock makes it so we don't actually have to worry about sending fund
      await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
      console.log("dfdcf");
    } else {
      vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
      subscriptionId = networkConfig[chainId]["subscriptionId"];
    }
  log("----------------------------------------------------")
  const arguments = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId]["mintFee"],
    networkConfig[chainId]["gasLane"],
    networkConfig[chainId]["callbackGasLimit"],
    tokenUris
   
  ];

  const randomIpfsNft = await deploy("RandomIpfsNft",{
    from:deployer,
    log:true,
    args:arguments,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  await vrfCoordinatorV2Mock.addConsumer( // for adding consumer
    subscriptionId,
    randomIpfsNft.address
);

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    log("Verifying...")
    await verify(randomIpfsNft.address, arguments)
}

 }

 module.exports.tags=["all","randomIpfsNft"]