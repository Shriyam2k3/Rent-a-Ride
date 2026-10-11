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
        <span className="text-xs font-bold uppercase tracking-wider text-[#173F2D] bg-[#EEF5EF] px-2.5 py-1 rounded-md border border-[#DDE6DF] inline-block mb-1">
          Administration Console
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18251D] tracking-tight">
          Platform Settings
        </h1>
        <p className="text-xs text-[#66736A] mt-1">
          Configure administrator accounts, regional business rules, tax rates, and alert channels.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#173F2D] shrink-0" />
          <span>System configuration changes saved successfully!</span>
        </div>
      )}

      {/* Main Settings Card with Left Nav Tabs */}
      <div className="bg-white border border-[#DDE6DF] rounded-3xl shadow-xs overflow-hidden flex flex-col md:flex-row">
        {/* Left Tab Nav */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#DDE6DF] p-4 space-y-1 bg-[#F7FAF7] shrink-0">
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
                    ? "bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF] font-bold shadow-2xs"
                    : "text-[#66736A] hover:text-[#18251D] hover:bg-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-[#173F2D]" : "text-[#66736A]"}`} />
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
                <h3 className="font-bold text-sm text-[#18251D]">Admin Profile Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
                      Administrator Name
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.displayName || mongoUser?.name || "Admin"}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
                      Direct Support Phone
                    </label>
                    <input
                      type="text"
                      value={adminPhone}
                      onChange={(e) => setAdminPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
                    System Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || "admin@rentaride.com"}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#66736A] opacity-75"
                  />
                </div>
              </div>
            )}

            {activeTab === "business" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#18251D]">Regional Business &amp; Tax Operations</h3>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
                    Registered Legal Entity
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
                      Operating Currency
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currency}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] font-bold opacity-75"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
                      Fleet GST Rate
                    </label>
                    <input
                      type="text"
                      value={gstRate}
                      onChange={(e) => setGstRate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#18251D] focus:outline-hidden focus:border-[#173F2D]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#66736A] mb-1">
                    Primary Operational Hub
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Civil Lines Hub, Prayagraj, Uttar Pradesh 211001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-xs text-[#66736A] opacity-75"
                  />
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#18251D]">Security &amp; Access Management</h3>
                <div className="p-4 rounded-2xl bg-[#F7FAF7] border border-[#DDE6DF] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-[#18251D]">Two-Factor Authentication (2FA)</p>
                      <p className="text-[11px] text-[#66736A]">Require OTP validation for admin console logins</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#237447] bg-[#EEF5EF] px-2 py-0.5 rounded border border-[#DDE6DF]">
                      Enforced
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7FAF7] border border-[#DDE6DF] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-[#18251D]">Database Encryption at Rest</p>
                      <p className="text-[11px] text-[#66736A]">AES-256 automated volume encryption on MongoDB Atlas</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#237447] bg-[#EEF5EF] px-2 py-0.5 rounded border border-[#DDE6DF]">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#18251D]">Telemetry Notification Channels</h3>
                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#DDE6DF] bg-[#F7FAF7] hover:border-[#173F2D]/30 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#173F2D] rounded"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[#18251D]">Instant Email Notifications</span>
                    <span className="text-[11px] text-[#66736A]">Receive booking vouchers and new fleet reservations via email</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-2xl border border-[#DDE6DF] bg-[#F7FAF7] hover:border-[#173F2D]/30 cursor-pointer transition-all">
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#173F2D] rounded"
                  />
                  <div>
                    <span className="block text-xs font-bold text-[#18251D]">SMS / WhatsApp Dispatch Alerts</span>
                    <span className="text-[11px] text-[#66736A]">Send real-time pickup confirmations directly to UP drivers</span>
                  </div>
                </label>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-[#18251D]">Platform Design Language</h3>
                <div className="p-4 rounded-2xl bg-[#F7FAF7] border border-[#DDE6DF] space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-white border border-[#DDE6DF]" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#EEF5EF] border border-[#DDE6DF]" />
                    <span className="w-3.5 h-3.5 rounded-full bg-[#173F2D]" />
                    <span className="text-xs font-bold text-[#18251D] ml-2">Pure White &amp; Deep Forest Green Design System</span>
                  </div>
                  <p className="text-[11px] text-[#66736A] leading-relaxed">
                    Pure white primary background (`#FFFFFF`), subtle secondary (`#F7FAF7`), sage highlight surfaces (`#EEF5EF`), and deep forest green (`#173F2D`) primary accents.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#DDE6DF] flex items-center justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
