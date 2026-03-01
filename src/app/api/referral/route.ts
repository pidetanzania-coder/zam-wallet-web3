import { NextResponse } from "next/server";
import {
  getOrCreateUser,
  getUserByWallet,
  getReferralStats,
  getReferralSettings,
} from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    // Get or create user
    const user = await getOrCreateUser(wallet);

    // Get referral stats
    const stats = await getReferralStats(wallet);

    // Get settings
    const settings = await getReferralSettings();

    return NextResponse.json({
      success: true,
      user: {
        wallet_address: user.wallet_address,
        referral_code: user.referral_code,
        referred_by: user.referred_by,
        referral_bonus_earned: user.referral_bonus_earned || 0,
        referral_bonus_staked: user.referral_bonus_staked || 0,
      },
      stats: {
        total_referrals: stats?.total_referrals || 0,
        total_bonus_earned: stats?.total_bonus_earned || 0,
      },
      settings: {
        new_user_bonus: parseFloat(settings.new_user_bonus || "25"),
        referrer_bonus: parseFloat(settings.referrer_bonus || "5"),
        min_stake_amount: parseFloat(settings.min_stake_amount || "25"),
        active: settings.active === "1",
      },
    });
  } catch (error) {
    console.error("Referral API error:", error);
    return NextResponse.json(
      { error: "Failed to get referral info", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wallet, referralCode } = body;

    if (!wallet) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    // Get or create user with optional referral code
    const user = await getOrCreateUser(wallet, referralCode);

    return NextResponse.json({
      success: true,
      user: {
        wallet_address: user.wallet_address,
        referral_code: user.referral_code,
        referred_by: user.referred_by,
      },
    });
  } catch (error) {
    console.error("Referral API error:", error);
    return NextResponse.json(
      { error: "Failed to create referral", details: String(error) },
      { status: 500 }
    );
  }
}
