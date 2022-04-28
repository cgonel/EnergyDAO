// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "./Token.sol";


contract TokenSale is Ownable {
    IERC20 public token;
    uint256 public price = 1 gwei;

    constructor(uint256 _totalSupply){
        token = new Token(_totalSupply);
    }

    function buy(uint256 _amount) external payable {
        // right amount sent
        // send token
        // require(msg.value)
    }

    function endSale() external onlyOwner {
        selfdestruct(msg.sender);
    }
}

// 100000000000000000000000