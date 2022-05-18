// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

interface INFTCollection {
    function balanceOf(address owner) public view returns (uint256);
    function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256);
}