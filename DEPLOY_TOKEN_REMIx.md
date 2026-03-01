# Deploy ZAMD Token - Step by Step Guide

## Prerequisites
- MetaMask wallet installed
- Some MATIC/BNB/ETH for gas fees
- The contract code (I'll provide below)

---

## Step 1: Prepare Your Wallet

### Create a NEW Wallet for Deployment (CRITICAL!)
1. Open MetaMask
2. Click account icon → "Create Account"
3. Name it "ZAMD Owner"
4. **SAVE THE SEED PHRASE SECURELY**
5. Transfer a small amount of native token for gas:
   - Polygon: ~0.5 MATIC
   - BSC: ~0.01 BNB
   - Ethereum: ~0.01 ETH

---

## Step 2: Go to Remix IDE

1. Open: https://remix.ethereum.org
2. Click "File Explorers" (left sidebar)
3. Click "+" → Create new file
4. Name it `ZAMDToken.sol`

---

## Step 3: Paste the Contract Code

Copy and paste this code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZAMDToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable {

    uint256 public immutable cap;
    mapping(address => bool) private _blacklist;

    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event BlacklistUpdated(address indexed account, bool isBlacklisted);

    constructor(
        address initialOwner,
        uint256 initialSupply,
        uint256 cap_
    ) ERC20("Zam Dollar", "ZAMD") Ownable(initialOwner) {
        require(cap_ > 0, "ZAMDToken: cap is 0");
        require(initialSupply <= cap_, "ZAMDToken: initialSupply exceeds cap");
        
        cap = cap_;
        _mint(initialOwner, initialSupply);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) public onlyOwner whenNotPaused {
        require(to != address(0), "ZAMDToken: mint to the zero address");
        require(totalSupply() + amount <= cap, "ZAMDToken: cap exceeded");
        _mint(to, amount);
        emit Mint(to, amount);
    }

    function burn(uint256 amount) public override whenNotPaused {
        require(amount > 0, "ZAMDToken: burn amount is 0");
        super.burn(amount);
        emit Burn(_msgSender(), amount);
    }

    function burnFrom(address from, uint256 amount) public override whenNotPaused {
        require(amount > 0, "ZAMDToken: burn amount is 0");
        super.burnFrom(from, amount);
        emit Burn(from, amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function addBlacklist(address account) public onlyOwner {
        require(account != owner(), "ZAMDToken: cannot blacklist owner");
        _blacklist[account] = true;
        emit BlacklistUpdated(account, true);
    }

    function removeBlacklist(address account) public onlyOwner {
        _blacklist[account] = false;
        emit BlacklistUpdated(account, false);
    }

    function isBlacklisted(address account) public view returns (bool) {
        return _blacklist[account];
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Pausable)
    {
        require(!_blacklist[from] && !_blacklist[to], "ZAMDToken: blacklisted address");
        super._beforeTokenTransfer(from, to, amount);
    }

    function withdrawToken(address token, uint256 amount) public onlyOwner {
        require(token != address(0), "ZAMDToken: invalid token address");
        require(token != address(this), "ZAMDToken: cannot withdraw ZAMD itself");
        
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", owner(), amount)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "Transfer failed");
    }

    function withdrawETH() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}
```

---

## Step 4: Compile the Contract

1. Click "Solidity Compiler" (left sidebar, 2nd icon)
2. Select Compiler version: **0.8.20**
3. Click "Compile ZAMDToken.sol"
4. ✅ Wait for green checkmark

---

## Step 5: Deploy (Choose Your Network)

### Option A: Polygon (Matic)
1. Click "Deploy & Run Transactions" (3rd icon)
2. Select "Injected Provider - MetaMask"
3. MetaMask will ask to connect - approve
4. Select network: **Polygon Mainnet**
5. In constructor fields, enter:
   - `initialOwner`: Your NEW wallet address (0x...)
   - `initialSupply`: `50000000000000` (50M × 10^6)
   - `cap_`: `100000000000000` (100M × 10^6)
6. Click "Deploy"
7. Confirm MetaMask transaction
8. **SAVE THE CONTRACT ADDRESS!**

### Option B: BNB Smart Chain
Same steps, but:
- Select network: **BNB Smart Chain** (add in MetaMask if not there)
- You'll need BNB for gas

### Option C: Ethereum
Same steps, but:
- Select network: **Ethereum Mainnet**
- You'll need ETH for gas (more expensive!)

---

## Step 6: Verify Contract (Important!)

1. Go to the block explorer:
   - Polygon: https://polygonscan.com
   - BSC: https://bscscan.com
   - Ethereum: https://etherscan.io
   
2. Paste your contract address
3. Click "Contract" → "Verify and Publish"
4. Fill in:
   - Contract Address: (the address you saved)
   - Compiler Type: Solidity (Single File)
   - Compiler Version: 0.8.20
   - License: MIT
5. Copy contract code again and paste
6. Click "Verify"

---

## Step 7: Update Your App

After deployment, you'll get a contract address like:
`0x1234567890abcdef1234567890abcdef12345678`

Update your app:

### For Polygon:
```javascript
// src/config/contracts.ts
export const CONTRACTS = {
  zamdToken: {
    address: "YOUR_NEW_POLYGON_ADDRESS",
    decimals: 6,
    symbol: "ZAMD",
  },
};
```

---

## Token Supply Examples

| Supply | Value (6 decimals) |
|--------|-------------------|
| 10M    | 10000000000000    |
| 50M    | 50000000000000    |
| 100M   | 100000000000000   |
| 1B     | 1000000000000000  |

---

## Summary Checklist

- [ ] Created new deployment wallet
- [ ] Funded wallet with gas token
- [ ] Compiled contract (0.8.20)
- [ ] Deployed to Polygon
- [ ] Verified on Polygonscan
- [ ] Saved contract address
- [ ] Updated app config

---

## Need Help?

For which network do you need more details?
1. Polygon (recommended - cheapest)
2. BNB Smart Chain
3. Ethereum
