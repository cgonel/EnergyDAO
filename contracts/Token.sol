// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

/**
    @author CGonel
    @title ERC20 - Mighty Token
*/

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract MightyToken is IERC20, Ownable {
    string public name = "MightyToken";
    string public symbol = "MTN";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
 
    // @notice initialiazes supply of token and assigns it to the owner
    constructor(uint256 _totalSupply) {
        totalSupply = _totalSupply;
        balanceOf[owner()] = _totalSupply;
    }

    // @notice transfer requires to have enough token & not be sending to a burning address
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient funds");
        require(_to != address(0), "Can't burn token");

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // @notice account approves a third-party to spend their balance
    function approve(address _spender, uint256 _value) public returns(bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // @notice can transfer from another account if allowed and not sending to burning address
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(allowance[_from][msg.sender] >= _value, "Not allowed to spend this amount");
        require(balanceOf[_from] >= _value, "Insufficient funds");
        require(_to != address(0), "Can't burn token");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    // @notice only the owner can mint more tokens
    function mint(uint256 _value) public onlyOwner {
        balanceOf[msg.sender] += _value;
        totalSupply += _value;
        emit Transfer(address(0), msg.sender, _value);
    }

    // @notice only the owner can burn tokens
    function burn(uint256 _value) public onlyOwner {
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        emit Transfer(msg.sender, address(0), _value);
    }
}
