"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSignerStatus, useAuthModal } from "@account-kit/react";
import { Spinner } from "@/components/ui/Spinner";
import { DeveloperLoginModal } from "@/components/auth/DeveloperLoginModal";
import { Key, Wallet } from "lucide-react";
import Link from "next/link";

// 7 Networks data - using local logos from public folder
const networks = [
  { name: "Polygon", image: "/matic.png", symbol: "POL" },
  { name: "Arbitrum", image: "/arbitrum.png", symbol: "ARB" },
  { name: "Base", image: "/Base.png", symbol: "BASE" },
  { name: "Optimism", image: "/optimism.png", symbol: "OP" },
  { name: "Ethereum", image: "/Ethereum.png", symbol: "ETH" },
  { name: "BNB Chain", image: "https://cryptologos.cc/logos/bnb-bnb-logo.svg", symbol: "BNB" },
  { name: "Celo", image: "https://cryptologos.cc/logos/celo-celo-logo.svg", symbol: "CELO" },
];

// Features data - Web Features
const webFeatures = [
  {
    emoji: "🔄",
    title: "Instant Swaps",
    desc: "Swap tokens across all 7 networks with the best rates. Cross-chain swaps made simple.",
    color: "rgba(6, 214, 160, 0.1)",
  },
  {
    emoji: "📈",
    title: "Staking",
    desc: "Earn up to 18% APY on your ZAMD tokens. Stake directly from your wallet.",
    color: "rgba(0, 180, 216, 0.1)",
  },
  {
    emoji: "💳",
    title: "Buy Crypto with Fiat",
    desc: "Instantly buy crypto using your credit/debit card. Get started in minutes.",
    color: "rgba(130, 71, 229, 0.1)",
  },
  {
    emoji: "🔗",
    title: "Multi-Chain Support",
    desc: "One wallet, 7 networks. Ethereum, Polygon, Arbitrum, Base, Optimism, BNB, Celo.",
    color: "rgba(255, 4, 32, 0.1)",
  },
  {
    emoji: "🔒",
    title: "Biometric Security",
    desc: "Your device, your keys. Advanced encryption keeps your assets safe.",
    color: "rgba(0, 82, 255, 0.1)",
  },
  {
    emoji: "🌙",
    title: "Dark & Light Mode",
    desc: "Choose your vibe. Beautiful themes that match your style.",
    color: "rgba(98, 126, 234, 0.1)",
  },
];

// App Features - Coming Soon
const appFeatures = [
  {
    emoji: "📤",
    title: "Instant Transfers",
    desc: "Send and receive crypto in seconds. No waiting, no complications.",
    color: "rgba(6, 214, 160, 0.1)",
    status: "soon",
  },
  {
    emoji: "🔔",
    title: "Real-Time Alerts",
    desc: "Stay informed with instant notifications for every transaction.",
    color: "rgba(255, 4, 32, 0.1)",
    status: "soon",
  },
  {
    emoji: "📊",
    title: "Full Transaction History",
    desc: "Complete visibility into your crypto journey with detailed records.",
    color: "rgba(0, 82, 255, 0.1)",
    status: "soon",
  },
  {
    emoji: "🔐",
    title: "PIN Protection",
    desc: "Add an extra layer of security with a custom PIN code.",
    color: "rgba(130, 71, 229, 0.1)",
    status: "soon",
  },
];

// Tokens data
const tokens = [
  { name: "ZAMD", symbol: "Zam Dollar", logo: "/zamd-logo.png", desc: "Native Token" },
  { name: "USDC", symbol: "USD Coin", logo: "https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png", desc: "Stablecoin" },
  { name: "USDT", symbol: "Tether", logo: "https://assets.coingecko.com/coins/images/325/small/Tether.png", desc: "Stablecoin" },
  { name: "ETH", symbol: "Ethereum", logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png", desc: "Crypto" },
  { name: "POL", symbol: "Polygon", logo: "https://assets.coingecko.com/coins/images/4713/small/polygon.png", desc: "Crypto" },
];

// Security features
const securityFeatures = [
  {
    icon: "🔐",
    title: "You Hold The Keys",
    desc: "Your private keys never leave your device. You're the sole owner of your funds.",
    color: "rgba(6, 214, 160, 0.1)",
  },
  {
    icon: "👆",
    title: "Biometric Authentication",
    desc: "Use fingerprint or Face ID for quick and secure access to your wallet.",
    color: "rgba(0, 180, 216, 0.1)",
  },
  {
    icon: "🔢",
    title: "PIN Protection",
    desc: "Add an extra layer of security with a custom PIN code.",
    color: "rgba(130, 71, 229, 0.1)",
  },
  {
    icon: "🛡️",
    title: "Phishing Protection",
    desc: "Built-in safeguards against scams and malicious websites.",
    color: "rgba(255, 4, 32, 0.1)",
  },
];

export default function LandingPage() {
  const signerStatus = useSignerStatus();
  const { isConnected, isInitializing } = signerStatus;
  const { openAuthModal } = useAuthModal();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginChoice, setShowLoginChoice] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle login choice
  const handleCreateWallet = () => {
    setShowLoginChoice(false);
    openAuthModal();
  };

  const handleImportWallet = () => {
    setShowLoginChoice(false);
    setShowDevLogin(true);
  };

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    }
  }, [isConnected, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Loading state
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e17]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 animate-pulse relative">
            <Image src="/zamd-logo.png" alt="Zam Wallet" fill className="object-contain" />
          </div>
          <Spinner size="lg" />
          <p className="mt-4 text-slate-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white overflow-x-hidden font-sans">
      {/* ─── Background Effects ─── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[rgba(6,214,160,0.07)] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[rgba(0,180,216,0.06)] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-[rgba(130,71,229,0.05)] rounded-full blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      {/* ─── Navigation ─── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0e17]/90 backdrop-blur-xl border-b border-white/5" : ""}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl relative">
              <Image src="/zamd-logo.png" alt="Zam Wallet" fill className="object-contain" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] bg-clip-text text-transparent">
              Zam Wallet
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Features</a>
            <a href="#networks" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Networks</a>
            <a href="#tokens" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Tokens</a>
            <a href="#security" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">Security</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLoginChoice(true)}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] text-[#0a0e17] text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-[rgba(6,214,160,0.3)]"
            >
              Launch App
            </button>
            
            <button 
              onClick={() => { console.log('Menu clicked'); setMenuOpen(!menuOpen); }}
              className="md:hidden relative z-50 flex flex-col gap-1.5 p-2"
              aria-label="Menu"
              type="button"
            >
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#0d1b2a] border-t border-white/5 relative z-40">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-400 hover:text-white font-medium">Features</a>
              <a href="#networks" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-400 hover:text-white font-medium">Networks</a>
              <a href="#tokens" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-400 hover:text-white font-medium">Tokens</a>
              <a href="#security" onClick={() => setMenuOpen(false)} className="block text-sm text-slate-400 hover:text-white font-medium">Security</a>
              <button
                onClick={() => { setMenuOpen(false); openAuthModal(); }}
                className="w-full py-3 bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] text-[#0a0e17] font-bold rounded-xl"
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(6,214,160,0.2)] bg-[rgba(6,214,160,0.08)] text-[#06d6a0] text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-[#06d6a0] animate-pulse" />
            Now Available on Android
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight tracking-tight">
            Your Crypto.<br />
            <span className="bg-gradient-to-r from-[#06d6a0] via-[#00b4d8] to-[#8247e5] bg-clip-text text-transparent">
              One Wallet.
            </span>
            <br />
            All Chains.
          </h1>

          <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
            The secure, multi-chain wallet supporting ZAMD, USDC, USDT & all tokens across 7 networks. 
            Swap, Stake, and Buy crypto with fiat — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => setShowLoginChoice(true)}
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] text-[#0a0e17] font-bold rounded-2xl transition-all hover:shadow-xl hover:shadow-[rgba(6,214,160,0.3)] hover:scale-105 text-lg"
            >
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-4 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold rounded-2xl transition-all text-lg"
            >
              Learn More
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 pt-8 border-t border-white/5">
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] bg-clip-text text-transparent">7</h3>
              <p className="text-sm text-slate-500 mt-1">Networks</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] bg-clip-text text-transparent">3</h3>
              <p className="text-sm text-slate-500 mt-1">Platforms</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] bg-clip-text text-transparent">18%</h3>
              <p className="text-sm text-slate-500 mt-1">Staking APY</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] bg-clip-text text-transparent">100%</h3>
              <p className="text-sm text-slate-500 mt-1">Secure</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Web Features (Live) ─── */}
      <section id="features" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#06d6a0] text-sm font-semibold uppercase tracking-widest mb-3">Web App Features</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Powerful features<br />at your fingertips</h2>
            <p className="text-slate-400 max-w-xl mx-auto">All features available now on the web platform.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {webFeatures.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-[#111827] border border-white/5 hover:border-[rgba(6,214,160,0.15)] transition-all hover:scale-[1.02] cursor-default"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: feature.color }}
                >
                  {feature.emoji}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Networks Section ─── */}
      <section id="networks" className="py-24 bg-white/[0.02] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#06d6a0] text-sm font-semibold uppercase tracking-widest mb-3">Networks</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">7 Networks.<br />One Address.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Your wallet works across all major EVM chains. Same address, different networks.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {networks.map((network, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-4 bg-[#111827] border border-white/5 rounded-2xl min-w-[120px] hover:border-[rgba(6,214,160,0.2)] hover:-translate-y-1 transition-all"
              >
                <img src={network.image} alt={network.name} className="w-10 h-10 rounded-full" />
                <span className="text-xs font-semibold text-white">{network.symbol}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tokens Section ─── */}
      <section id="tokens" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#06d6a0] text-sm font-semibold uppercase tracking-widest mb-3">Supported Tokens</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">All Your Tokens.<br />One Wallet.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Support for ZAMD, all ERC-20 tokens, and stablecoins across all 7 networks.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {tokens.map((token, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 p-5 bg-[#111827] border border-white/5 rounded-2xl hover:border-[rgba(6,214,160,0.2)] hover:-translate-y-1 transition-all min-w-[120px]"
              >
                <img src={token.logo} alt={token.name} className="w-12 h-12 rounded-full" />
                <h4 className="text-base font-bold text-white">{token.name}</h4>
                <p className="text-xs text-slate-500">{token.desc}</p>
              </div>
            ))}
            <div className="flex items-center justify-center p-5 bg-[#111827] border border-white/5 border-dashed rounded-2xl min-w-[120px]">
              <span className="text-sm text-slate-500">+ More</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── App Features (Coming Soon) ─── */}
      <section id="app-features" className="py-24 bg-white/[0.02] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-sm font-semibold uppercase tracking-widest mb-3">Mobile App</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Coming Soon to<br />iOS & Android</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Additional features coming to the mobile app.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {appFeatures.map((feature, index) => (
              <div
                key={index}
                className="group p-5 rounded-2xl bg-[#111827] border border-white/5 relative overflow-hidden"
              >
                <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  SOON
                </span>
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: feature.color }}
                >
                  {feature.emoji}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Security Section ─── */}
      <section id="security" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#06d6a0] text-sm font-semibold uppercase tracking-widest mb-3">Security</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Your keys.<br />Your crypto.</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Zam Wallet is fully self-custodial. We never have access to your private keys or funds.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-5 p-6 bg-[#111827] border border-white/5 rounded-2xl hover:bg-[#1a2332] transition-all"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: feature.color }}
                >
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">{feature.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Download CTA ─── */}
      <section id="download" className="py-24 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#111827] border border-white/5 p-8 sm:p-12 text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[rgba(6,214,160,0.06)] rounded-full blur-[100px]" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to take control<br />of your crypto?
              </h2>
              <p className="text-slate-400 mb-10">
                Start using the web app now, or download the mobile app when available.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setShowLoginChoice(true)}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] text-[#0a0e17] font-bold rounded-xl hover:shadow-lg hover:shadow-[rgba(6,214,160,0.3)] transition-all"
                >
                  Launch Web App
                </button>
                <a
                  href="#"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d="M17.523 0H6.477C2.9 0 0 2.9 0 6.477v11.046C0 21.1 2.9 24 6.477 24h11.046C21.1 24 24 21.1 24 17.523V6.477C24 2.9 21.1 0 17.523 0zM7.5 19.5l-3-3h2v-4h2v4h2l-3 3zm6-7h-2v4h-2v-4h-2l3-3 3 3zm3.5 7.5h-2v-8h2v8z"/>
                  </svg>
                  <div className="text-left">
                    <small className="text-xs text-slate-500 block">Download</small>
                    <span className="text-sm font-bold text-white">APK</span>
                  </div>
                </a>
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-xl opacity-50 cursor-not-allowed">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.34-2.35 1.04-3.18z"/>
                  </svg>
                  <div className="text-left">
                    <small className="text-xs text-slate-500 block">Coming</small>
                    <span className="text-sm font-bold text-white">iOS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/zamd-logo.png" alt="Zam Wallet" className="w-8 h-8 rounded-lg" />
            <span className="font-semibold text-slate-400">Zam Wallet</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Help & FAQ</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
          <p className="text-sm text-slate-600">© 2026 Zam Wallet. All rights reserved.</p>
          <div className="flex gap-4 mt-4 text-sm">
            <Link href="/terms" className="text-slate-500 hover:text-[#06d6a0] transition-colors">Terms</Link>
            <Link href="/privacy" className="text-slate-500 hover:text-[#06d6a0] transition-colors">Privacy</Link>
            <Link href="/risk" className="text-slate-500 hover:text-[#06d6a0] transition-colors">Risk</Link>
            <Link href="/kyc" className="text-slate-500 hover:text-[#06d6a0] transition-colors">KYC</Link>
            <Link href="/help" className="text-slate-500 hover:text-[#06d6a0] transition-colors">Help</Link>
            <Link href="/cookies" className="text-slate-500 hover:text-[#06d6a0] transition-colors">Cookies</Link>
          </div>
        </div>
      </footer>

      <DeveloperLoginModal isOpen={showDevLogin} onClose={() => setShowDevLogin(false)} />
      
      {/* Login Choice Modal */}
      {showLoginChoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginChoice(false)} />
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 space-y-4">
              <h2 className="text-xl font-bold text-white text-center">Choose How to Continue</h2>
              <p className="text-slate-400 text-sm text-center">Select how you want to access your wallet</p>
              
              <div className="space-y-3 mt-6">
                <button
                  onClick={handleCreateWallet}
                  className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] rounded-xl hover:shadow-lg hover:shadow-[rgba(6,214,160,0.3)] transition-all group"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#0a0e17]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-[#0a0e17]">Create New Wallet</p>
                    <p className="text-xs text-[#0a0e17]/70">Connect with email or social</p>
                  </div>
                </button>
                
                <button
                  onClick={handleImportWallet}
                  className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                >
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                    <Key className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white">Import Existing Wallet</p>
                    <p className="text-xs text-slate-400">Use private key or seed phrase</p>
                  </div>
                </button>
              </div>
              
              <button
                onClick={() => setShowLoginChoice(false)}
                className="w-full mt-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
