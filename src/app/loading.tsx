export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0e17]">
      {/* Crypto Icons Animation */}
      <div className="flex gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center animate-bounce" style={{ animationDelay: '0ms' }}>
          <span className="text-2xl">₿</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center animate-bounce" style={{ animationDelay: '150ms' }}>
          <span className="text-2xl">Ξ</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-purple-400 flex items-center justify-center animate-bounce" style={{ animationDelay: '300ms' }}>
          <span className="text-2xl">◈</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-pink-400 flex items-center justify-center animate-bounce" style={{ animationDelay: '450ms' }}>
          <span className="text-2xl">♦</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center animate-bounce" style={{ animationDelay: '600ms' }}>
          <span className="text-2xl">◎</span>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Loading Zam Wallet</h2>
        <p className="text-slate-400 text-sm">Preparing your crypto experience...</p>
      </div>
      
      {/* Loading Bar */}
      <div className="w-64 h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#06d6a0] to-[#00b4d8] animate-pulse w-full"></div>
      </div>
    </div>
  );
}
