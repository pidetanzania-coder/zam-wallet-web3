"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: February 2026</p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-amber-400 mb-2">Non-Custodial Wallet Privacy</h2>
          <p className="text-slate-300">
            Zam Wallet is a non-custodial wallet. We do not collect, store, or have access to your private keys, 
            seed phrases, or cryptocurrency funds. All wallet credentials remain exclusively in your control.
          </p>
        </div>

        <div className="space-y-4">
          {/* Section 1 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("collection")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">1. Information We Collect</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "collection" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "collection" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>We collect the following types of information:</p>
                
                <h3 className="font-semibold text-white mt-4">Information You Provide</h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Account Information:</strong> Email address (if using email login)</li>
                  <li><strong>Support Requests:</strong> Any information you provide when contacting support</li>
                </ul>

                <h3 className="font-semibold text-white mt-4">Automatically Collected Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Device Information:</strong> Browser type, device type, operating system</li>
                  <li><strong>Usage Data:</strong> Pages visited, features used, interaction patterns</li>
                  <li><strong>Network Data:</strong> IP address (for security and analytics)</li>
                  <li><strong>Cookies:</strong> Session data for authentication and preferences</li>
                </ul>

                <h3 className="font-semibold text-white mt-4">Blockchain Information</h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Public Addresses:</strong> Wallet addresses visible on the blockchain</li>
                  <li><strong>Transaction Data:</strong> Blockchain transactions (public by nature)</li>
                  <li><strong>Token Balances:</strong> Tokens held at your public address</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 2 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("use")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">2. How We Use Your Information</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "use" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "use" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>We use your information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Provide Services:</strong> To operate and maintain Zam Wallet services</li>
                  <li><strong>Wallet Operations:</strong> To execute blockchain transactions you request</li>
                  <li><strong>Security:</strong> To detect and prevent fraud, unauthorized access</li>
                  <li><strong>Analytics:</strong> To understand how users interact with our Service</li>
                  <li><strong>Communications:</strong> To respond to support requests and provide updates</li>
                  <li><strong>Improvements:</strong> To enhance and optimize the Service</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 3 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("sharing")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">3. Information Sharing</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "sharing" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "sharing" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p className="text-amber-400 font-semibold">
                  We do NOT sell your personal information.
                </p>
                <p>We may share information only in these circumstances:</p>
                
                <h3 className="font-semibold text-white mt-4">Service Providers</h3>
                <p>We share data with trusted third parties who help operate Zam Wallet:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Alchemy:</strong> Blockchain infrastructure and account management</li>
                  <li><strong>OneSignal:</strong> Push notification services</li>
                  <li><strong>Analytics Providers:</strong> Usage analytics (anonymized data)</li>
                </ul>

                <h3 className="font-semibold text-white mt-4">Legal Requirements</h3>
                <p>We may disclose information when:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Required by law or regulation</li>
                  <li>Requested by law enforcement</li>
                  <li>Necessary to protect our rights or safety</li>
                </ul>

                <h3 className="font-semibold text-white mt-4">Blockchain is Public</h3>
                <p>
                  Please note that blockchain transactions are inherently public. Your wallet address 
                  and transaction history are visible to anyone on the blockchain.
                </p>
              </div>
            )}
          </div>

          {/* Section 4 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("security")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">4. Data Security</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "security" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "security" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>We implement appropriate security measures:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Encryption:</strong> Data transmitted over HTTPS/TLS</li>
                  <li><strong>Access Controls:</strong> Limited employee access to systems</li>
                  <li><strong>Monitoring:</strong> Regular security audits and monitoring</li>
                  <li><strong>Secure Infrastructure:</strong> Cloud hosting with security certifications</li>
                </ul>
                
                <h3 className="font-semibold text-white mt-4">Important Security Notes</h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>We cannot recover lost seed phrases or private keys</li>
                  <li>You are responsible for securing your wallet credentials</li>
                  <li>Never share your seed phrase with anyone</li>
                  <li>Use hardware wallets for large amounts</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 5 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("cookies")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">5. Cookies and Tracking</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "cookies" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "cookies" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>We use cookies and similar tracking technologies:</p>
                
                <h3 className="font-semibold text-white mt-4">Essential Cookies</h3>
                <p>Required for the Service to function:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Session authentication</li>
                  <li>User preferences</li>
                  <li>Security features</li>
                </ul>

                <h3 className="font-semibold text-white mt-4">Analytics Cookies</h3>
                <p>Help us understand usage patterns:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Page views and navigation</li>
                  <li>Feature usage</li>
                  <li>Performance metrics</li>
                </ul>

                <h3 className="font-semibold text-white mt-4">Managing Cookies</h3>
                <p>
                  You can disable cookies in your browser settings, but this may affect the functionality of Zam Wallet.
                </p>
              </div>
            )}
          </div>

          {/* Section 6 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("retention")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">6. Data Retention</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "retention" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "retention" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>We retain information only as long as necessary:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Account Data:</strong> Retained while your account is active</li>
                  <li><strong>Transaction Data:</strong> Determined by blockchain (permanent)</li>
                  <li><strong>Analytics Data:</strong> Aggregated and anonymized, retained for 2 years</li>
                  <li><strong>Support Data:</strong> Retained for 1 year after resolution</li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 7 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("rights")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">7. Your Rights</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "rights" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "rights" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>You have the following rights regarding your data:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
                  <li><strong>Objection:</strong> Object to certain processing of your data</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, contact us at support@zamwallet.xyz
                </p>
              </div>
            )}
          </div>

          {/* Section 8 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("thirdParty")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">8. Third-Party Services</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "thirdParty" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "thirdParty" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>Zam Wallet uses third-party services:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Alchemy:</strong> Blockchain nodes, account infrastructure</li>
                  <li><strong>OneSignal:</strong> Push notifications</li>
                  <li><strong>CoinGecko:</strong> Token price data</li>
                  <li><strong>Analytics:</strong> Usage analytics</li>
                </ul>
                <p className="mt-4">
                  These services have their own privacy policies. We encourage you to review them.
                </p>
              </div>
            )}
          </div>

          {/* Section 9 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("children")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">9. Children's Privacy</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "children" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "children" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>
                  Zam Wallet is not intended for use by individuals under the age of 18. 
                  We do not knowingly collect personal information from children. 
                  If you become aware that a child has provided us with personal information, 
                  please contact us immediately.
                </p>
              </div>
            )}
          </div>

          {/* Section 10 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("changes")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">10. Changes to This Policy</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "changes" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "changes" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  Your continued use of Zam Wallet after any changes indicates your acceptance of the new policy.
                </p>
              </div>
            )}
          </div>

          {/* Section 11 */}
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden">
            <button
              onClick={() => toggleSection("contact")}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="text-lg font-semibold text-white">11. Contact Us</span>
              <ChevronLeft className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === "contact" ? "rotate-90" : ""}`} />
            </button>
            {activeSection === "contact" && (
              <div className="px-6 pb-4 text-slate-300 space-y-3">
                <p>For questions about this Privacy Policy, please contact us:</p>
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
