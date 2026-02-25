import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e17]">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 animate-pulse relative">
          <img 
            src="/zamd-logo.png" 
            alt="Zam Wallet" 
            className="w-full h-full object-contain"
          />
        </div>
        <Spinner size="lg" />
        <p className="mt-4 text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
