// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

// /**
//     @author CGonel
//     @title Crowdsale
//     @notice The crowdsale will have a cap of _ and will last 72 hours. The early adopters that are whitelisted will be able to buy for the first 12 hours exclusively.
// */

// import "./Token.sol";

// contract TokenSale is Ownable {
//     IERC20 public token;
//     uint256 public price = 1 gwei;

//     constructor(uint256 _totalSupply){
//         token = new Token(_totalSupply);
//     }

//     event Sold(address buyer, uint256 amount);

//     // whitelist

//     function buy(uint256 _amount) external payable {
//         // right amount sent
//         require(msg.value == _amount * price, "Incorrect funds");
//         // send token
//         // require(msg.value)
//     }

//     function endSale() external onlyOwner {
//         selfdestruct(msg.sender);
//     }
// }

// // 100000000000000000000000