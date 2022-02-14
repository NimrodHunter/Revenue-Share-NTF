// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

//solhint-disable-line
contract RevenueShare is ERC721 {
    using Address for address;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    //ERC20 Project Token
    address private _projectToken;

    //ERC20 Reward Token
    address private _rewardToken;

    //Revenue Period;
    uint32 public _period;


    constructor(string memory name_, string memory symbol_, address projectToken_, uint32 period_)
    {
        require(bytes(name_).length > 0, "should have a name");
        require(bytes(symbol_).length > 0, "should have a symbol");
        require(token_ != address(0), "should have a token address");
        _name = name_;
        _symbol = _symbol;
        _projectToken = token_;
    }

    function stake(uint128 amount, uint) public virtual nonReentrant returns (bool) {
        require(amount > 0, "you must send something");
        require(token != address(0), "token address should not be 0");
        require(allowedToken(token), "token not allowed");
        require(_transferFrom(msg.sender, token, amount), "transfer from fails");
        _mint(msg.sender, mintedAmount(token, amount));
        emit Deposited(msg.sender, token, amount);
        return true;
    }

} 