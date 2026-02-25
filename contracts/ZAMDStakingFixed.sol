// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title ZAMDStaking
 * @dev Fixed version for 6-decimal tokens (like ZAMD)
 * Features:
 * - 14-day strict lock period
 * - 18% APY
 * - Reward pool model
 * - Emergency functions
 * - Reentrancy protection
 */
contract ZAMDStaking is ReentrancyGuard, Ownable, Pausable {
    using SafeERC20 for IERC20;

    // Token contracts
    IERC20 public stakingToken;
    IERC20 public rewardToken;
    
    // Staking parameters
    uint256 public constant APY = 1800;           // 18% in basis points
    uint256 public constant LOCK_PERIOD = 14 days;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    uint256 public constant MIN_STAKE_AMOUNT = 25 * 10**6; // 25 ZAMD (6 decimals)
    
    // Reward pool
    uint256 public rewardPoolBalance;
    uint256 public totalStaked;
    uint256 public totalRewardsClaimed;
    
    // User stakes
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
    
    struct StakeInfo {
        uint256 stakedAmount;
        uint256 lastClaimTime;
        uint256 totalEarned;
        uint256 lockEndTime;
    }

    modifier whenNotEmergency() {
        require(!emergencyMode, "Emergency mode is active");
        _;
    }
    
    modifier canWithdraw(address _user) {
        require(stakes[_user].stakedAmount > 0, "No staked amount");
        require(block.timestamp >= stakes[_user].lockEndTime, "Stake is locked");
        _;
    }

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

    function calculatePendingReward(address _user) public view returns (uint256) {
        StakeInfo storage stakeInfo = stakes[_user];
        
        if (stakeInfo.stakedAmount == 0) {
            return 0;
        }
        
        uint256 timeStaked = block.timestamp - stakeInfo.lastClaimTime;
        uint256 pending = (stakeInfo.stakedAmount * APY * timeStaked) / (BASIS_POINTS * SECONDS_PER_YEAR);
        
        return pending;
    }
    
    function stake(uint256 _amount) 
        external 
        whenNotPaused 
        whenNotEmergency 
        nonReentrant 
    {
        require(_amount >= MIN_STAKE_AMOUNT, "Amount below minimum");
        require(_amount > 0, "Cannot stake 0");
        
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        StakeInfo storage stakeInfo = stakes[msg.sender];
        
        uint256 previousAmount = stakeInfo.stakedAmount;
        uint256 newAmount = previousAmount + _amount;
        
        stakeInfo.stakedAmount = newAmount;
        
        if (previousAmount == 0) {
            stakeInfo.lastClaimTime = block.timestamp;
            stakeInfo.lockEndTime = block.timestamp + LOCK_PERIOD;
        }
        
        totalStaked += _amount;
        
        emit Staked(msg.sender, _amount, stakeInfo.lockEndTime);
    }
    
    function withdraw() 
        external 
        whenNotPaused 
        nonReentrant 
        canWithdraw(msg.sender) 
    {
        StakeInfo storage stakeInfo = stakes[msg.sender];
        
        uint256 amount = stakeInfo.stakedAmount;
        uint256 pending = calculatePendingReward(msg.sender);
        
        stakeInfo.stakedAmount = 0;
        stakeInfo.totalEarned += pending;
        stakeInfo.lastClaimTime = block.timestamp;
        
        totalStaked -= amount;
        
        stakingToken.safeTransfer(msg.sender, amount);
        
        if (pending > 0) {
            require(rewardPoolBalance >= pending, "Insufficient reward pool");
            rewardPoolBalance -= pending;
            totalRewardsClaimed += pending;
            
            rewardToken.safeTransfer(msg.sender, pending);
            emit RewardClaimed(msg.sender, pending);
        }
        
        emit Withdrawn(msg.sender, amount, pending);
    }
    
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
        
        stakeInfo.lastClaimTime = block.timestamp;
        stakeInfo.lockEndTime = block.timestamp + LOCK_PERIOD;
        
        rewardPoolBalance -= pending;
        totalRewardsClaimed += pending;
        stakeInfo.totalEarned += pending;
        
        rewardToken.safeTransfer(msg.sender, pending);
        
        emit RewardClaimed(msg.sender, pending);
    }
    
    function addStake(uint256 _amount)
        external
        whenNotPaused
        whenNotEmergency
        nonReentrant
    {
        require(_amount > 0, "Cannot add 0");
        
        StakeInfo storage stakeInfo = stakes[msg.sender];
        require(stakeInfo.stakedAmount > 0, "No existing stake");
        
        uint256 pending = calculatePendingReward(msg.sender);
        
        if (pending > 0) {
            require(rewardPoolBalance >= pending, "Insufficient reward pool for pending rewards");
            rewardPoolBalance -= pending;
            totalRewardsClaimed += pending;
            stakeInfo.totalEarned += pending;
            
            rewardToken.safeTransfer(msg.sender, pending);
            emit RewardClaimed(msg.sender, pending);
        }
        
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        stakeInfo.stakedAmount += _amount;
        stakeInfo.lastClaimTime = block.timestamp;
        stakeInfo.lockEndTime = block.timestamp + LOCK_PERIOD;
        
        totalStaked += _amount;
        
        emit Staked(msg.sender, _amount, stakeInfo.lockEndTime);
    }

    // ============ OWNER FUNCTIONS ============

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
    
    function emergencyWithdraw(uint256 _amount) 
        external 
        onlyOwner 
    {
        require(_amount > 0 && _amount <= rewardPoolBalance, "Invalid amount");
        
        rewardPoolBalance -= _amount;
        rewardToken.safeTransfer(msg.sender, _amount);
    }
    
    function toggleEmergencyMode() 
        external 
        onlyOwner 
    {
        emergencyMode = !emergencyMode;
        emit EmergencyModeToggled(emergencyMode);
    }
    
    function pause() 
        external 
        onlyOwner 
    {
        _pause();
    }
    
    function unpause() 
        external 
        onlyOwner 
    {
        _unpause();
    }
    
    function withdrawStuckToken(address _token, uint256 _amount) 
        external 
        onlyOwner 
    {
        require(_token != address(stakingToken), "Cannot withdraw staking token");
        require(_token != address(rewardToken), "Cannot withdraw reward token");
        
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }

    // ============ VIEW FUNCTIONS ============

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
            APY / 100,
            LOCK_PERIOD,
            MIN_STAKE_AMOUNT,
            emergencyMode
        );
    }
    
    function getPotentialLiability() external view returns (uint256) {
        if (totalStaked == 0) return 0;
        
        uint256 maxAnnualReward = (totalStaked * APY) / BASIS_POINTS;
        
        return maxAnnualReward;
    }
    
    function isRewardPoolSufficient() external view returns (bool) {
        if (totalStaked == 0) return true;
        
        uint256 maxAnnualReward = (totalStaked * APY) / BASIS_POINTS;
        return rewardPoolBalance >= maxAnnualReward;
    }
}
