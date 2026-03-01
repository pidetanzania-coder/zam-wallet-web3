// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ZAMDToken
 * @dev ZAMD Token with mint and burn capabilities (6 decimals)
 * 
 * Features:
 * - Mint: Only owner can mint new tokens
 * - Burn: Anyone can burn their own tokens  
 * - Pausable: Owner can pause/unpause transfers
 * - Blacklist: Owner can blacklist addresses
 * - 6 Decimals: Like USDT/USDC
 * - SafeERC20: Secure token transfers
 * - Immutable Cap: Maximum supply cannot be changed
 */
contract ZAMDToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {

    using SafeERC20 for IERC20;
    
    /// @notice Maximum token supply (immutable - cannot be changed)
    uint256 public immutable cap;
    
    /// @notice Blacklist mapping
    mapping(address => bool) private _blacklist;

    /// @notice Emitted when tokens are minted
    event Mint(address indexed to, uint256 amount);
    
    /// @notice Emitted when tokens are burned
    event Burn(address indexed from, uint256 amount);
    
    /// @notice Emitted when blacklist is updated
    event BlacklistUpdated(address indexed account, bool isBlacklisted);

    /**
     * @dev Constructor
     * @param initialOwner The address that will own the contract
     * @param initialSupply Initial token supply (e.g., 50000000 * 10^6 for 50M tokens)
     * @param cap_ Maximum token supply (immutable)
     */
    constructor(
        address initialOwner,
        uint256 initialSupply,
        uint256 cap_
    ) ERC20("Zam Dollar", "ZAMD") Ownable(initialOwner) {
        require(cap_ > 0, "ZAMDToken: cap is 0");
        require(initialSupply <= cap_, "ZAMDToken: initialSupply exceeds cap");
        
        cap = cap_; // Immutable - set once, cannot be changed
        
        // Mint initial supply to owner
        _mint(initialOwner, initialSupply);
    }

    /**
     * @dev Returns 6 decimals (like USDT/USDC)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @dev Returns the cap on the total supply.
     */
    function tokenCap() public view returns (uint256) {
        return cap;
    }

    /**
     * @dev Mint new tokens (only owner)
     * @param to Address to receive tokens
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) public onlyOwner whenNotPaused {
        require(to != address(0), "ZAMDToken: mint to the zero address");
        require(totalSupply() + amount <= cap, "ZAMDToken: cap exceeded");
        
        _mint(to, amount);
        emit Mint(to, amount);
    }

    /**
     * @dev Burn tokens (anyone can burn their own tokens)
     * @param amount Amount to burn
     */
    function burn(uint256 amount) public override whenNotPaused {
        require(amount > 0, "ZAMDToken: burn amount is 0");
        super.burn(amount);
        emit Burn(_msgSender(), amount);
    }

    /**
     * @dev Burn tokens from a specific address (with approval)
     * @param from Address to burn from
     * @param amount Amount to burn
     */
    function burnFrom(address from, uint256 amount) public override whenNotPaused {
        require(amount > 0, "ZAMDToken: burn amount is 0");
        super.burnFrom(from, amount);
        emit Burn(from, amount);
    }

    /**
     * @dev Pause all transfers (only owner)
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause all transfers (only owner)
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Add to blacklist (only owner)
     * @param account Address to blacklist
     */
    function addBlacklist(address account) public onlyOwner {
        require(account != owner(), "ZAMDToken: cannot blacklist owner");
        _blacklist[account] = true;
        emit BlacklistUpdated(account, true);
    }

    /**
     * @dev Remove from blacklist (only owner)
     * @param account Address to remove from blacklist
     */
    function removeBlacklist(address account) public onlyOwner {
        _blacklist[account] = false;
        emit BlacklistUpdated(account, false);
    }

    /**
     * @dev Check if address is blacklisted
     * @param account Address to check
     */
    function isBlacklisted(address account) public view returns (bool) {
        return _blacklist[account];
    }

    /**
     * @dev Hook that is called during any token transfer
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Pausable) {
        require(!paused() || from == owner() || to == owner(), "Transfers paused");
        require(!_blacklist[from] && !_blacklist[to], "Blacklisted address");
        
        super._update(from, to, amount);
    }

    /**
     * @dev Withdraw accidentally sent tokens (only owner)
     * Cannot withdraw ZAMD itself
     * @param token Token address to withdraw
     * @param amount Amount to withdraw
     */
    function withdrawToken(address token, uint256 amount) public onlyOwner {
        require(token != address(0), "ZAMDToken: invalid token address");
        require(token != address(this), "ZAMDToken: cannot withdraw ZAMD itself");
        
        IERC20(token).safeTransfer(owner(), amount);
    }

    /**
     * @dev Withdraw accidentally sent ETH (only owner)
     */
    function withdrawETH() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "ETH transfer failed");
    }

    /**
     * @dev Receive ETH deposits
     */
    receive() external payable {}
}
