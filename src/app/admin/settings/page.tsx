"use client";

import React, { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Building,
  Palette,
  CheckCircle2,
  Save,
  Globe,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/firebase/auth-context";

export default function AdminSettingsPage() {
  const { user, mongoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"account" | "security" | "notifications" | "business" | "appearance">("account");
  const [saved, setSaved] = useState(false);

  const [businessName, setBusinessName] = useState("Rent a Ride Mobility Technologies Pvt Ltd");
  const [adminPhone, setAdminPhone] = useState("+91 98390 12345");
  const [currency, setCurrency] = useState("INR (₹)");
  const [gstRate, setGstRate] = useState("18%");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "account", label: "Account Profile", icon: User },
    { id: "security", label: "Security & Access", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "business", label: "Business & Hub Settings", icon: Building },
    { id: "appearance", label: "Platform Branding", icon: Palette },
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-1">
          Administration Console
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
          Platform Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure administrator accounts, regional business rules, tax rates, and alert channels.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>System configuration changes saved successfully!</span>
        </div>
      )}

      {/* Main Settings Card with Left Nav Tabs */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden flex flex-col md:flex-row">
        {/* Left Tab Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 p-4 space-y-1 bg-slate-50/50 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                  active
                    ? "bg-[#101827] text-white shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === "account" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#172033]">Admin Profile Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Administrator Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.displayName || mongoUser?.name || "Shriyam"}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-[#172033]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Direct Support Phone
                    </label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-[#172033]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    System Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || "admin@rentaride.com"}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-400"
                  />
                </div>
              </div>
            )}

            {activeTab === "business" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#172033]">Regional Business & Tax Operations</h3>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Registered Legal Entity
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-[#172033]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Operating Currency
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currency}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Fleet GST Rate
                    </label>
                    <input
                      type="text"
                      value={gstRate}
                      onChange={(e) => setGstRate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-[#172033]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Primary Operational Hub
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Civil Lines Hub, Prayagraj, Uttar Pradesh 211001"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600"
                  />
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#172033]">Security & Access Management</h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-[#172033]">Two-Factor Authentication (2FA)</p>
                      <p className="text-[11px] text-slate-500">Require OTP validation for admin console logins</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Enforced
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-[#172033]">Database Encryption at Rest</p>
                      <p className="text-[11px] text-slate-500">AES-256 automated volume encryption on MongoDB Atlas</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#172033]">Telemetry Notification Channels</h3>
                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[#172033]">Instant Email Notifications</span>
                    <span className="text-[11px] text-slate-500">Receive booking vouchers and new fleet reservations via email</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[#172033]">SMS / WhatsApp Dispatch Alerts</span>
                    <span className="text-[11px] text-slate-500">Send real-time pickup confirmations directly to UP drivers</span>
                  </div>
                </label>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#172033]">Platform Design Language</h3>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#101827]" />
                    <span className="w-3 h-3 rounded-full bg-[#10B981]" />
                    <span className="w-3 h-3 rounded-full bg-[#F7F9FC] border border-slate-300" />
                    <span className="text-xs font-bold text-[#172033] ml-2">Clean Mobility Theme</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Deep Navy (`#101827`), Emerald Green (`#10B981`), Crisp White Cards, and Clean `#F7F9FC` background matching high-end car-rental SaaS standards.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#101827] hover:bg-[#172033] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-emerald-400" />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
