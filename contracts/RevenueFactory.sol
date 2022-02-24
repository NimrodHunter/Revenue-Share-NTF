// SPDX-License-Identifier: UNLICENSED
// Copyright (c) 2022 Crypto Barter - All rights reserved
// cryptobarter.io
// @title RevenueFactory
// @notice Provides functions to create a copy of  Revenue Claim contract
// @author Anibal Catalan <anibalcatalanf@gmail.com>

pragma solidity >=0.8.4;

import "./Clones.sol";
import "./RevenueClaim.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//solhint-disable-line
contract RevenueFactory is Ownable, ReentrancyGuard {

    constructor() Ownable() {}

    // Main Function

    function revenueShare(address implementation, address NFT, address rewardToken, uint256 amount, bytes32 root_) external virtual nonReentrant onlyOwner {
        require(root_[0] != 0, "empty root");
        require(rewardToken != address(0), "reward token should not be 0");
        require(amount > 0, "amount should be greater than 0");
        address clone = Clones.clone(implementation);
        _transferFrom(rewardToken, clone, amount); 
        RevenueClaim(clone).initialize(NFT, rewardToken, amount, root_);
        emit Cloned(clone, rewardToken, amount);
    }

    // Internal Functions
    function _transferFrom(address token, address to, uint256 amount) internal virtual returns (bool) {
        require(to != address(0), "must be valid address");
        require(amount > 0, "you must send something");
        SafeERC20.safeTransferFrom(IERC20(token), owner(), to, amount);
        return true;
    }

    // Event
    event Cloned(address indexed clone, address indexed rewardToken, uint256 indexed amount);
} 