import { NextResponse } from "next/server";
import { createWalletClient, http, parseEther, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { polygon } from "viem/chains";

// ZAMD Token Configuration
const ZAMD_TOKEN = "0x932992af6b3305e3fbfab811a4c3ea1531361a5a";
const ZAMD_DECIMALS = 6;

// Admin wallet configuration
const ADMIN_PRIVATE_KEY = (process.env.ADMIN_PRIVATE_KEY || "0xe259b7b8f8f32d83b66073bfd11e6a8ba37540b10ab8ad95994537ddf4571d79") as `0x${string}`;
const ADMIN_ADDRESS = "0x1769d8B5F892d313E812bE64015477ed0B3397a4";

// Bonus amounts
const NEW_USER_BONUS = parseUnits("25", ZAMD_DECIMALS); // 25 ZAMD
const REFERRER_BONUS = parseUnits("5", ZAMD_DECIMALS);   // 5 ZAMD

// Token ABI for transfer function (ERC-20)
const TOKEN_ABI = [
  {
    name: "transfer",
    type: "function",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  }
] as const;

// Send ZAMD tokens from admin wallet
async function sendZAMD(toAddress: string, amount: bigint): Promise<string> {
  const account = privateKeyToAccount(ADMIN_PRIVATE_KEY);
  
  const client = createWalletClient({
    chain: polygon,
    transport: http(),
    account
  });
  
  const hash = await client.writeContract({
    address: ZAMD_TOKEN,
    abi: TOKEN_ABI,
    functionName: "transfer",
    args: [toAddress as `0x${string}`, amount]
  });
  
  return hash;
}

// Claim bonus for new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wallet, action } = body;

    if (!wallet) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    // Validate address
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 });
    }

    if (action === "claim") {
      // Send 25 ZAMD to new user
      try {
        const txHash = await sendZAMD(wallet, NEW_USER_BONUS);
        
        return NextResponse.json({
          success: true,
          message: "25 ZAMD bonus claimed!",
          amount: "25",
          txHash: txHash,
          to: wallet,
          from: ADMIN_ADDRESS
        });
      } catch (error) {
        console.error("Token transfer error:", error);
        return NextResponse.json({
          success: false,
          error: "Failed to send tokens",
          details: String(error)
        }, { status: 500 });
      }
    }

    if (action === "stake-trigger") {
      // Get referrer from database and send bonus
      // For now, return success - in production, query database
      
      return NextResponse.json({
        success: true,
        message: "Referrer bonus triggered! 5 ZAMD will be sent to referrer.",
        amount: "5"
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Bonus API error:", error);
    return NextResponse.json(
      { error: "Failed to process bonus", details: String(error) },
      { status: 500 }
    );
  }
}

// Check bonus status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
  }

  return NextResponse.json({
    wallet,
    bonus_claimed: false,
    referred_by: null
  });
}
