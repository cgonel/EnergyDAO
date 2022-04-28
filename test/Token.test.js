const { expect } = require("chai");
const chai = require("chai");
const { ethers } = require("hardhat");
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

let token;
let owner;
let addr1;
let addr2;
const totalSupply = 1000000;

beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(totalSupply);
    await token.deployed();
    [owner, addr1, addr2] = await ethers.getSigners();
})

describe("Deployement", () => {
    it("should initialized with the right values", async () => {
        expect(await token.name()).to.equal("MightyToken");
        expect(await token.symbol()).to.equal("MTN");
        expect(await token.decimals()).to.equal(18);
        expect(await token.totalSupply()).to.equal(totalSupply);
    })

    it("should assign the total supply to the owner", async () => {
        expect(await token.balanceOf(owner.address)).to.equal(totalSupply);
    })
})

describe("Transfers", async () => {
    it("should transfer tokens", async () => {
        // transfer
        await expect(() => token.transfer(addr1.address, 100)).to.changeTokenBalances(token, [owner, addr1], [-100, 100]);
        // emit event
        await expect(token.transfer(addr1.address,100)).to.emit(token, "Transfer").withArgs(owner.address, addr1.address, 100);
    })

    it("should not transfer tokens if has insufficient amount of tokens or burns token", async () => {
        // insufficient funds
        await expect(token.connect(addr1).transfer(owner.address, 1)).to.be.reverted;
        // burn tokens
        await expect(token.transfer(0x0000000000000000000000000000000000000000, 1)).to.be.reverted;
    })

    it("should approve and change allowance accordingly", async () => {
        await token.approve(addr1.address, 100);
        expect(await token.allowance(owner.address, addr1.address)).to.equal(100);
    })
    
    it("should transfer tokens from third-party by a spender", async () => {
        await token.approve(addr1.address, 200);
        await expect(() => token.connect(addr1).transferFrom(owner.address, addr2.address, 100)).to.changeTokenBalances(token, [owner, addr2], [-100,100]);
        await expect(token.connect(addr1).transferFrom(owner.address, addr2.address, 100)).to.emit(token, "Transfer").withArgs(owner.address, addr2.address, 100);
    })
    
    it("should not transfer tokens from third-party by a spender if doesn't meet requirement", async () => {
        await token.connect(addr1).approve(owner.address, 100);
        await token.approve(addr1.address, 100);
        // not allowed to spend
        await expect(token.connect(addr2).transferFrom(addr1.address, addr2.address, 100)).to.be.revertedWith("Not allowed to spend this amount");
        // insufficient funds
        await expect(token.transferFrom(addr1.address, addr2.address, 100)).to.be.reverted;
        // burn tokens
        await expect(token.connect(addr1).transferFrom(owner.address, "0x0000000000000000000000000000000000000000", 100)).to.be.revertedWith("Can't burn token");
    })
})

describe("Token Supply", async () => {
    it("should mint new tokens", async () => {
        await token.mint(100);
        expect(await token.totalSupply()).to.equal(totalSupply + 100);
        await expect(token.mint(100)).to.emit(token, "Transfer").withArgs("0x0000000000000000000000000000000000000000", owner.address, 100);
    })

    it("should be minted only by owner", async () => {
        await expect(token.connect(addr1).mint(100)).to.be.reverted;
    })

    it("should burn tokens", async () => {
        await token.burn(100);
        expect(await token.totalSupply()).to.equal(totalSupply - 100);
        await expect(token.burn(100)).to.emit(token, "Transfer").withArgs(owner.address, "0x0000000000000000000000000000000000000000", 100);
    })

    it("should be burned only by owner", async () => {
        await expect(token.connect(addr1).burn(100)).to.be.reverted;
    })
})