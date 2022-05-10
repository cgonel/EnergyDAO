const { expect } = require("chai");
const chai = require("chai");
const { ethers } = require("hardhat");
const { solidity } = require("ethereum-waffle");
const { time } = require("@openzeppelin/test-helpers");
const {deployMockContract} = require('@ethereum-waffle/mock-contract');
const IWhitelist = require("./mock/IWhitelist");

chai.use(solidity);

let collection;
let owner;
let addr1;

beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    mockIWhitelist = await deployMockContract(owner, IWhitelist.abi);
    const NFTCollection = await ethers.getContractFactory("NFTCollection");
    collection = await NFTCollection.deploy(mockIWhitelist.address,"ipfs://QmVDtQQPrask7VcchbFUHioEecKwGZoszpeCRmpuQnE9jh/");
    await collection.deployed();
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

describe("Token URI", async () => {
    it("Should have correct tokenURI", async () => {
        await collection.startPresale();
        // advance 12 hours
        await time.increase(12*60*60);
        await collection.saleMint({value: ethers.utils.parseEther("0.01")})
        const tokenURI = await collection.tokenURI(1);
        expect(tokenURI).to.equal("ipfs://QmVDtQQPrask7VcchbFUHioEecKwGZoszpeCRmpuQnE9jh/1.json");
    })
})

describe("Presale Mint", async () => {
    it("Should not mint when not presale time", async () => {
        await expect(collection.presaleMint()).to.be.revertedWith("Presale hasn't started");
        await collection.startPresale();
        await time.increase(12*60*60);
        await expect(collection.presaleMint()).to.be.revertedWith("Presale has ended");
    })
    it("Should only let whitelisted address mint", async () => {
        await collection.startPresale();
        await mockIWhitelist.mock.whitelistedAddrs.withArgs(owner.address).returns(false);
        await expect(collection.presaleMint()).to.be.revertedWith("Can't buy during presale");
        await mockIWhitelist.mock.whitelistedAddrs.withArgs(addr1.address).returns(true);
        await expect(collection.connect(addr1).presaleMint({value: ethers.utils.parseEther("0.005")})).to.emit(collection, "Transfer");
    })
    it("Should let correct amount mint", async () => {
        await collection.startPresale()
        await mockIWhitelist.mock.whitelistedAddrs.withArgs(owner.address).returns(true);
        await expect(collection.presaleMint()).to.be.revertedWith("Incorrect amount")
        await expect(collection.presaleMint({value: ethers.utils.parseEther("0.005")})).to.emit(collection, "Transfer");
    })
    // it("Should not let mint over total tokens of collection", async () => {

    // })
})

describe("Mint", async () => {
    it("Should not let mint during presale", async () => {
        await collection.startPresale();
        await expect(collection.saleMint()).to.be.revertedWith("Presale still in progress");
    })
    it("Should let the correct amount mint", async () => {
        await collection.startPresale();
        await time.increase(12*60*60);
        await expect(collection.saleMint({value: ethers.utils.parseEther("0.01")})).to.emit(collection, "Transfer");
        await expect(collection.saleMint({value: ethers.utils.parseEther("0.05")})).to.be.revertedWith("Incorrect amount");
    })
    // it("Should not let mint more than total tokens of the collection", async () => {

    // })
})

describe("Withdrawal", async () => {
    it("should only let owner withdraw", async () => {
        await collection.withdraw();
        await expect(collection.connect(addr1).withdraw()).to.be.reverted;
    })
})