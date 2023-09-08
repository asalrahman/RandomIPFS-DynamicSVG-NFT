const { assert, expect } = require("chai");
const { getNamedAccounts, ethers, network } = require("hardhat")
const{networkConfig}= require("../helpers-hardhat.config")
describe("randomNft",function() {
    let accounts,deployer,randomNft,VRFCoordinatorV2Mock
    chainId = network.config.chainId
    beforeEach(async function(){
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["all"]);
        randomNft = await ethers.getContract("RandomIpfsNft");
        VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    });

    describe("constructor",()=>{
      it("sets starting values correctly",async()=>{
        const mintFee= await randomNft.getMintFee();
        const tokencounter = await randomNft.getTokenCounter();
        assert.equal(mintFee.toString(),networkConfig[chainId]["mintFee"]);
        assert.equal(tokencounter.toString(),"0")
      });

      describe("requestNft",()=>{
        it("fails if payment isn't sent with the request",async()=>{
          await expect(randomNft.requestNft()).to.be.revertedWith(
            "RandomIpfsNft__EnoughFee"
        )
        });
        it("reverts while not enough eth send",async()=>{
          const fee = await randomNft.getMintFee();
          await expect(randomNft.requestNft({value: fee.sub(ethers.utils.parseEther("0.001"))})).to.be.revertedWith
          ("RandomIpfsNft__EnoughFee");
        });
        it("emits an event", async function () {
          const fee = await randomNft.getMintFee()
          await expect(randomNft.requestNft({ value: fee.toString() })).to.emit(
            randomNft,
            "NftRequested"
        );

  });
   
  describe("fulfillRandomWords", () => {
    it("mints NFT after random number is returned", async function () {
        await new Promise(async (resolve, reject) => {
            randomNft.once("NftMinted", async () => {
                try {
                    const tokenUri = await randomNft.tokenURI("0")
                    const tokenCounter = await randomNft.getTokenCounter()
                    assert.equal(tokenUri.toString().includes("ipfs://"), true)
                    assert.equal(tokenCounter.toString(), "1")
                    resolve()
                } catch (e) {
                    console.log(e)
                    reject(e)
                }
            })
            try {
                const fee = await randomNft.getMintFee()
                const requestNftResponse = await randomNft.requestNft({
                    value: fee.toString(),
                })
                const requestNftReceipt = await requestNftResponse.wait(1)
                await VRFCoordinatorV2Mock.fulfillRandomWords(
                    requestNftReceipt.events[1].args.requestId,
                    randomNft.address
                )
            } catch (e) {
                console.log(e)
                reject(e)
            }
        });
    });
  });

      });
    });
});