const { expect } = require("chai");
const chai = require("chai");
const { ethers } = require("hardhat");
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

/**
 * OK name
 * OK symbol
 * OK decimals
 * OK totalSupply
 * balanceOf
 * allowance
 * OK check transfer function
 * check approve function
 * check transferFrom function
 * check mint function
 * check burn function
 */
let token;

describe("Token", () => {
    before(async () => {
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy(1000000);
        await token.deployed();
    })

    it("should have the right name", async () => {
        expect(await token.name()).to.equal("MightyToken");
    })

    it("should have the right symbol", async () => {
        expect(await token.symbol()).to.equal("MTN");
    })

    it("should have the right amount of decimals", async () => {
        expect(await token.decimals()).to.equal(18);
    })

    it("should have the right amount of total supply", async () => {
        expect(await token.totalSupply()).to.equal(1000000);
    })

    it("should be transferable if meets requirements", async () => {
        const [owner, addr1] = await ethers.getSigners();
        // insufficient funds
        await expect(token.connect(addr1).transfer(owner.address, 1)).to.be.reverted;
        // burning tokens
        await expect(token.transfer(0x0000000000000000000000000000000000000000, 1)).to.be.reverted;
        // transfer
        await expect(() => token.transfer(addr1.address, 100)).to.changeTokenBalances(token, [owner, addr1], [-100, 100]);
        // emit event
        await expect(token.transfer(addr1.address,100)).to.emit(token, "Transfer").withArgs(owner.address, addr1.address, 100);
    })
})