import { NextResponse } from "next/server";

// Use your cPanel server URL
// Replace with your actual domain
const API_BASE_URL = process.env.REFERRAL_API_URL || "http://decisive-peach-hummingbird.135-181-108-109.cpanel.site/api/referral.php";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get("wallet");

    if (!wallet) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
    }

    // Call PHP API on your server
    const response = await fetch(`${API_BASE_URL}?wallet=${encodeURIComponent(wallet)}`);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Referral API error:", error);
    return NextResponse.json(
      { 
        error: "Failed to get referral info", 
        details: String(error),
        hint: "Check that your server API is running and accessible" 
      },
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

    // Call PHP API on your server
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet,
        referralCode: referralCode || null,
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Referral API error:", error);
    return NextResponse.json(
      { error: "Failed to create referral", details: String(error) },
      { status: 500 }
    );
  }
}
