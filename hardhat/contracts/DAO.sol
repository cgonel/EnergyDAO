// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

import "./INFTCollection.sol";
// import interface to buy NFT on marketplace

contract DAO {
    INFTCollection nftContract;

    struct Proposal {
        // add token purchase information
        uint64 deadline;
        uint8 yes;
        uint8 no;
        bool executed;
        mapping(uint256=>bool) voters;
    }

    mapping(uint256=>Proposal) proposals;
    uint256 numOfProposals;

    enum Votes {
        yes,
        no
    }

    constructor (address _contractAddress) {
        nftContract = INFTCollection(_contractAddress);
    }

    modifier onlyNFTHolder() {
        require(nftContract.balanceOf(msg.sender) > 0, "Not an NFT holder");
        _;
    }

    modifier onlyActiveProposal(uint256 _proposalId) {
        require(targetProposal.deadline > block.timestamp, "Proposal inactive");
        _;
    }

    modifier onlyInactiveProposal(uint256 _proposalId) {
        require(targetProposal.deadline < block.timestamp, "Proposal active");
        _;
    }

    function createProposal(/**token purchase information */) onlyNFTHolder external returns (uint256) {

    }

    function voteOnProposal(uint256 _proposalId, bool _vote) onlyActiveProposal onlyNFTHolder external;
    function executeProposal(uint256 _proposalId) onlyInactiveProposal onlyNFTHolder external;
}