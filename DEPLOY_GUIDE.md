# ZAMD Staking Contract Deployment Guide

## Contract Information

**New Contract Address (Fixed):** `0x1341ecc1e7Ed78eB7F1B052CB6a56903BC53AbdC`

**ZAMD Token:** `0x932992af6b3305e3fbfab811a4c3ea1531361a5a` (6 decimals)

**Owner:** `0x68c06ff402cdb6784b22bc67640ad04a2cc079b0`

---

## Important Notes
- ZAMD token has **6 decimals**, not 18
- Amount format: `1000 ZAMD = 1000000000` (not 1000000000000000000)
- Network: **Polygon (MATIC)**

---

## Step 1: Compile the Fixed Contract

1. Open **Remix IDE**: https://remix.ethereum.org
2. Create new file: `ZAMDStakingFixed.sol`
3. Paste the code from `contracts/ZAMDStakingFixed.sol`
4. Go to **Solidity Compiler** tab
5. Select **Compiler**: `0.8.20`
6. Check **"Enable optimization"** with **200 runs**
7. Click **Compile ZAMDStakingFixed.sol** ✅

---

## Step 2: Deploy the Contract

1. Go to **Deploy** tab
2. Under **ENVIRONMENT**, select **"Injected Provider - MetaMask"**
3. Connect your MetaMask wallet
4. Make sure you're on **Polygon network**
5. Select contract: **"ZAMDStaking"** (not the one with "-__" after it)
6. Expand the constructor arguments
7. Fill in:

| Parameter | Value |
|-----------|-------|
| `_stakingToken` | `0x932992af6b3305e3fbfab811a4c3ea1531361a5a` |
| `_rewardToken` | `0x932992af6b3305e3fbfab811a4c3ea1531361a5a` |
| `_owner` | `0x68c06ff402cdb6784b22bc67640ad04a2cc079b0` |

8. Click **Deploy**
9. Confirm in MetaMask
10. Wait for transaction to confirm ✅

**Copy your new contract address!**

---

## Step 3: Add ZAMD Token to MetaMask (If Not Already)

1. In MetaMask, click **"Import tokens"**
2. Token address: `0x932992af6b3305e3fbfab811a4c3ea1531361a5a`
3. Token symbol: `ZAMD`
4. Token decimals: `6`
5. Click **Add Custom Token**
6. Click **Import Tokens**

---

## Step 4: Approve ZAMD for Staking Contract

### 4.1 Load ZAMD Token Contract

1. In Remix **Deploy** tab
2. Under contract dropdown, select **"IERC20"**
3. Click **"At Address"**
4. Enter: `0x932992af6b3305e3fbfab811a4c3ea1531361a5a`
5. Click **At Address**

### 4.2 Approve

1. Find **"approve"** function in the deployed contract
2. Fill in:
   - `spender`: **[YOUR_NEW_STAKING_CONTRACT_ADDRESS]**
   - `amount`: `1000000000` (1000 ZAMD - use 6 decimals!)
3. Click **transact**
4. Confirm in MetaMask
5. Wait for confirmation ✅

---

## Step 5: Add Reward Pool

### 5.1 Load Staking Contract

1. In Remix **Deploy** tab
2. Select **"ZAMDStaking"** contract
3. Click **"At Address"**
4. Enter: **[YOUR_NEW_STAKING_CONTRACT_ADDRESS]**
5. Click **At Address**

### 5.2 Add Rewards

1. Find **"addRewardPool"** function
2. Enter amount: `1000000000` (1000 ZAMD - **6 decimals!**)
3. Click **transact**
4. Confirm in MetaMask
5. Wait for confirmation ✅

---

## Step 6: Verify

1. Call **"rewardPoolBalance()"** function
2. Should show: `1000000000` (1000 ZAMD)

---

## Quick Reference: Amount Formats

| ZAMD Amount | 6-Decimal Format | 18-Decimal Format (WRONG!) |
|-------------|------------------|---------------------------|
| 1 ZAMD | 1000000 | 1000000000000000000 |
| 10 ZAMD | 10000000 | 10000000000000000000 |
| 100 ZAMD | 100000000 | 100000000000000000000 |
| 1000 ZAMD | 1000000000 | 1000000000000000000000 |
| 10000 ZAMD | 10000000000 | 10000000000000000000000 |

**Always use 6-decimal format!**

---

## Troubleshooting

### Error: "ERC20: transfer amount exceeds balance"
- You're using wrong decimal format
- Make sure amount is in 6 decimals: `1000000000` not `1000000000000000000`

### Error: "Insufficient reward pool"
- Need to add more rewards to pool
- Or user has already claimed all rewards

### Error: "Amount below minimum"
- Minimum stake is 25 ZAMD
- Use amount >= 25000000 (in 6 decimals)

---

## After Deployment

### Update Your App

```javascript
// Updated in src/config/contracts.ts
const STAKING_CONTRACT_ADDRESS = "0x1341ecc1e7Ed78eB7F1B052CB6a56903BC53AbdC";
```

### Contract Features
- ✅ 18% APY
- ✅ 14-day lock period
- ✅ Minimum stake: 25 ZAMD
- ✅ Users can claim rewards without withdrawing
- ✅ Emergency functions available

---

## Need Help?

If you encounter issues:
1. Check MetaMask is on Polygon network
2. Verify ZAMD token balance
3. Check decimal format is correct (6 decimals!)
4. Make sure you approved the contract first

---

**Good luck with your deployment! 🚀**
