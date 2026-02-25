"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, AlertTriangle, Info } from "lucide-react";

export default function RiskDisclosures() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Risk Disclosures</h1>
          <p className="text-slate-400">Important information about the risks of using Zam Wallet</p>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-red-400 mb-2">⚠️ Important Warning</h2>
          <p className="text-slate-300">
            Cryptocurrency investments involve substantial risk. You may lose your entire investment. 
            Zam Wallet is a non-custodial wallet - we cannot recover lost funds or reverse transactions.
          </p>
        </div>

        <div className="space-y-4">
          {/* Section 1 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("nonCustodial")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">1. Non-Custodial Wallet Risks</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "nonCustodial" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "nonCustodial" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p className="text-amber-400 font-semibold">
                  Zam Wallet is a non-custodial wallet - you are solely responsible for your funds.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>No Password Recovery:</strong> If you lose your seed phrase, we cannot recover your wallet</li>
                  <li><strong>No Transaction Reversals:</strong> Once confirmed, blockchain transactions cannot be reversed</li>
                  <li><strong>Full Control:</strong> You have complete control over your private keys and funds</li>
                  <li><strong>Security Responsibility:</strong> You are responsible for securing your credentials</li>
                </ul>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-4">
                  <p className="text-amber-400 font-semibold">Recommendation:</p>
                  <p className="text-slate-300 text-sm">Never share your seed phrase with anyone. Store it securely offline. Consider using a hardware wallet for large amounts.</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 2 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("cryptocurrency")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">2. Cryptocurrency Risks</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "cryptocurrency" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "cryptocurrency" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Volatility:</strong> Cryptocurrency prices can fluctuate dramatically</li>
                  <li><strong>Liquidity Risks:</strong> Some tokens may be difficult to sell</li>
                  <li><strong>Market Loss:</strong> You may lose some or all of your investment</li>
                  <li><strong>No FDIC Insurance:</strong> Crypto assets are not insured by government agencies</li>
                  <li><strong>Regulatory Changes:</strong> Laws may change affecting cryptocurrency use</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 3 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("smartContract")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">3. Smart Contract Risks</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "smartContract" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "smartContract" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p className="text-amber-400 font-semibold">
                  Zam Wallet interacts with smart contracts which carry unique risks.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Code Vulnerabilities:</strong> Smart contracts may contain bugs or security flaws</li>
                  <li><strong>Protocol Risks:</strong> DeFi protocols may be exploited or fail</li>
                  <li><strong>Impermanent Loss:</strong> Providing liquidity may result in loss</li>
                  <li><strong>Staking Risks:</strong> Staked assets may be locked or subject to slashing</li>
                  <li><strong>Oracle Failures:</strong> Price data may be manipulated or unavailable</li>
                </ul>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                  <p className="text-blue-400 font-semibold">Best Practice:</p>
                  <p className="text-slate-300 text-sm">Only interact with audited contracts. Start with small amounts. Understand the protocol before using it.</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 4 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("network")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">4. Network Risks</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "network" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "network" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Network Congestion:</strong> High demand can slow transactions</li>
                  <li><strong>Failed Transactions:</strong> Transactions may fail due to various reasons</li>
                  <li><strong>Chain Reorganizations:</strong> blockchains can reorganize, affecting transaction finality</li>
                  <li><strong>Network Forks:</strong> Hard forks can split tokens into separate assets</li>
                  <li><strong>Rpc Outages:</strong> Node providers may experience downtime</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 5 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("security")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">5. Security Risks</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "security" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "security" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Phishing Attacks:</strong> Scammers may try to steal your credentials</li>
                  <li><strong>Malware:</strong> Your device may be compromised</li>
                  <li><strong>Social Engineering:</strong> Scammers may trick you into revealing secrets</li>
                  <li><strong>Fake Websites:</strong> Scammers may create lookalike sites</li>
                  <li><strong>Clipboard Hijacking:</strong> Malware may replace copied addresses</li>
                </ul>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4">
                  <p className="text-red-400 font-semibold">Never:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm mt-2">
                    <li>Share your seed phrase with anyone</li>
                    <li>Enter your seed phrase on any website</li>
                    <li>Click links from untrusted sources</li>
                    <li>Send crypto to addresses you haven't verified</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Section 6 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("staking")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">6. Staking Risks</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "staking" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "staking" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Lock Period:</strong> Staked tokens may be locked for a period</li>
                  <li><strong>Early Withdrawal:</strong> Early withdrawal may incur penalties</li>
                  <li><strong>APY Changes:</strong> Staking rewards are not guaranteed and can change</li>
                  <li><strong>Validator Slashing:</strong> Network validators may lose staked funds</li>
                  <li><strong>Smart Contract Risk:</strong> Staking contracts may have vulnerabilities</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 7 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("regulatory")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">7. Regulatory & Legal Risks</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "regulatory" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "regulatory" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Illegal Activities:</strong> Using crypto for illegal purposes may result in prosecution</li>
                  <li><strong>Tax Obligations:</strong> You may be required to pay taxes on crypto gains</li>
                  <li><strong>Bans & Restrictions:</strong> Governments may ban or restrict cryptocurrency use</li>
                  <li><strong>Compliance:</strong> You are responsible for complying with applicable laws</li>
                </ul>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                  <p className="text-blue-400 font-semibold">Advice:</p>
                  <p className="text-slate-300 text-sm">Consult with a tax professional regarding your cryptocurrency activities.</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 8 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("transaction")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">8. Transaction Risks</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "transaction" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "transaction" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Wrong Address:</strong> Sending to wrong address results in permanent loss</li>
                  <li><strong>Wrong Network:</strong> Sending on wrong network may result in loss</li>
                  <li><strong>Gas Fees:</strong> Network fees are unpredictable and may be high</li>
                  <li><strong>Failed Transactions:</strong> Transactions may fail and still consume gas</li>
                  <li><strong>Slippage:</strong> Token swaps may execute at different rates than expected</li>
                </ul>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-4">
                  <p className="text-amber-400 font-semibold">Always:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm mt-2">
                    <li>Verify the recipient address before sending</li>
                    <li>Confirm you are on the correct network</li>
                    <li>Check gas prices before confirming</li>
                    <li>Set appropriate slippage for swaps</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Section 9 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("technology")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">9. Technology Risks</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "technology" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "technology" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Software Bugs:</strong> The wallet may contain bugs affecting functionality</li>
                  <li><strong>Technical Failures:</strong> Servers, networks, or devices may fail</li>
                  <li><strong>Updates:</strong> Software updates may change functionality</li>
                  <li><strong>Compatibility:</strong> Some features may not work on all devices</li>
                  <li><strong>Data Loss:</strong> Device failure may result in data loss</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 10 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("advice")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">10. Financial Advice Disclaimer</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "advice" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "advice" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p className="text-amber-400 font-semibold">
                  Zam Wallet does not provide financial, investment, or legal advice.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>No Advice:</strong> We do not recommend any cryptocurrency or investment</li>
                  <li><strong>Research:</strong> You should conduct your own research before investing</li>
                  <li><strong>Professional Advice:</strong> Consult with qualified professionals</li>
                  <li><strong>Your Decision:</strong> All investment decisions are your responsibility</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Acknowledgment */}
        <div className="mt-12 bg-slate-800/50 rounded-2xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Acknowledgment</h3>
          <p className="text-slate-300 text-sm">
            By using Zam Wallet, you acknowledge that you have read, understood, and agree to assume 
            all risks associated with using cryptocurrency wallets and blockchain technology. You confirm 
            that you have the knowledge and experience to understand the risks involved.
          </p>
          <p className="text-slate-400 text-sm mt-4">
            This risk disclosure is not exhaustive and does not cover all possible risks of using Zam Wallet.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Zam Wallet. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/kyc" className="text-slate-400 hover:text-white transition-colors text-sm">
              KYC/AML Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
