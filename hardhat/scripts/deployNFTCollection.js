const { ethers } = require("hardhat");

const IWHITELIST_ADDRESS = "0xB245608616641041876f3a9589576881337FE65D";
const baseURI = "ipfs://QmVDtQQPrask7VcchbFUHioEecKwGZoszpeCRmpuQnE9jh/";

async function main() {
    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    const collection = await NFTCollection.deploy(IWHITELIST_ADDRESS, baseURI);

    await collection.deployed();

    console.log("NFT Collection deployed to:", collection.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })