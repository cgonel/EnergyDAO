// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

/**
    @author CGonel
    @title Whitelist
    @notice This contract allows 10 users to sign up to the DAO's whitelist. This whitelist will be used to provide rewards and incentives to the whitelisted addresses.
*/ 

contract Whitelist {
    uint8 public maxWhitelistedAddr;
    uint8 public numberWhitelistedAddr;
    mapping(address => bool) public whitelistedAddrs;

    /// @notice sets the maximum of whitelisted addresses possible
    /// @param  _maxWhitelistedAddr the maximum allowed of whitelisted addresses
    constructor(uint8 _maxWhitelistedAddr) {
        maxWhitelistedAddr = _maxWhitelistedAddr;
    }

    /// @notice adds the caller to the whitelist & increase the number of whitelisted addresses
    function addWhitelistedAddress() external {
        require(!whitelistedAddrs[msg.sender], "Already whitelisted");
        require(maxWhitelistedAddr > numberWhitelistedAddr, "Maximum has been reached");
        numberWhitelistedAddr++;
        whitelistedAddrs[msg.sender] = true;
    } 
}