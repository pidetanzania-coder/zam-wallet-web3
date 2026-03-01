// Contract addresses for Zam Wallet

export const CONTRACTS = {
  // ZAMD Staking Contract (Polygon)
  staking: {
    address: "0x1341ecc1e7Ed78eB7F1B052CB6a56903BC53AbdC",
    abi: [
      // Stake tokens
      "function stake(uint256 _amount) external",
      // Withdraw after lock period
      "function withdraw() external",
      // Claim rewards without withdrawing
      "function claimRewardAndExtend() external",
      // Add more to existing stake
      "function addStake(uint256 _amount) external",
      // Add reward pool (owner only)
      "function addRewardPool(uint256 _amount) external",
      // Get stake info
      "function getStakeInfo(address _user) external view returns (uint256, uint256, uint256, uint256, uint256, bool)",
      // Get contract stats
      "function getContractStats() external view returns (uint256, uint256, uint256, uint256, uint256, uint256, bool)",
      // Calculate pending reward
      "function calculatePendingReward(address _user) external view returns (uint256)",
      // Check if can withdraw
      "function stakes(address) external view returns (uint256 stakedAmount, uint256 lastClaimTime, uint256 totalEarned, uint256 lockEndTime)",
      // Pool balance
      "function rewardPoolBalance() external view returns (uint256)",
      // Total staked
      "function totalStaked() external view returns (uint256)",
      // Pause/Unpause
      "function pause() external",
      "function unpause() external",
      // Emergency
      "function emergencyWithdraw(uint256 _amount) external",
      "function emergencyMode() external view returns (bool)",
    ],
  },
  // ZAMD Token (Polygon)
  zamdToken: {
    address: "0x0A46e040e135b967F501Bb46ad27375c8c979268",
    decimals: 6,
    symbol: "ZAMD",
    name: "Zam Dollar",
  },
  // ZAMD Token (BSC)
  zamdTokenBSC: {
    address: "0x0A46e040e135b967F501Bb46ad27375c8c979268",
    decimals: 6,
    symbol: "ZAMD",
    name: "Zam Dollar",
  },
} as const;

// Chain IDs
export const CHAIN_IDS = {
  polygon: 137,
  mainnet: 1,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
  bsc: 56,
} as const;

// Network names for Alchemy
export const NETWORK_NAMES = {
  [CHAIN_IDS.polygon]: "polygon",
  [CHAIN_IDS.mainnet]: "ethereum",
  [CHAIN_IDS.arbitrum]: "arbitrum",
  [CHAIN_IDS.optimism]: "optimism",
  [CHAIN_IDS.base]: "base",
  [CHAIN_IDS.bsc]: "bsc",
} as const;
