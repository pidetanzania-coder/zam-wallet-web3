"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Shield } from "lucide-react";

export default function KYCPolicy() {
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
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">KYC/AML Policy</h1>
          <p className="text-slate-400">Know Your Customer & Anti-Money Laundering Policy</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-400 mb-2">Non-Custodial Wallet - No KYC Required</h2>
          <p className="text-slate-300">
            Zam Wallet is a non-custodial cryptocurrency wallet. As such, we do not require traditional KYC 
            (Know Your Customer) verification to use our basic wallet services. Users retain full control 
            of their wallets and funds without providing personal identification.
          </p>
        </div>

        <div className="space-y-4">
          {/* Section 1 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("overview")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">1. Policy Overview</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "overview" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "overview" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>
                  This KYC/AML Policy outlines our commitment to preventing money laundering and terrorist 
                  financing while maintaining our users' privacy and providing accessible cryptocurrency services.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Zam Wallet is a non-custodial, decentralized wallet</li>
                  <li>We do not hold or control user funds</li>
                  <li>Users remain anonymous and in full control of their assets</li>
                  <li>We comply with applicable laws while protecting user privacy</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 2 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("nonCustodial")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">2. Non-Custodial Nature</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "nonCustodial" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "nonCustodial" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p className="text-amber-400 font-semibold">
                  Being a non-custodial wallet means:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>No Fund Custody:</strong> We never hold or control user funds</li>
                  <li><strong>No Accounts:</strong> Users do not create accounts with personal information</li>
                  <li><strong>Private Keys:</strong> Users hold their own private keys</li>
                  <li><strong>Direct Transactions:</strong> Transactions occur directly between users and the blockchain</li>
                  <li><strong>Anonymous Use:</strong> No identification required to create or use a wallet</li>
                </ul>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mt-4">
                  <p className="text-amber-400 font-semibold">Important:</p>
                  <p className="text-slate-300 text-sm">Since we don't control transactions, we cannot block, freeze, or reverse them. Users are fully responsible for their own transactions.</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("limitations")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">3. Service Limitations</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "limitations" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "limitations" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>Due to our non-custodial nature, certain features may have limitations:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>No Account Recovery:</strong> If you lose your seed phrase, we cannot help recover your wallet</li>
                  <li><strong>No Transaction Reversals:</strong> Confirmed transactions cannot be reversed</li>
                  <li><strong>No Freezes:</strong> We cannot freeze wallets or transactions</li>
                  <li><strong>No Identity Verification:</strong> We cannot verify user identities for third parties</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 4 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("aml")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">4. Anti-Money Laundering (AML)</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "aml" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "aml" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>While we don't require KYC, we implement AML principles:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Monitoring:</strong> We monitor for suspicious activity patterns</li>
                  <li><strong>Reporting:</strong> We comply with legal requests from authorities</li>
                  <li><strong>Sanctions:</strong> We may block access from sanctioned jurisdictions</li>
                  <li><strong>Cooperation:</strong> We work with law enforcement when legally required</li>
                </ul>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4">
                  <p className="text-red-400 font-semibold">We Do NOT:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm mt-2">
                    <li>Process transactions on behalf of others</li>
                    <li>Provide mixing or tumbling services</li>
                    <li>Facilitate anonymous transactions for illegal purposes</li>
                    <li>Allow use from sanctioned jurisdictions</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Section 5 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("userResponsibility")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">5. User Responsibilities</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "userResponsibility" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "userResponsibility" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>As a user of Zam Wallet, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Legal Use:</strong> Use the wallet only for lawful purposes</li>
                  <li><strong>Tax Compliance:</strong> Comply with tax laws in your jurisdiction</li>
                  <li><strong>No Illegal Activities:</strong> Not use the wallet for money laundering or terrorist financing</li>
                  <li><strong>Security:</strong> Keep your credentials secure</li>
                  <li><strong>Accurate Information:</strong> Provide accurate information if contacting support</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 6 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("lawEnforcement")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">6. Law Enforcement Cooperation</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "lawEnforcement" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "lawEnforcement" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>We will cooperate with law enforcement when:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Valid Legal Requests:</strong> We receive valid legal process</li>
                  <li><strong>Emergency Situations:</strong> There is imminent risk to life or property</li>
                  <li><strong>Child Safety:</strong> Preventing exploitation of minors</li>
                  <li><strong>Terrorism Prevention:</strong> Preventing terrorist financing</li>
                </ul>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                  <p className="text-blue-400 font-semibold">Note:</p>
                  <p className="text-slate-300 text-sm">Since we are non-custodial, we have limited information to provide. We cannot freeze or reverse transactions.</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 7 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("fiat")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">7. Fiat On/Off Ramp Services</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "fiat" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "fiat" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>If Zam Wallet integrates fiat on/off ramp services:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>These services are provided by third-party providers</li>
                  <li>KYC/AML requirements are determined by the provider</li>
                  <li>Users must comply with the provider's verification requirements</li>
                  <li>Zam Wallet is not responsible for the provider's policies</li>
                </ul>
                <p className="mt-4">
                  Check with the specific fiat provider for their KYC requirements.
                </p>
              </div>
            )}
          </div>

          {/* Section 8 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("jurisdiction")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">8. Restricted Jurisdictions</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "jurisdiction" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "jurisdiction" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>Zam Wallet may not be available in certain jurisdictions due to local regulations. Users from restricted regions may not be able to access all features.</p>
                <p className="mt-2">
                  It is your responsibility to ensure that using Zam Wallet is legal in your jurisdiction.
                </p>
              </div>
            )}
          </div>

          {/* Section 9 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("changes")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">9. Policy Updates</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "changes" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "changes" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>We may update this policy from time to time. Material changes will be posted on our website.</p>
                <p className="mt-2">
                  Continued use of Zam Wallet constitutes acceptance of this policy as modified.
                </p>
              </div>
            )}
          </div>

          {/* Section 10 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("contact")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">10. Contact Us</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "contact" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "contact" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>For questions about this KYC/AML Policy:</p>
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
            <Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/risk" className="text-slate-400 hover:text-white transition-colors text-sm">
              Risk Disclosures
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
