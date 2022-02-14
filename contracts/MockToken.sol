// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//solhint-disable-line
contract MockToken is ERC20 {

    constructor(uint256 initialSupply_) ERC20("Mock Token", "MT")
    {
        require(initialSupply_ > 0, "some tokens must be minted");
        _mint(msg.sender, initialSupply_);
    }
} 