const chai = require("chai");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

let whitelist;
let accounts;

beforeEach(async () => {
    const Whitelist = await ethers.getContractFactory("Whitelist");
    whitelist = await Whitelist.deploy(10);
    accounts = await ethers.getSigners();
})

describe("Deployment", async () => {
    it("should have correct amount of maximum whitelisted addresses", async () => {
        expect(await whitelist.maxWhitelistedAddr()).to.equal(10);
    })
})

describe("Whitelist", async () => {
    it("should increase the amount of whitelisted addresses", async () => {
        await whitelist.addWhitelistedAddress();
        expect(await whitelist.numberWhitelistedAddr()).to.equal(1);
    })

    it("should add the caller to the whitelist", async () => {
        await whitelist.addWhitelistedAddress();
        expect(await whitelist.whitelistedAddrs(accounts[0].address)).to.equal(true);
    })

    it("should not let already whitelisted addresses sign up", async () => {
        await whitelist.addWhitelistedAddress();
        await expect(whitelist.addWhitelistedAddress()).to.be.revertedWith("Already whitelisted");
    })

    it("should not let you sign up if maximum whitelist has been reached", async () => {
        // 10 accounts sign up to whitelist
        await whitelist.addWhitelistedAddress();
        await whitelist.connect(accounts[1]).addWhitelistedAddress();
        await whitelist.connect(accounts[2]).addWhitelistedAddress();
        await whitelist.connect(accounts[3]).addWhitelistedAddress();
        await whitelist.connect(accounts[4]).addWhitelistedAddress();
        await whitelist.connect(accounts[5]).addWhitelistedAddress();
        await whitelist.connect(accounts[6]).addWhitelistedAddress();
        await whitelist.connect(accounts[7]).addWhitelistedAddress();
        await whitelist.connect(accounts[8]).addWhitelistedAddress();
        await whitelist.connect(accounts[9]).addWhitelistedAddress();
        await expect(whitelist.connect(accounts[10]).addWhitelistedAddress()).to.be.revertedWith( "Maximum has been reached");
    })
})