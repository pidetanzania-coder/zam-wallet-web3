"use client";

import { useState, useEffect } from "react";
import { useAccount } from "@account-kit/react";
import { Copy, Check, Users, Gift, TrendingUp, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ReferralData {
  wallet_address: string;
  referral_code: string;
  referred_by: string | null;
  referral_bonus_earned: number;
  referral_bonus_staked: number;
  total_referrals: number;
  total_bonus_earned: number;
}

export default function ReferralPage() {
  const { address } = useAccount({ type: "LightAccount" });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReferralData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (address) {
      fetchReferralData();
    }
  }, [address]);

  const fetchReferralData = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/referral?wallet=${address}`);
      const result = await response.json();
      
      if (result.success) {
        setData({
          wallet_address: result.user.wallet_address,
          referral_code: result.user.referral_code,
          referred_by: result.user.referred_by,
          referral_bonus_earned: result.user.referral_bonus_earned,
          referral_bonus_staked: result.user.referral_bonus_staked,
          total_referrals: result.stats.total_referrals,
          total_bonus_earned: result.stats.total_bonus_earned,
        });
      }
    } catch (error) {
      console.error("Error fetching referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    if (!data?.referral_code) return;
    
    const referralLink = `https://zamwallet.io?ref=${data.referral_code}`;
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Referral Program
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Invite friends and earn free ZAMD tokens!
        </p>
      </div>

      {/* Your Referral Code */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Your Referral Code
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Referral Code</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {data?.referral_code || "Loading..."}
            </p>
          </div>
          
          <button
            onClick={copyReferralCode}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Link
              </>
            )}
          </button>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
          Share your link: <span className="font-mono text-indigo-600">https://zamwallet.io?ref={data?.referral_code}</span>
        </p>
      </div>

      {/* How It Works */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          How It Works
        </h2>
        
        <div className="grid gap-4">
          <div className="flex gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">1. Invite Friends</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Share your referral link with friends
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Gift className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">2. Friend Gets 25 ZAMD</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your friend receives 25 ZAMD (can only be staked)
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">3. You Earn 5 ZAMD</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                When your friend stakes, you get 5 ZAMD bonus
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <Users className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {data?.total_referrals || 0}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Referrals</p>
        </div>
        
        <div className="card text-center">
          <Gift className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {data?.total_bonus_earned?.toFixed(2) || "0"} ZAMD
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Bonus Earned</p>
        </div>
      </div>

      {/* Important Notes */}
      <div className="card bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20">
        <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
          Important Notes
        </h3>
        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
          <li>• Referral ZAMD can ONLY be staked (cannot be sent or swapped)</li>
          <li>• When you unstake referral tokens, you only get the rewards (not original tokens)</li>
          <li>• Referral bonuses must reach minimum stake amount (25 ZAMD)</li>
        </ul>
      </div>
    </div>
  );
}
