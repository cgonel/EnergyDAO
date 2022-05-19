// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

import "./INFTCollection.sol";

contract DAO {
    INFTCollection nftContract;

    struct Proposal {
        string ipfsHash;
        uint64 deadline;
        uint8 yes;
        uint8 no;
        bool executed;
        mapping(uint256=>bool) voters;
    }

    mapping(uint256=>Proposal) proposals;
    uint256 numOfProposals;
 
    enum Votes {
        no,
        yes
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

    function createProposal(string memory _ipfsHash) external onlyNFTHolder returns (uint256) {
        // set ipfs hash
        // set deadline 
        // associate id to proposal
        // increase number of proposals
        // return index of proposal
    }

    function getTokenId(uint256 _proposalId) internal returns (uint256) {
        // get proposal information
        Proposal storage currentProposal = proposals[_proposalId];
        // how many tokens user owns
        uint nftOwned = nftContract.balanceOf(msg.sender);
        uint tokenId;
        // return first token not used for voting
        for(uint i = 0; i < nftOwned; i++ ) {
            tokenId = nftContract.tokenOfOwnerByIndex(msg.sender, i);
            if (!currentProposal.voters[tokenId]) {
                return tokenId
            }
        }
        // if user has no token left to vote
        return 0;
    }

    function voteOnProposal(uint256 _proposalId, uint8 _vote) external onlyActiveProposal onlyNFTHolder {
        assert(_vote == 0 || _vote == 1);
        uint256 tokenId = getTokenId(_proposalId);
        require(tokenId != 0, "No more votes left");
        
        // add vote to proposal
        Proposal storage currentProposal = proposals[_proposalId];
        if(_vote == 1) {
            currentProposal.yes++;
        } else {
            currentProposal.no++;
        }

        // set token id as used for voting
        currentProposal.voters[tokenId] = true;
    }

    function computeProposalVotes(uint256 _proposalId) external onlyInactiveProposal onlyNFTHolder;
}