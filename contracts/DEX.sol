// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

import "./Token.sol";

// interface IMightyToken is IERC20 {
//     function mint(uint256 _value) external;
//     function burn(uint256 _value) 
// }

interface IDex {
    function buy(uint256) external;
    function sell(uint256) external;
    event Bought(uint256);
    event Sold(uint256);
}

// contract Dex is IDex{
    // IERC20 public token;
    // uint256 public tokenValue = 1 gwei;

    // constructor(){
    //     token = new Token(10000);
    // }

    // function buy(uint256 _value) external {}

    // function sell(uint256 _value) external {}

// }
// to vary supply, can burn/mint tokens when certain condition is met