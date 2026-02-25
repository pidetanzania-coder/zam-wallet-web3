export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0e17]">
      {/* Crypto Icons Animation */}
      <div className="flex gap-3 mb-8 flex-wrap justify-center">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center animate-bounce" style={{ animationDelay: '0ms' }}>
          <span className="text-xl">₿</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center animate-bounce" style={{ animationDelay: '100ms' }}>
          <span className="text-xl">Ξ</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center animate-bounce" style={{ animationDelay: '200ms' }}>
          <span className="text-xl">◈</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center animate-bounce" style={{ animationDelay: '300ms' }}>
          <span className="text-xl">♦</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center animate-bounce" style={{ animationDelay: '400ms' }}>
          <span className="text-xl">◎</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center animate-bounce" style={{ animationDelay: '500ms' }}>
          <span className="text-xl">⟐</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center animate-bounce" style={{ animationDelay: '600ms' }}>
          <span className="text-xl">⛽</span>
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="text-center px-4">
        <h2 className="text-xl font-bold text-white mb-2">Please wait...</h2>
        <p className="text-slate-400 text-sm">Connecting to blockchain</p>
      </div>
      
      {/* Loading Bar */}
      <div className="w-64 h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[#06d6a0] via-[#00b4d8] to-[#8247e5] animate-pulse w-full"></div>
      </div>
    </div>
  );
}
