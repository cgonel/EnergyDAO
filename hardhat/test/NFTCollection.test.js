const { expect } = require("chai");
const chai = require("chai");
const { ethers } = require("hardhat");
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

let collection;
let owner;
let addr1;

beforeEach(async () => {
    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    collection = await NFTCollection.deploy("0xB245608616641041876f3a9589576881337FE65D","ipfs://QmVDtQQPrask7VcchbFUHioEecKwGZoszpeCRmpuQnE9jh/");
    await collection.deployed();
    [owner, addr1] = await ethers.getSigners();
})

describe("Deployement", () => {
    it("Should have correct name", async () => {
        const name = await collection.name();
        expect(name).to.equal("Bioengineered Animals");
    })
    it("Should have correct symbol", async () => {
        const symbol = await collection.symbol();
        expect(symbol).to.equal("BEA");
    })
})

describe("Pause", async () => {
    it("Should let owner set pause", async () => {
        await collection.setPaused(true);
        const paused = await collection.paused();
        expect(paused).to.equal(true);
        await expect(collection.connect(addr1).setPaused(false)).to.be.reverted;
    })
})

describe("Presale", async () => {
    it("Should let owner start presale", async () => {
        await expect(collection.connect(addr1).startPresale()).to.be.reverted;
        await collection.startPresale();
        expect(await collection.presaleStarted()).to.equal(true);
    })
})

describe.only("Token URI", async () => {
    it("Should have correct tokenURI", async () => {
        await collection.startPresale();
        // advance 13 hours
        await collection.saleMint({value: ethers.utils.parseEther("0.01")})
        const tokenURI = await collection.tokenURI(1);
        expect(tokenURI).to.equal("ipfs://QmVDtQQPrask7VcchbFUHioEecKwGZoszpeCRmpuQnE9jh/1.json");
    })
})

// describe("Presale Mint", async () => {
//     it("Should not mint when ")
// })

describe("Mint", async () => {})

// describe("Withdrawal", async () => {})