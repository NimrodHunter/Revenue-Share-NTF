// SPDX-License-Identifier: UNLICENSED
// Copyright (c) 2022 Crypto Barter - All rights reserved
// cryptobarter.io
// @title StakedShareFactory
// @notice Provides functions to create a copy of  StakedShare contract
// @author Anibal Catalan <anibalcatalanf@gmail.com>

pragma solidity >=0.8.4;

import "./Clones.sol";
import "./StakedShare.sol";
import "./FeesOracle.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//solhint-disable-line
contract StakedShareFactory is Ownable, ReentrancyGuard {

    uint32 internal revenueProjects;
    address internal cryptobarter;
    address internal feeOracle;
    mapping(uint256 => address) internal projects;

    constructor(address cryptobarter_, address feeOracle_) Ownable() {
        require(cryptobarter_ != address(0), "cryptobarter address should not be 0");
        require(feeOracle_ != address(0), "feeOracle address should not be 0");
        cryptobarter = cryptobarter_;
        feeOracle = feeOracle_;
    }

    // Main Function

    function stakedShare(
        address implementation
        , address projectToken
        , string memory name
        , string memory symbol
        , string memory logo
    ) external virtual payable nonReentrant onlyOwner
    {
        require(implementation != address(0) && projectToken != address(0), "should not be address 0");
        require(msg.value >= FeesOracle(feeOracle).deployStakedFee(), "invalid fee");
        require(_safeTransferEth(msg.value), "transfer fee fails");
        address clone = Clones.clone(implementation);
        StakedShare(clone).initialize(projectToken, name, symbol, logo);
        revenueProjects += 1;
        projects[revenueProjects] = clone; 
        emit Cloned(clone, projectToken);
    }

    receive() external payable {
        revert("directly eth transfers are not allowed");
    }

    fallback() external payable {
        revert("directly eth transfers are not allowed");
    }

    // Getters
    function numberOfProjects() external view virtual returns (uint32) {
        return revenueProjects;
    }

    function projectAddress(uint256 id) external view virtual returns (address) {
        return projects[id];
    }

    // Internal Functions
    function _safeTransferEth(uint256 amount) internal virtual returns (bool) {
        (bool sent, ) = cryptobarter.call{value: amount}("");
        return sent;
    }

    // Event
    event Cloned(address indexed clone, address indexed projectToken);
}