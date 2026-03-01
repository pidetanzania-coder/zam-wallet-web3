"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, HelpCircle, Wallet, Send, Coins, Lock, AlertTriangle, Mail, LucideIcon } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Wallet Basics
  {
    question: "What is Zam Wallet?",
    answer: "Zam Wallet is a non-custodial cryptocurrency wallet that allows you to store, send, receive, swap, and stake cryptocurrencies. It supports multiple blockchain networks including Polygon, Arbitrum, Base, Optimism, Ethereum, BNB Chain, and Celo.",
    category: "basics"
  },
  {
    question: "Is Zam Wallet free to use?",
    answer: "Zam Wallet is free to download and use. However, you will need to pay network fees (gas fees) for transactions on the blockchain. These fees go to the network validators, not to Zam Wallet.",
    category: "basics"
  },
  {
    question: "What is a non-custodial wallet?",
    answer: "A non-custodial wallet means you are the only one who controls your funds. Unlike centralized exchanges, Zam Wallet does not hold or control your private keys or funds. You have full ownership and responsibility for your crypto.",
    category: "basics"
  },
  
  // Security
  {
    question: "How do I secure my wallet?",
    answer: "1. Write down your seed phrase and store it securely offline\n2. Never share your seed phrase with anyone\n3. Use a hardware wallet for large amounts\n4. Enable device security (password, biometrics)\n5. Only access Zam Wallet from trusted devices\n6. Be wary of phishing attempts",
    category: "security"
  },
  {
    question: "What happens if I lose my seed phrase?",
    answer: "If you lose your seed phrase, there is NO WAY to recover your wallet or funds. Zam Wallet is non-custodial, meaning we cannot reset or recover your credentials. Always back up your seed phrase and store it in a safe place.",
    category: "security"
  },
  {
    question: "Is Zam Wallet safe?",
    answer: "Zam Wallet uses industry-standard security practices including:\n- Encryption of local data\n- Secure connection to blockchain networks\n- Smart contract audits (ZAMD Staking)\n- No custody of user funds\n\nHowever, always practice good security habits and never share your credentials.",
    category: "security"
  },
  {
    question: "Can Zam Wallet access my funds?",
    answer: "No. Zam Wallet is non-custodial. We never have access to your private keys or seed phrase. Only you can access your funds through your wallet. We cannot freeze, reverse, or access your funds.",
    category: "security"
  },
  
  // Transactions
  {
    question: "How do I send crypto?",
    answer: "1. Go to the Send page\n2. Enter the recipient address or scan QR code\n3. Select the token and network\n4. Enter the amount\n5. Review the transaction details and gas fee\n6. Confirm the transaction\n\nAlways double-check the recipient address before confirming!",
    category: "transactions"
  },
  {
    question: "Why is my transaction pending?",
    answer: "Transactions may be pending due to:\n- Network congestion\n- Low gas fee set\n- High demand on the blockchain\n\nYou can speed up the transaction or cancel it depending on the network status.",
    category: "transactions"
  },
  {
    question: "Can I reverse a transaction?",
    answer: "NO. Once a blockchain transaction is confirmed, it cannot be reversed. This is a fundamental feature of blockchain technology. Always verify the recipient address and amount before confirming any transaction.",
    category: "transactions"
  },
  {
    question: "What are gas fees?",
    answer: "Gas fees are payments made to blockchain network validators for processing your transaction. These fees vary based on network congestion and transaction complexity. Zam Wallet does not profit from gas fees.",
    category: "transactions"
  },
  
  // Swap
  {
    question: "How do I swap tokens?",
    answer: "1. Go to the Swap page\n2. Select the token you want to sell\n3. Select the token you want to buy\n4. Enter the amount\n5. Review the exchange rate and fees\n6. Confirm the swap\n\nSwaps are executed through decentralized exchanges (DEX).",
    category: "swap"
  },
  {
    question: "What is slippage?",
    answer: "Slippage is the difference between the expected price and the actual price at which a trade executes. Due to market volatility, the final price may differ slightly from the quoted price. You can adjust slippage tolerance in settings.",
    category: "swap"
  },
  
  // Staking
  {
    question: "What is ZAMD Staking?",
    answer: "ZAMD Staking allows you to lock your ZAMD tokens to earn rewards. The current APY is 18%, with a 14-day lock period. Staking helps secure the network while earning passive income.",
    category: "staking"
  },
  {
    question: "When can I withdraw my staked tokens?",
    answer: "ZAMD Staking has a 14-day lock period. After the lock period ends, you can withdraw your staked tokens. Early withdrawal may incur penalties depending on the protocol rules.",
    category: "staking"
  },
  
  // Networks
  {
    question: "Which networks does Zam Wallet support?",
    answer: "Zam Wallet supports 7 blockchain networks:\n- Polygon (POL)\n- Ethereum (ETH)\n- Arbitrum (ARB)\n- Base (BASE)\n- Optimism (OP)\n- BNB Chain (BNB)\n- Celo (CELO)",
    category: "networks"
  },
  {
    question: "How do I switch networks?",
    answer: "Click the network selector in the header or use the network dropdown when sending/swap transactions. Make sure you're connected to the correct network for the token you're using.",
    category: "networks"
  },
  
  // Support
  {
    question: "How do I contact support?",
    answer: "You can reach our support team at:\n- Email: support@zamwallet.io\n- Website: https://zamwallet.io\n\nPlease note: Our team will NEVER ask for your seed phrase or private keys.",
    category: "support"
  },
  {
    question: "Why isn't my transaction going through?",
    answer: "Common reasons:\n1. Insufficient balance for gas fees\n2. Network congestion\n3. Wrong network selected\n4. Token not supported on selected network\n\nTry increasing gas fee or switching to a less congested network.",
    category: "support"
  }
];

export default function HelpFAQ() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories: { id: string; label: string; icon: LucideIcon }[] = [
    { id: "all", label: "All Questions", icon: HelpCircle },
    { id: "basics", label: "Wallet Basics", icon: Wallet },
    { id: "security", label: "Security", icon: Lock },
    { id: "transactions", label: "Transactions", icon: Send },
    { id: "swap", label: "Swap", icon: Coins },
    { id: "staking", label: "Staking", icon: AlertTriangle },
    { id: "networks", label: "Networks", icon: Coins },
    { id: "support", label: "Support", icon: Mail },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <div className="w-16 h-16 bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] rounded-full flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-slate-900" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Help & FAQ</h1>
          <p className="text-slate-400">Find answers to common questions about Zam Wallet</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#06d6a0] focus:border-transparent"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  activeCategory === cat.id 
                    ? "bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] text-slate-900 font-semibold"
                    : "bg-slate-800/50 border border-white/10 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No questions found. Try a different search term.</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-2xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <ChevronLeft className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${expandedFAQ === index ? "rotate-90" : ""}`} />
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-4 text-slate-300 whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-r from-[#06d6a0]/10 to-[#00b4d8]/10 border border-[#06d6a0]/20 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-slate-300 mb-4">Our support team is here to help</p>
          <a 
            href="mailto:support@zamwallet.io"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-[rgba(6,214,160,0.3)] transition-all"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
          <p className="text-slate-500 text-sm mt-4">
            Note: Our team will NEVER ask for your seed phrase or private keys
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
            <Link href="/risk" className="text-slate-400 hover:text-white transition-colors text-sm">
              Risk Disclosures
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
