// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

interface IWhitelist {
    function whitelistedAddrs(address) external returns(bool);
}