# ZAMD Token Deployment Guide

## New Token Contract Features

The new `ZAMDToken.sol` includes:
- ✅ **Mint** - Owner can create new tokens (up to cap)
- ✅ **Burn** - Anyone can burn their tokens
- ✅ **Pausable** - Owner can pause transfers in emergencies
- ✅ **Blacklist** - Owner can block suspicious addresses
- ✅ **6 Decimals** - Like USDT/USDC (not 18)
- ✅ **Secure Withdraw** - Cannot withdraw ZAMD itself
- ✅ **Cap** - Maximum supply limit

---

## Deployment Options

### Option 1: Remix IDE (Recommended for Beginners)

1. Go to [Remix IDE](https://remix.ethereum.org)
2. Create new file `ZAMDToken.sol` in contracts folder
3. Paste the contract code
4. Compile the contract (Solidity 0.8.20)
5. Deploy using Injected Provider (MetaMask)

**Constructor Arguments:**
```
initialOwner: YOUR_NEW_WALLET_ADDRESS
initialSupply: 50000000 * 10^6 = 50000000000000 (50M with 6 decimals)
cap: 100000000 * 10^6 = 100000000000000 (100M max)
```

### Option 2: Hardhat (Advanced)

```bash
# Install dependencies
npm install @openzeppelin/contracts

# Deploy
npx hardhat run scripts/deploy.js --network polygon
```

---

## Security Checklist

### Before Deployment:
- [ ] Create a NEW wallet for the owner (DO NOT use the compromised one)
- [ ] Store the private key SECURELY (password manager, not in code)
- [ ] Set up a multisig wallet for extra security (optional)

### After Deployment:
- [ ] Verify contract on PolygonScan
- [ ] Add contract address to your app config
- [ ] Test mint and burn functions
- [ ] Save the new contract address

---

## Important Addresses (You'll Need)

After deployment, update these:

| Item | Old Value | New Value |
|------|-----------|-----------|
| Token Address | `0x932992af6b3305e3fbfab811a4c3ea1531361a5a` | NEW_ADDRESS |
| Owner Wallet | `0x2CebB4956eAE90F3E5f55d1dE7f89E480aDb9f68` | NEW_WALLET |

---

## Next Steps

1. Deploy the new token
2. Update `src/config/contracts.ts` with new token address
3. Update referral system with new admin wallet
4. Deploy to Vercel

Do you need help with any of these steps?
