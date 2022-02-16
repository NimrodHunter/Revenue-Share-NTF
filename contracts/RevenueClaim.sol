// SPDX-License-Identifier: MIT
// @title StakedShare
// @notice Provides functions to claim passive income through an NFT
// @author Anibal Catalan <anibalcatalanf@gmail.com>

pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//solhint-disable-line
contract RevenueClaim is ReentrancyGuard {

    constructor()
    {
        require(initialSupply_ > 0, "some tokens must be minted");
        _mint(msg.sender, initialSupply_);
    }
} 