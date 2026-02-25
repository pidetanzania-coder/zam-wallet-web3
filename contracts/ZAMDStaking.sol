// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ZAMDStaking
 * @dev High-security staking contract for ZAMD token on Polygon
 * Features:
 * - 14-day strict lock period (no request system)
 * - 24% APY (2% per month)
 * - Reward pool model (no minting)
 * - Emergency withdraw functionality
 * - Reentrancy protection
 * - Owner controls
 */
contract ZAMDStaking is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    // ============ STATE VARIABLES ============
    
    // Token contracts
    IERC20 public stakingToken;    // ZAMD token
    IERC20 public rewardToken;     // Can be ZAMD or another reward token
    
    // Staking parameters
    uint256 public constant APY = 1800;           // 18% in basis points (1800 / 100 = 18%)
    uint256 public constant LOCK_PERIOD = 14 days;
    uint256 public constant BASIS_POINTS = 10000;   // For percentage calculation
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    uint256 public constant MIN_STAKE_AMOUNT = 25 * 10**6; // 25 ZAMD (6 decimals)
    
    // Reward pool
    uint256 public rewardPoolBalance;
    uint256 public totalStaked;
    uint256 public totalRewardsClaimed;
    
    // User stakes - Strict 14-day lock
    mapping(address => StakeInfo) public stakes;
    
    // Contract state
    bool public emergencyMode;
    
    // Events
    event Staked(address indexed user, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed user, uint256 amount, uint256 reward);
    event RewardClaimed(address indexed user, uint256 reward);
    event RewardPoolAdded(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);
    event EmergencyModeToggled(bool enabled);
    
    // ============ DATA STRUCTURES ============
    
    struct StakeInfo {
        uint256 stakedAmount;      // Amount staked
        uint256 lastClaimTime;     // Last time rewards were claimed
        uint256 totalEarned;      // Total rewards earned
        uint256 lockEndTime;      // When the stake unlocks (stakeTime + 14 days)
    }

    // ============ MODIFIERS ============
    
    modifier whenNotEmergency() {
        require(!emergencyMode, "Emergency mode is active");
        _;
    }
    
    modifier canWithdraw(address _user) {
        require(stakes[_user].stakedAmount > 0, "No staked amount");
        require(block.timestamp >= stakes[_user].lockEndTime, "Stake is locked");
        _;
    }

    // ============ CONSTRUCTOR ============
    
    /**
     * @dev Constructor
     * @param _stakingToken Address of ZAMD token
     * @param _rewardToken Address of reward token (can be same as staking)
     * @param _owner Owner address for ownership
     */
    constructor(
        address _stakingToken,
        address _rewardToken,
        address _owner
    ) Ownable(_owner) {
        require(_stakingToken != address(0), "Invalid staking token");
        require(_rewardToken != address(0), "Invalid reward token");
        
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }

    // ============ STAKING FUNCTIONS ============
    
    /**
     * @dev Calculate pending rewards for a user
     * @param _user User address
     * @return Pending rewards based on 24% APY
     */
    function calculatePendingReward(address _user) public view returns (uint256) {
        StakeInfo storage stakeInfo = stakes[_user];
        
        if (stakeInfo.stakedAmount == 0) {
            return 0;
        }
        
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        
        // Simple APY formula: reward = (stakedAmount * APY * timeElapsed) / (BASIS_POINTS * SECONDS_PER_YEAR)
        uint256 pending = (stakeInfo.stakedAmount * APY * timeStaked) / (BASIS_POINTS * SECONDS_PER_YEAR);
        
        return pending;
    }
    
    /**
     * @dev Stake ZAMD tokens
     * - Tokens are automatically locked for 14 days
     * - Rewards keep accumulating (not auto-claimed)
     * @param _amount Amount to stake
     */
    function stake(uint256 _amount) 
        external 
        whenNotPaused 
        whenNotEmergency 
        nonReentrant 
    {
        require(_amount >= MIN_STAKE_AMOUNT, "Amount below minimum");
        require(_amount > 0, "Cannot stake 0");
        
        // Transfer tokens from user
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        // Update stake info
        StakeInfo storage stakeInfo = stakes[msg.sender];
        
        uint256 previousAmount = stakeInfo.stakedAmount;
        uint256 newAmount = previousAmount + _amount;
        
        // If adding to existing stake:
        // - Keep previous lockEndTime (extend doesn't reset)
        // - Don't auto-claim rewards (keeps them pending)
        
        stakeInfo.stakedAmount = newAmount;
        
        // First stake? Set lock time
        if (previousAmount == 0) {
            stakeInfo.lastClaimTime = block.timestamp;
            stakeInfo.lockEndTime = block.timestamp + LOCK_PERIOD;
        }
        
        totalStaked += _amount;
        
        emit Staked(msg.sender, _amount, stakeInfo.lockEndTime);
    }
    
    /**
     * @dev Withdraw staked tokens after 14-day lock
     * - Claims pending rewards automatically
     * - Transfers principal + rewards
     * - User can also keep staking after 14 days!
     */
    function withdraw() 
        external 
        whenNotPaused 
        nonReentrant 
        canWithdraw(msg.sender) 
    {
        StakeInfo storage stakeInfo = stakes[msg.sender];
        
        uint256 amount = stakeInfo.stakedAmount;
        uint256 pending = calculatePendingReward(msg.sender);
        
        // Reset stake info
        stakeInfo.stakedAmount = 0;
        stakeInfo.totalEarned += pending;  // Add pending to totalEarned
        stakeInfo.lastClaimTime = block.timestamp;
        
        totalStaked -= amount;
        
        // Transfer principal
        stakingToken.safeTransfer(msg.sender, amount);
        
        // Transfer rewards if available
        if (pending > 0) {
            require(rewardPoolBalance >= pending, "Insufficient reward pool");
            rewardPoolBalance -= pending;
            totalRewardsClaimed += pending;
            // NOTE: totalEarned already updated above, don't add again
            
            rewardToken.safeTransfer(msg.sender, pending);
            emit RewardClaimed(msg.sender, pending);
        }
        
        emit Withdrawn(msg.sender, amount, pending);
    }
    
    /**
     * @dev Claim pending rewards WITHOUT withdrawing
     * - Keeps your staked money locked for another 14 days
     * - You continue earning 24% APY!
     * - This is what most users will do after 14 days
     */
    function claimRewardAndExtend() 
        external 
        whenNotPaused 
        whenNotEmergency 
        nonReentrant 
    {
        StakeInfo storage stakeInfo = stakes[msg.sender];
        
        require(stakeInfo.stakedAmount > 0, "No staked amount");
        
        uint256 pending = calculatePendingReward(msg.sender);
        require(pending > 0, "No rewards to claim");
        require(rewardPoolBalance >= pending, "Insufficient reward pool");
        
        // Reset claim time but KEEP the stake (extend lock)
        stakeInfo.lastClaimTime = block.timestamp;
        
        // Extend lock period for another 14 days
        stakeInfo.lockEndTime = block.timestamp + LOCK_PERIOD;
        
        // Transfer rewards
        rewardPoolBalance -= pending;
        totalRewardsClaimed += pending;
        stakeInfo.totalEarned += pending;
        
        rewardToken.safeTransfer(msg.sender, pending);
        
        emit RewardClaimed(msg.sender, pending);
    }
    
    /**
     * @dev Add more stake (top-up)
     * - Adds to existing stake
     * - Claims pending rewards (or reverts if pool insufficient)
     * - Lock period ALWAYS resets to 14 days from now (strict model)
     * @param _amount Amount to add
     */
    function addStake(uint256 _amount)
        external
        whenNotPaused
        whenNotEmergency
        nonReentrant
    {
        require(_amount > 0, "Cannot add 0");
        
        StakeInfo storage stakeInfo = stakes[msg.sender];
        require(stakeInfo.stakedAmount > 0, "No existing stake");
        
        // Calculate pending rewards first
        uint256 pending = calculatePendingReward(msg.sender);
        
        // Must claim pending rewards first (strict - revert if pool insufficient)
        if (pending > 0) {
            require(rewardPoolBalance >= pending, "Insufficient reward pool for pending rewards");
            rewardPoolBalance -= pending;
            totalRewardsClaimed += pending;
            stakeInfo.totalEarned += pending;
            
            rewardToken.safeTransfer(msg.sender, pending);
            emit RewardClaimed(msg.sender, pending);
        }
        
        // Transfer new stake tokens
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        // Add to stake AND reset lock period
        stakeInfo.stakedAmount += _amount;
        stakeInfo.lastClaimTime = block.timestamp;
        stakeInfo.lockEndTime = block.timestamp + LOCK_PERIOD;  // Reset 14-day lock
        
        totalStaked += _amount;
        
        emit Staked(msg.sender, _amount, stakeInfo.lockEndTime);
    }

    // ============ OWNER FUNCTIONS ============
    
    /**
     * @dev Add rewards to the pool
     */
    function addRewardPool(uint256 _amount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        require(_amount > 0, "Amount must be > 0");
        
        rewardToken.safeTransferFrom(msg.sender, address(this), _amount);
        rewardPoolBalance += _amount;
        
        emit RewardPoolAdded(msg.sender, _amount);
    }
    
    /**
     * @dev Emergency withdraw - only owner can trigger
     */
    function emergencyWithdraw(uint256 _amount) 
        external 
        onlyOwner 
    {
        require(_amount > 0 && _amount <= rewardPoolBalance, "Invalid amount");
        
        rewardPoolBalance -= _amount;
        rewardToken.safeTransfer(msg.sender, _amount);
    }
    
    /**
     * @dev Toggle emergency mode
     */
    function toggleEmergencyMode() 
        external 
        onlyOwner 
    {
        emergencyMode = !emergencyMode;
        emit EmergencyModeToggled(emergencyMode);
    }
    
    /**
     * @dev Pause contract
     */
    function pause() 
        external 
        onlyOwner 
    {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() 
        external 
        onlyOwner 
    {
        _unpause();
    }
    
    /**
     * @dev Withdraw stuck tokens
     */
    function withdrawStuckToken(address _token, uint256 _amount) 
        external 
        onlyOwner 
    {
        require(_token != address(stakingToken), "Cannot withdraw staking token");
        require(_token != address(rewardToken), "Cannot withdraw reward token");
        
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }

    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get stake info for a user
     */
    function getStakeInfo(address _user) external view returns (
        uint256 stakedAmount,
        uint256 pendingReward,
        uint256 totalEarned,
        uint256 lockEndTime,
        uint256 secondsUntilUnlock,
        bool canWithdraw_
    ) {
        StakeInfo storage stakeInfo = stakes[_user];
        
        return (
            stakeInfo.stakedAmount,
            calculatePendingReward(_user),
            stakeInfo.totalEarned,
            stakeInfo.lockEndTime,
            stakeInfo.lockEndTime > block.timestamp ? stakeInfo.lockEndTime - block.timestamp : 0,
            stakeInfo.stakedAmount > 0 && block.timestamp >= stakeInfo.lockEndTime
        );
    }
    
    /**
     * @dev Get contract stats
     */
    function getContractStats() external view returns (
        uint256 _totalStaked,
        uint256 _rewardPoolBalance,
        uint256 _totalRewardsClaimed,
        uint256 _apy,
        uint256 _lockPeriod,
        uint256 _minStake,
        bool _emergencyMode
    ) {
        return (
            totalStaked,
            rewardPoolBalance,
            totalRewardsClaimed,
            APY / 100,  // Return actual APY percentage (18)
            LOCK_PERIOD,
            MIN_STAKE_AMOUNT,
            emergencyMode
        );
    }
    
    /**
     * @dev Calculate total potential liability (max rewards that could be claimed)
     * This helps the owner monitor if reward pool is sufficient
     * @return Potential liability in ZAMD (max annual reward)
     */
    function getPotentialLiability() external view returns (uint256) {
        if (totalStaked == 0) return 0;
        
        // Calculate max possible reward (if everyone stakes for full year)
        uint256 maxAnnualReward = (totalStaked * APY) / BASIS_POINTS;
        
        return maxAnnualReward;
    }
    
    /**
     * @dev Check if reward pool is sufficient for potential liabilities
     * @return true if pool can cover potential annual rewards
     */
    function isRewardPoolSufficient() external view returns (bool) {
        if (totalStaked == 0) return true;
        
        uint256 maxAnnualReward = (totalStaked * APY) / BASIS_POINTS;
        return rewardPoolBalance >= maxAnnualReward;
    }
}
