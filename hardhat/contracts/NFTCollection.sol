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

    bool public paused;
    bool public presaleStarted;
    uint64 public presaleEnd;
    uint8 public maxTokens = 20;
    uint256 public presalePrice = 0.005 ether;
    uint256 public salePrice = 0.01 ether;
    string baseTokenURI;

    /// @notice sets the name, symbol of the NFT Collection
    /// @param _address address of the whitelist contract
    constructor(address _address, string memory _baseTokenURI) ERC721("Bioengineered Animals","BEA"){
        whitelistContract = IWhitelist(_address);
        baseTokenURI = _baseTokenURI;
    }

    /// @notice sets if contract is paused or not
    /// @param _contractState bool to indicate the state of the contract
    function setPaused(bool _contractState) external onlyOwner {
        paused = _contractState;
    }

    /// @notice requires contract to not be paused
    modifier onlyWhenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    /// @notice starts the presale and sets an end time
    function startPresale() external onlyOwner {
        presaleStarted = true;
        presaleEnd = uint64(block.timestamp + 12 hours);
    }

    /// @notice returns the baseURI of the token URI
    /// @return string the baseURI
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    /// @notice find the URI of the token
    /// @param _tokenId the id of the token desired
    /// @return string URI where the token's metadata can be found
    function tokenURI(uint256 _tokenId) public view virtual override(ERC721, ERC721URIStorage) returns (string memory) {
        require(_exists(_tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory base = _baseURI();

        return bytes(base).length > 0 ? string(abi.encodePacked(base, _tokenId.toString(), ".json")) : "";
    }

    /// @notice mint an NFT during the presale
    function presaleMint() external payable onlyWhenNotPaused {
        require(presaleStarted, "Presale hasn't started");
        require(block.timestamp < presaleEnd, "Presale has ended");
        require(whitelistContract.whitelistedAddrs(msg.sender), "Can't buy during presale");
        require(msg.value == presalePrice, "Incorrect amount");
        require(tokenId.current() != maxTokens, "All the NFTs have been minted");
        tokenId.increment();
        _safeMint(msg.sender, tokenId.current());
    }

    /// @notice mint an NFT
    function saleMint() external payable onlyWhenNotPaused {
        require(presaleStarted && block.timestamp >= presaleEnd, "Presale still in progress");
        require(msg.value == salePrice, "Incorrect amount");
        require(tokenId.current() != maxTokens, "All the NFTs have been minted");
        tokenId.increment();
        _safeMint(msg.sender, tokenId.current());
    }

    /// @notice withdraw the funds from the contract
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