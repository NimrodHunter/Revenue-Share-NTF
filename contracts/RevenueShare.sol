// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Base64.sol";

//solhint-disable-line
contract RevenueShare is ERC721, ReentrancyGuard {
    using Address for address;

    //Max Loked Period;
    uint32 internal constant MAX_LOKED_TIME = 60 * 60 * 24 * 365; // 1 year

    //Min Locked Period;
    uint32 internal constant MIN_LOKED_TIME = 60 * 60 * 24 * 7; // 1 week

    //ERC20 Project Token
    address public _projectToken;

    //ERC20 Reward Token
    address public _rewardToken;

    struct RSToken {
        uint64 created;
        uint64 locked;
        uint128 amount;
        
    }

    // token id ==> token parameters
    mapping(uint256 => RSToken) public revToken; 

    // token id as counter
    uint256 public rsId;

    constructor(string memory name_, string memory symbol_, address projectToken_, address rewardToken_)
        ERC721(name_, symbol_)
    {
        require(bytes(name_).length > 0, "should have a name");
        require(bytes(symbol_).length > 0, "should have a symbol");
        require(projectToken_ != address(0), "should have a valid token address");
        require(rewardToken_ != address(0), "should have a valid token address");
        _projectToken = projectToken_;
        _rewardToken = rewardToken_;
    }

    function stake(uint128 amount, uint128 lock) public virtual nonReentrant returns (bool) {
        require(amount > 0, "you should send something");
        uint64 lockedTime = uint32(lock)*MIN_LOKED_TIME;
        require(lockedTime <= MAX_LOKED_TIME, "you should lock less than 1 year");
        require(IERC20(_projectToken).allowance(msg.sender, address(this)) >= uint256(amount), "token not allowed");
        require(_transferFrom(msg.sender, amount), "transfer from fails");
        uint256 id = ++rsId;
        _safeMint(msg.sender, id, "new revenue share token");
        revToken[id] = RSToken({created: uint64(block.timestamp), locked: uint64(lockedTime), amount: amount});
        return true;
    }

    function withdraw(uint256 tokenId) public virtual nonReentrant returns (bool) {
        require(ownerOf(tokenId) == msg.sender, "you are not the owner of the token");
        RSToken memory rs = revToken[tokenId];
        uint256 lockedTime = uint256(rs.created + rs.locked);
        require(block.timestamp >= lockedTime, "your token it is locked");
        _burn(tokenId);
        delete revToken[tokenId];
        require(_safeTransferToken(msg.sender, uint256(rs.amount)), "transfer reward token fail");
        return true;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        RSToken memory rs = revToken[tokenId];
        return
        _tokenURI(
            tokenId,
            rs.amount,
            rs.created,
            rs.locked
        );
    }

    function _tokenURI(uint256 _tokenId, uint128 _amount, uint64 _created, uint64 _locked) internal pure returns (string memory output) {
        output = '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350"><style>.base { fill: white; font-family: serif; font-size: 14px; }</style><rect width="100%" height="100%" fill="black" /><text x="10" y="20" class="base">';
        output = string(abi.encodePacked(output, "token ", toString(_tokenId), '</text><text x="10" y="40" class="base">'));
        output = string(abi.encodePacked(output, "amount ", toString(uint256(_amount)), '</text><text x="10" y="60" class="base">'));
        output = string(abi.encodePacked(output, "created_time ", toString(uint256(_created)), '</text><text x="10" y="80" class="base">'));
        output = string(abi.encodePacked(output, "locked_time ", toString(uint256(_locked)), '</text></svg>'));

        string memory json = Base64.encode(bytes(string(abi.encodePacked('{"name": "lock #', toString(_tokenId), '", "description": "NFT Revenue share, can be used to receive passive income", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));
        output = string(abi.encodePacked('data:application/json;base64,', json));
    }

    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT license
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function _transferFrom(address from, uint256 amount) internal virtual returns (bool) {
        require(from != address(0), "must be valid address");
        require(amount > 0, "you must send something");
        SafeERC20.safeTransferFrom(IERC20(_projectToken), from, address(this), amount);
        return true;
    }

     function _safeTransferToken(address to, uint256 amount) internal virtual returns (bool) {
        require(to != address(0), "must be valid address");
        require(amount > 0, "you must send something");
        SafeERC20.safeTransfer(IERC20(_rewardToken), to, amount);
        return true;
    }

} 