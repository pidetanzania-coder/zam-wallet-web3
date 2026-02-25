"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsOfService() {
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
          <h1 className="text-4xl font-black text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400">Last updated: February 2026</p>
        </div>

        <div className="space-y-4">
          {/* Section 1 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("acceptance")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">1. Acceptance of Terms</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "acceptance" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "acceptance" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>
                  By accessing and using Zam Wallet ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. Additionally, when using Zam Wallet's services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>
                <p>
                  If you do not agree to these Terms of Service, you should not use Zam Wallet. Your continued use of the Service constitutes your agreement to these terms.
                </p>
              </div>
            )}
          </div>

          {/* Section 2 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("description")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">2. Description of Service</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "description" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "description" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>
                  Zam Wallet is a non-custodial cryptocurrency wallet that allows users to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Create and manage blockchain wallets</li>
                  <li>Import existing wallets using seed phrases</li>
                  <li>Send and receive cryptocurrencies</li>
                  <li>Swap tokens across multiple networks</li>
                  <li>Stake tokens for rewards</li>
                  <li>View transaction history and portfolio balances</li>
                </ul>
                <p className="mt-4">
                  The Service utilizes Alchemy's infrastructure for blockchain interactions and account abstraction.
                </p>
              </div>
            )}
          </div>

          {/* Section 3 - Non-Custodial */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("nonCustodial")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">3. Non-Custodial Nature</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "nonCustodial" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "nonCustodial" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p className="text-amber-400 font-semibold">
                  IMPORTANT: Zam Wallet is a non-custodial wallet.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>We do not hold, control, or have access to your private keys or funds</li>
                  <li>All transactions are executed directly on the blockchain</li>
                  <li>You are solely responsible for securing your seed phrase and private keys</li>
                  <li>We cannot recover lost funds or reset your credentials</li>
                  <li>Anyone with access to your seed phrase can access your funds</li>
                </ul>
                <p className="mt-4">
                  If you lose your seed phrase, there is no way to recover your wallet. We strongly recommend backing up your seed phrase and storing it securely offline.
                </p>
              </div>
            )}
          </div>

          {/* Section 4 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("eligibility")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">4. Eligibility</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "eligibility" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "eligibility" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>You represent and warrant that:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>You are at least 18 years of age</li>
                  <li>You have the legal capacity to enter into binding agreements</li>
                  <li>You are not restricted from using the Service under applicable law</li>
                  <li>You will comply with all applicable regulations in your jurisdiction</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 5 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("userConduct")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">5. User Conduct</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "userConduct" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "userConduct" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Use the Service for any illegal purpose</li>
                  <li>Attempt to gain unauthorized access to the Service</li>
                  <li>Transmit viruses, malware, or other harmful code</li>
                  <li>Interfere with the proper operation of the Service</li>
                  <li>Engage in any activity that could harm Zam Wallet or its users</li>
                  <li>Attempt to reverse engineer or decompile the Service</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 6 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("fees")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">6. Fees and Costs</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "fees" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "fees" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>Using Zam Wallet may incur the following fees:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Network Fees (Gas):</strong> Fees paid to blockchain networks for transactions. These are not controlled by Zam Wallet.</li>
                  <li><strong>Swap Fees:</strong> A small percentage may be charged on token swaps (if applicable)</li>
                  <li><strong>Staking Fees:</strong> Any fees associated with staking operations</li>
                </ul>
                <p className="mt-4">
                  All fees will be displayed before you confirm any transaction. You are responsible for paying all network fees associated with your transactions.
                </p>
              </div>
            )}
          </div>

          {/* Section 7 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("disclaimer")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">7. Disclaimer of Warranties</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "disclaimer" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "disclaimer" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p className="text-amber-400 font-semibold">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE".
                </p>
                <p>
                  Zam Wallet makes no representations or warranties of any kind, express or implied, regarding:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>The accuracy, reliability, or completeness of the Service</li>
                  <li>The availability or uninterrupted operation of the Service</li>
                  <li>That the Service will meet your requirements</li>
                  <li>That any defects will be corrected</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 8 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("limitation")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">8. Limitation of Liability</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "limitation" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "limitation" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>
                  IN NO EVENT SHALL ZAM WALLET BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Loss of profits, data, or business opportunities</li>
                  <li>Loss of cryptocurrency or other digital assets</li>
                  <li>Damages resulting from user errors or forgotten credentials</li>
                  <li>Damages resulting from blockchain network issues</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 9 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("indemnification")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">9. Indemnification</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "indemnification" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "indemnification" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>
                  You agree to indemnify, defend, and hold harmless Zam Wallet and its officers, directors, employees, and agents from any and all claims, damages, losses, liabilities, costs, or expenses arising out of:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Your illegal or improper conduct</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 10 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("termination")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">10. Termination</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "termination" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "termination" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>
                  Zam Wallet may, at its sole discretion, suspend or terminate your access to the Service at any time, without prior notice, for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Violation of these Terms</li>
                  <li>Suspicious or illegal activity</li>
                  <li>Request by law enforcement or regulatory bodies</li>
                  <li>Technical difficulties or maintenance</li>
                </ul>
                <p className="mt-4">
                  Termination shall not affect any rights or obligations that arose prior to termination.
                </p>
              </div>
            )}
          </div>

          {/* Section 11 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("governing")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">11. Governing Law</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "governing" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "governing" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>
                  These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflicts of law principles.
                </p>
                <p>
                  Any disputes arising under these Terms shall be resolved through binding arbitration in accordance with applicable rules.
                </p>
              </div>
            )}
          </div>

          {/* Section 12 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("contact")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">12. Contact Information</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "contact" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "contact" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>For questions or concerns about these Terms, please contact us:</p>
                <ul className="space-y-2 ml-2">
                  <li>Email: support@zamwallet.xyz</li>
                  <li>Website: https://zamwallet.xyz</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-500 text-sm">
            © 2026 Zam Wallet. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/risk" className="text-slate-400 hover:text-white transition-colors text-sm">
              Risk Disclosures
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
