// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

/**
    @author CGonel
    @title NFT Collection
    @notice This contract represents EnergyDAO's NFT Collection.
*/ 

import "./IWhitelist.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTCollection is ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    IWhitelist whitelistContract;

    Counters.Counter private tokenId;

    bool paused;
    bool public presaleStarted;
    uint64 public presaleEnd;
    uint8 public presalePrice;
    uint8 public salePrice;
    uint8 public maxTokens = 20;


    constructor(address _address) ERC721("Bioengineered Animals","BEA"){
        whitelistContract = IWhitelist(_address);
    }

    function setPaused(bool _contractState) external onlyOwner {
        paused = _contractState;
    }

    modifier onlyWhenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    function startPresale() external onlyOwner {
        presaleStarted = true;
        presaleEnd = uint64(block.timestamp + 12 hours);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmVDtQQPrask7VcchbFUHioEecKwGZoszpeCRmpuQnE9jh/";
    }

    function tokenURI(uint256 _tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(_tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory base = _baseURI();

        return bytes(base).length > 0 ? string(abi.encodePacked(base, _tokenId.toString(), ".json")) : "";
    }

    function presaleMint() external payable onlyWhenNotPaused {
        require(presaleStarted, "Presale hasn't started");
        require(block.timestamp < presaleEnd, "Presale has ended");
        require(whitelistContract.whitelistedAddrs(msg.sender), "Can't buy during presale");
        require(msg.value == presalePrice, "Incorrect amount");
        require(tokenId.current() != maxTokens, "All the NFTs have been minted");
        tokenId.increment();
        _safeMint(msg.sender, tokenId.current());
    }

    function saleMint() external payable onlyWhenNotPaused {
        require(msg.value == presalePrice, "Incorrect amount");
        require(tokenId.current() != maxTokens, "All the NFTs have been minted");
        tokenId.increment();
        _safeMint(msg.sender, tokenId.current());
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{value:address(this).balance}("");
        require(success, "Failed withdrawal");
    }

    receive() external payable {}

    fallback() external payable {}

    // functions required by solidity
     function _beforeTokenTransfer(address from, address to, uint256 _tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, _tokenId);
    }

    function _burn(uint256 _tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(_tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}