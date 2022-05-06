const { ethers } = require("hardhat");

async function main() {
    const NFTCollection = await ethers.getContractFactory("Whitelist");
    const collection = await NFTCollection.deploy("0xB245608616641041876f3a9589576881337FE65D");

    await collection.deployed();

    console.log("NFT Collection deployed to:", whitelist.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })