"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Cookie, X, Check } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("zam-cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("zam-cookie-consent", JSON.stringify(consent));
    setShowBanner(false);
    setShowModal(false);
  };

  const savePreferences = () => {
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("zam-cookie-consent", JSON.stringify(consent));
    setShowBanner(false);
    setShowModal(false);
  };

  const rejectNonEssential = () => {
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("zam-cookie-consent", JSON.stringify(consent));
    setShowBanner(false);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Cookie className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white mb-4">Cookie Policy</h1>
          <p className="text-slate-400">Learn how Zam Wallet uses cookies</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">What are Cookies?</h2>
            <p className="text-slate-300">Cookies are small text files stored on your device when you visit websites.</p>
          </div>

          <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">How Zam Wallet Uses Cookies</h2>
            <div className="space-y-4">
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-white">Essential Cookies</h3>
                </div>
                <p className="text-slate-400 text-sm ml-7">Required for wallet to function. Cannot be disabled.</p>
              </div>
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" checked={preferences.analytics} onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})} className="w-4 h-4 rounded" />
                  <h3 className="font-semibold text-white">Analytics Cookies</h3>
                </div>
                <p className="text-slate-400 text-sm ml-7">Help us improve the service.</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" checked={preferences.marketing} onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})} className="w-4 h-4 rounded" />
                  <h3 className="font-semibold text-white">Marketing Cookies</h3>
                </div>
                <p className="text-slate-400 text-sm ml-7">Relevant advertisements.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-2xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Managing Your Preferences</h2>
            <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors">
              Manage Cookie Preferences
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => setShowModal(true)} className="text-[#06d6a0] hover:text-[#00b4d8] transition-colors">
            Update Cookie Preferences
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-500 text-sm">© 2026 Zam Wallet. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <Link href="/terms" className="text-slate-400 hover:text-white text-sm">Terms</Link>
            <Link href="/privacy" className="text-slate-400 hover:text-white text-sm">Privacy</Link>
            <Link href="/risk" className="text-slate-400 hover:text-white text-sm">Risk</Link>
          </div>
        </div>
      </main>

      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-white/10 p-4 z-50">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-300 text-sm">We use cookies to improve your experience.</p>
            <div className="flex gap-2">
              <button onClick={rejectNonEssential} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg">Essential Only</button>
              <button onClick={acceptAll} className="px-4 py-2 bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] text-slate-900 text-sm font-semibold rounded-lg">Accept All</button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Cookie Preferences</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div><h4 className="font-semibold text-white">Essential</h4></div>
                <input type="checkbox" checked disabled className="w-5 h-5 rounded" />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div><h4 className="font-semibold text-white">Analytics</h4></div>
                <input type="checkbox" checked={preferences.analytics} onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})} className="w-5 h-5 rounded" />
              </div>
              <div className="flex items-center justify-between py-3">
                <div><h4 className="font-semibold text-white">Marketing</h4></div>
                <input type="checkbox" checked={preferences.marketing} onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})} className="w-5 h-5 rounded" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-3 bg-slate-700 text-white font-semibold rounded-xl">Cancel</button>
              <button onClick={savePreferences} className="flex-1 px-4 py-3 bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] text-slate-900 font-semibold rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
