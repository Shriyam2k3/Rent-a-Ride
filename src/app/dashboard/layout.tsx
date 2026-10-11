"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth-context";
import { Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, demoLogin } = useAuth();
  const [bypassing, setBypassing] = useState(false);

  if (loading || bypassing) {
    return (
      <div className="min-h-screen bg-[#F7FAF7] flex items-center justify-center text-[#66736A]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#173F2D]" />
          <p className="text-xs font-bold text-[#66736A] uppercase tracking-wider">Loading Customer Cockpit...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F7FAF7] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-[#DDE6DF] rounded-3xl p-8 text-center shadow-xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-3 py-1 rounded-md border border-[#DDE6DF] inline-block mb-3">
            Authentication Required
          </span>

          <h2 className="text-2xl font-black text-[#18251D] tracking-tight">
            Sign In to Customer Portal
          </h2>
          <p className="text-xs text-[#66736A] mt-2 leading-relaxed">
            Please sign in with your customer account to view your active rental, digital smart key, and real-time vehicle telemetry.
          </p>

          <div className="pt-6 space-y-3">
            <button
              onClick={async () => {
                setBypassing(true);
                await demoLogin("user");
                setBypassing(false);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#173F2D]/10 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Instant Customer Demo Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/login?redirect=/dashboard"
              className="w-full py-3 px-4 rounded-xl border border-[#DDE6DF] hover:bg-[#F7FAF7] text-[#18251D] font-bold text-xs flex items-center justify-center transition-colors"
            >
              <span>Sign In with Email / Google</span>
            </Link>

            <Link
              href="/"
              className="w-full py-2.5 px-4 text-[#66736A] hover:text-[#18251D] font-semibold text-xs flex items-center justify-center transition-colors"
            >
              <span>Back to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FAF7] text-[#18251D] antialiased selection:bg-[#173F2D] selection:text-white pb-24">
      {children}
    </div>
  );
}
