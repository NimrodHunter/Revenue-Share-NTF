// SPDX-License-Identifier: UNLICENSED
// Copyright (c) 2022 Crypto Barter - All rights reserved
// cryptobarter.io
// @title RevenueClaim
// @notice Provides functions to claim reward with a merkle tree pattern.
// @author Anibal Catalan <anibalcatalanf@gmail.com>

pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

//solhint-disable-line
contract RevenueClaim is ReentrancyGuard {

    bool private initialized;
    address private NFT;
    bytes32 private root;
    address public rewardToken;
    
    mapping(address => mapping(uint256 => bool)) private claimed;

    constructor() {}

    // Initializer
    function initialize(address NFT_, address rewardToken_, uint256 amount, bytes32 root_) external {   
        require(!initialized, "already initialized");
        require(root_[0] != 0, "empty root");
        require(rewardToken != address(0), "reward token should not be 0");
        require(amount > 0, "amount should be greater than 0");
        require(IERC20(rewardToken).balanceOf(address(this)) == amount, "out of funds");
        NFT = NFT_;
        rewardToken = rewardToken_;
        root = root_;
        initialized = !initialized;
    }

    // Main Function

    function claim(uint256 tokenId, uint256 amount, bytes32[] memory merkleProof) external virtual nonReentrant {  
        require(initialized, "contract should be initialized");
        require(IERC721(NFT).ownerOf(tokenId) == msg.sender, "your are not the owner of ERC721");
        require(!claimed[msg.sender][tokenId], "reward alrready claimed");
        require(_verifyClaim(msg.sender, tokenId, amount, merkleProof), "merkle proof fail");
        require(_transferToken(msg.sender, amount), "reward transfer fail");
        claimed[msg.sender][tokenId] = true;
        emit Claimed(msg.sender, tokenId, amount);
    }

    // Internal Functions
    function _transferToken(address to, uint256 amount) internal virtual returns (bool) {
        require(to != address(0), "must be valid address");
        require(amount > 0, "you must send something");
        SafeERC20.safeTransfer(IERC20(rewardToken), to, amount);
        return true;
    }

    function _verifyClaim(address claimer, uint256 tokenId, uint256 amount, bytes32[] memory _merkleProof) private view returns (bool) {
        bytes32 leaf = keccak256(abi.encodePacked(claimer, tokenId, amount));
        return MerkleProof.verify(_merkleProof, root, leaf);
    }

    // Events

    event Claimed(address indexed claimer, uint256 indexed NFTId, uint256 indexed amount);

} 