"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/firebase/auth-context";
import { User, Mail, Phone, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { user, mongoUser } = useAuth();

  const [name, setName] = useState(
    user?.displayName || mongoUser?.name || "Customer"
  );
  const [phone, setPhone] = useState(mongoUser?.phone || "+91 98123 45678");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-2.5 py-1 rounded-md border border-[#DDE6DF] inline-block mb-1">
          Account Settings
        </span>
        <h1 className="text-3xl font-extrabold text-[#18251D] tracking-tight mt-0.5">My Profile</h1>
        <p className="text-xs text-[#66736A] mt-1">
          Manage your personal customer details, contact preferences, and verified status.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#173F2D] shrink-0" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-[#DDE6DF] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#DDE6DF]">
          <div className="w-16 h-16 rounded-2xl bg-[#173F2D] text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#18251D]">{name}</h3>
            <p className="text-xs text-[#66736A]">{user?.email || "customer@rentaride.com"}</p>
            <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF] uppercase">
              <ShieldCheck className="w-3 h-3 text-[#173F2D]" />
              <span>Verified Customer • {mongoUser?.role === "admin" ? "Platform Admin" : "Standard Customer"}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#66736A] mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#66736A]" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs font-medium text-[#18251D] placeholder-[#66736A] focus:outline-hidden focus:border-[#173F2D]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#66736A] mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#66736A]" />
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs font-medium text-[#18251D] placeholder-[#66736A] focus:outline-hidden focus:border-[#173F2D]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#66736A] mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#66736A]" />
              Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#66736A] cursor-not-allowed opacity-75"
            />
            <p className="text-[11px] text-[#66736A] mt-1">
              Primary email managed via your authentication provider.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
