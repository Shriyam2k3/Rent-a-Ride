"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  Car,
  Bell,
  Key,
  Gauge,
  Calendar,
  Headphones,
  Lock,
  Unlock,
  Power,
  Fan,
  Navigation,
  ShieldCheck,
  Plus,
  QrCode,
  PhoneCall,
  Plane,
  RefreshCw,
  Clock,
  Compass,
  ArrowRight,
  Send,
  Zap,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Fuel,
  Activity,
  Award,
  Search,
} from "lucide-react";

type TabType = "smart_key" | "telemetry" | "bookings" | "support";

export default function CustomerDashboardPage() {
  const { user, mongoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("smart_key");

  // Interactive Digital Key state
  const [isLocked, setIsLocked] = useState(true);
  const [engineStarted, setEngineStarted] = useState(false);
  const [preCoolActive, setPreCoolActive] = useState(true);
  const [locateActive, setLocateActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bookings sub-filter state
  const [bookingFilter, setBookingFilter] = useState<"active" | "completed">("active");

  // Concierge chat state
  const [chatMessages, setChatMessages] = useState([
    {
      id: "1",
      sender: "bot",
      text: "Hello, Aakash! I see you are on Trip #RAR-8492 near Civil Lines. How can I assist your drive right now?",
      time: "Just now",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: text,
      time: "Just now",
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");

    // Simulate smart AI response
    setTimeout(() => {
      let reply = "Your request has been logged with Prayagraj Fleet Operations. A concierge agent is monitoring your vehicle telematics.";
      if (text.toLowerCase().includes("extend")) {
        reply = "Trip #RAR-8492 extension approved! 4 extra hours added at ₹1,200. Updated return cutoff: Oct 28, 12:00 AM.";
      } else if (text.toLowerCase().includes("damage")) {
        reply = "Damage incident desk alerted. SafeGuard Pro coverage confirmed with zero deductible. Please take 2 photos if safe.";
      } else if (text.toLowerCase().includes("toll")) {
        reply = "Your NETC FASTag balance is ₹1,850. All Yamuna & Purvanchal expressway tolls auto-settle seamlessly.";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: reply,
          time: "Just now",
        },
      ]);
    }, 800);
  };

  const displayName = user?.displayName || mongoUser?.name || "Customer";
  const avatarUrl = user?.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

  return (
    <div className="max-w-md mx-auto sm:max-w-xl md:max-w-2xl px-3 sm:px-4 pt-3 pb-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="flex items-center justify-between py-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 leading-tight">Rent A Ride</h1>
            <p className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Prayagraj, UP
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 border border-white" />
          </button>

          <Link href="/dashboard/profile" className="block relative w-8 h-8 rounded-full overflow-hidden border border-slate-200">
            <Image src={avatarUrl} alt="Profile" fill className="object-cover" />
          </Link>
        </div>
      </header>

      {/* ========================================================= */}
      {/* TAB 1: SMART KEY (SCREENSHOT 1) */}
      {/* ========================================================= */}
      {activeTab === "smart_key" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Greeting Section */}
          <div>
            <p className="text-xs font-semibold text-slate-500">Current Active Trip</p>
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                Welcome back, {displayName.length > 10 ? `${displayName.slice(0, 10)}...` : displayName}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                KYC Verified
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200/70">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                VIP Platinum Member
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                BLE Connected
              </span>
            </div>
          </div>

          {/* ACTIVE CAR HERO CARD */}
          <div className="bg-gradient-to-b from-emerald-50/40 via-white to-white rounded-3xl p-4 sm:p-5 border border-emerald-100/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                  Sedan
                </span>
                <span className="text-xs font-bold text-slate-500">UP70-AX-9901</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                100% Ultra BLE Link
              </span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                BMW 3 Series 330i M Sport
              </h3>
              <p className="text-xs font-semibold text-slate-600 flex items-center gap-1 mt-1">
                <Navigation className="w-3 h-3 text-emerald-600" />
                Civil Lines Hub, Prayagraj
              </p>
            </div>

            {/* Car Photo Container */}
            <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80">
              <Image
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80"
                alt="BMW 3 Series"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Session • Ends in 18 hrs
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-emerald-800 text-[11px] font-bold shadow-xs">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  SafeGuard Pro
                </span>
              </div>
            </div>

            {/* 3 Telemetry Underneath Stats */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-[#eff6ff] p-2.5 rounded-2xl border border-blue-100/70 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fuel / Range</span>
                  <Fuel className="w-3 h-3 text-emerald-600" />
                </div>
                <p className="text-base font-black text-slate-900 mt-1">
                  540 <span className="text-[10px] font-normal text-slate-500">km</span>
                </p>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[84%]" />
                </div>
                <p className="text-[10px] font-bold text-emerald-700 mt-1">84% Remaining</p>
              </div>

              <div className="bg-[#eff6ff] p-2.5 rounded-2xl border border-blue-100/70 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tires</span>
                  <Activity className="w-3 h-3 text-emerald-600" />
                </div>
                <p className="text-base font-black text-slate-900 mt-1">
                  34 <span className="text-[10px] font-normal text-slate-500">PSI</span>
                </p>
                <div className="flex gap-0.5 mt-1.5">
                  <span className="h-1 flex-1 bg-emerald-500 rounded-full" />
                  <span className="h-1 flex-1 bg-emerald-500 rounded-full" />
                  <span className="h-1 flex-1 bg-emerald-500 rounded-full" />
                  <span className="h-1 flex-1 bg-emerald-500 rounded-full" />
                </div>
                <p className="text-[10px] font-bold text-emerald-700 mt-1">All 4 Balanced</p>
              </div>

              <div className="bg-[#eff6ff] p-2.5 rounded-2xl border border-blue-100/70 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Governor</span>
                  <Gauge className="w-3 h-3 text-amber-600" />
                </div>
                <p className="text-base font-black text-slate-900 mt-1">
                  100 <span className="text-[10px] font-normal text-slate-500">km/h</span>
                </p>
                <div className="w-full bg-slate-200 h-1 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-full w-[70%]" />
                </div>
                <p className="text-[10px] font-bold text-slate-600 mt-1">Sentinel Active</p>
              </div>
            </div>
          </div>

          {/* DIGITAL KEY PAD */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-emerald-600" />
                Digital Key Pad
              </h3>
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Near-Field Haptic Ready
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* 1. Doors Locked / Unlocked */}
              <button
                type="button"
                onClick={() => {
                  setIsLocked(!isLocked);
                  triggerToast(isLocked ? "Doors Unlocked! Ultrasonic chirp emitted." : "Doors Locked & Vehicle Armed!");
                }}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center hover:border-emerald-500 transition-all shadow-xs cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center transition-colors ${
                  isLocked ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}>
                  {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </div>
                <h4 className="text-xs font-black text-slate-900 mt-2">
                  {isLocked ? "Doors Locked" : "Doors Unlocked"}
                </h4>
                <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                  {isLocked ? "Tap to Unlock" : "Tap to Lock"}
                </p>
              </button>

              {/* 2. Remote Start */}
              <button
                type="button"
                onClick={() => {
                  setEngineStarted(!engineStarted);
                  triggerToast(engineStarted ? "Engine Standby Engaged" : "TwinPower Turbo Engine Started Remotely!");
                }}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center hover:border-blue-500 transition-all shadow-xs cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center transition-colors ${
                  engineStarted ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" : "bg-blue-100 text-blue-700"
                }`}>
                  <Power className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black text-slate-900 mt-2">Remote Start</h4>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                  {engineStarted ? "Engine Running" : "Engine Standby"}
                </p>
              </button>

              {/* 3. Pre-Cool */}
              <button
                type="button"
                onClick={() => {
                  setPreCoolActive(!preCoolActive);
                  triggerToast(preCoolActive ? "Cabin Climate Deactivated" : "Pre-Cooling Cabin to 21°C Active");
                }}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center hover:border-teal-500 transition-all shadow-xs cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center transition-colors ${
                  preCoolActive ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-500"
                }`}>
                  <Fan className={`w-5 h-5 ${preCoolActive ? "animate-spin" : ""}`} />
                </div>
                <h4 className="text-xs font-black text-slate-900 mt-2">Pre-Cool (21°C)</h4>
                <p className="text-[11px] font-bold text-emerald-600 mt-0.5">Cabin Climate Active</p>
              </button>

              {/* 4. Locate / Flash */}
              <button
                type="button"
                onClick={() => {
                  setLocateActive(true);
                  triggerToast("Hazard Lights Flashing & Horn Chirp Sounding!");
                  setTimeout(() => setLocateActive(false), 2500);
                }}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 text-center hover:border-indigo-500 transition-all shadow-xs cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center transition-colors ${
                  locateActive ? "bg-amber-100 text-amber-700 animate-pulse" : "bg-indigo-100 text-indigo-700"
                }`}>
                  <Navigation className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-black text-slate-900 mt-2">Locate / Flash</h4>
                <p className="text-[11px] font-bold text-slate-500 mt-0.5">Blink Lights & Beep</p>
              </button>
            </div>

            {/* 2 Action Buttons below Key Pad */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Link
                href="/cars"
                className="bg-white border border-slate-200/90 hover:bg-slate-50 text-slate-800 font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>Rent Another Car</span>
              </Link>

              <button
                type="button"
                onClick={() => triggerToast("Camera ready. Align the station QR code to finalize return inspection.")}
                className="bg-[#173F2D] hover:bg-[#2F7650] text-white font-bold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan QR Return</span>
              </button>
            </div>
          </div>

          {/* VIP CONCIERGE & SERVICES */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">VIP Concierge & Services</h3>
              <span className="text-xs font-bold text-emerald-600">24x7 Active</span>
            </div>

            <div className="space-y-2.5">
              {/* Card 1: SOS */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 font-black text-xs flex items-center justify-center shrink-0">
                    SOS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900">Roadside SOS & Tow</h4>
                      <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-black uppercase">Instant</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">Mechanic & patrol dispatched in ~10m</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab("support")}
                  className="bg-[#b91c1c] hover:bg-[#991b1b] text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>SOS</span>
                </button>
              </div>

              {/* Card 2: Airport Fast Track */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Bamrauli Airport VIP Fast-Track</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Valet handoff at Terminal 1 Gate 2</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              {/* Card 3: Doorstep Hub Swap */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Doorstep Hub Swap</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Exchange for SUV or Luxury EV on request</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            </div>
          </div>

          {/* PICKUP & RETURN SPOT */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Pickup & Return Spot</span>
              <span className="text-[11px] font-bold text-emerald-600">Geo-fenced Zone</span>
            </div>

            <div className="bg-[#eff6ff] rounded-2xl p-6 border border-blue-100/90 flex items-center justify-center text-center">
              <div className="bg-white px-4 py-2 rounded-full font-bold text-xs text-slate-800 shadow-sm border border-slate-200/60 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                <span>Civil Lines Station Hub</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TELEMETRY (SCREENSHOT 4) */}
      {/* ========================================================= */}
      {activeTab === "telemetry" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Live Telematics
                </span>
                <span className="text-xs font-bold text-slate-500">UP70-AX-9901</span>
              </div>
              <button
                type="button"
                onClick={() => triggerToast("OBD-II Telemetry stream synced from Prayagraj gateway.")}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                BMW 3 Series 330i M Sport
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Connected via OBD-II • Synced 12s ago</p>
            </div>

            {/* Car profile with badges */}
            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900">
              <Image
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80"
                alt="BMW Side Profile"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-bold text-white">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ECU Health: Pristine
                </span>
                <span className="text-slate-300 font-mono text-[10px]">Firmware v4.18.2</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-[#eff6ff] p-3 rounded-2xl flex items-center gap-3 border border-blue-100/70">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Trip Meter</span>
                  <span className="text-base font-black text-slate-900">42.8 km</span>
                </div>
              </div>

              <div className="bg-[#eff6ff] p-3 rounded-2xl flex items-center gap-3 border border-blue-100/70">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Engine On</span>
                  <span className="text-base font-black text-slate-900">1h 45m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Range & Propulsion */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Fuel className="w-4 h-4 text-emerald-600" />
                Range & Propulsion
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                High Efficiency
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900">540</span>
                <span className="text-xs font-semibold text-slate-500">km remaining</span>
              </div>
              <span className="text-xl font-black text-emerald-600">84%</span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[84%] rounded-full" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="bg-[#eff6ff] p-3 rounded-2xl border border-blue-100/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Trip Economy</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">14.8 km/l</span>
                <span className="text-[10px] font-bold text-emerald-700">+1.2 vs fleet avg</span>
              </div>

              <div className="bg-[#eff6ff] p-3 rounded-2xl border border-blue-100/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Fuel Reserve</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">49.5 Liters</span>
                <span className="text-[10px] text-slate-500">Capacity: 59 L (95 RON)</span>
              </div>
            </div>
          </div>

          {/* TPMS Wheel Pressure */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Activity className="w-4 h-4 text-emerald-600" />
                TPMS Wheel Pressure
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                All Optimal
              </span>
            </div>

            <div className="bg-[#eff6ff] p-4 rounded-2xl border border-blue-100/70 relative">
              {/* Chassis outline illustration */}
              <div className="w-24 h-40 bg-slate-200/70 rounded-3xl mx-auto flex items-center justify-center opacity-60">
                <Car className="w-8 h-8 text-slate-400" />
              </div>

              <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-x-8 gap-y-4">
                <div className="bg-white p-2 rounded-xl text-center shadow-xs border border-slate-200/60 self-start">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">FL Tire</span>
                  <span className="text-xs font-black text-slate-900">34 <span className="text-[9px]">PSI</span></span>
                  <span className="text-[9px] text-emerald-600 font-semibold block">• 32°C</span>
                </div>

                <div className="bg-white p-2 rounded-xl text-center shadow-xs border border-slate-200/60 self-start text-right sm:text-center">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">FR Tire</span>
                  <span className="text-xs font-black text-slate-900">34 <span className="text-[9px]">PSI</span></span>
                  <span className="text-[9px] text-emerald-600 font-semibold block">• 33°C</span>
                </div>

                <div className="bg-white p-2 rounded-xl text-center shadow-xs border border-slate-200/60 self-end">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">RL Tire</span>
                  <span className="text-xs font-black text-slate-900">35 <span className="text-[9px]">PSI</span></span>
                  <span className="text-[9px] text-emerald-600 font-semibold block">• 34°C</span>
                </div>

                <div className="bg-white p-2 rounded-xl text-center shadow-xs border border-slate-200/60 self-end text-right sm:text-center">
                  <span className="text-[9px] font-bold uppercase text-slate-400 block">RR Tire</span>
                  <span className="text-xs font-black text-slate-900">34 <span className="text-[9px]">PSI</span></span>
                  <span className="text-[9px] text-emerald-600 font-semibold block">• 33°C</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center font-medium">
              Cold target: 33-35 PSI • Last rotated 2,400 km ago
            </p>
          </div>

          {/* Speed Sentinel & FASTag */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Speed Sentinel</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700">Safe Mode</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-slate-900">100</span>
                <span className="text-xs font-semibold text-slate-500"> km/h Cap</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Expressway Zone: <span className="font-bold text-slate-700">Active</span></p>
              <p className="text-[10px] text-slate-500">Trip Infractions: <span className="font-bold text-emerald-600">0 Recorded</span></p>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">FASTag Telemetry</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-50 text-blue-700">NETC Linked</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-black text-slate-900">₹1,850</span>
                <span className="text-xs font-semibold text-slate-500"> Balance</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Auto-Recharge: <span className="font-bold text-emerald-600">Active (&lt; ₹600)</span></p>
              <p className="text-[10px] text-slate-500">Last Toll (Naini Plaza): <span className="font-bold text-rose-600">-₹120</span></p>
            </div>
          </div>

          {/* Vehicle Health Matrix */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Vehicle Health Matrix
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">All Clear</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-[#eff6ff] p-3 rounded-2xl flex items-center justify-between gap-2 border border-blue-100/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Engine Lubricant</h4>
                    <p className="text-[10px] text-slate-500">Next service in 8,400 km</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200">
                  Optimal (100%)
                </span>
              </div>

              <div className="bg-[#eff6ff] p-3 rounded-2xl flex items-center justify-between gap-2 border border-blue-100/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Brake Fluid &amp; Pads</h4>
                    <p className="text-[10px] text-slate-500">Hydraulic pressure calibrated</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200">
                  98% Life
                </span>
              </div>

              <div className="bg-[#eff6ff] p-3 rounded-2xl flex items-center justify-between gap-2 border border-blue-100/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">12V AGM Auxiliary Battery</h4>
                    <p className="text-[10px] text-slate-500">Alternator charging at 14.2V</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200">
                  100% Healthy
                </span>
              </div>

              <div className="bg-[#eff6ff] p-3 rounded-2xl flex items-center justify-between gap-2 border border-blue-100/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">ADAS &amp; Exterior Radars</h4>
                    <p className="text-[10px] text-slate-500">360° LiDAR &amp; Ultrasonic array</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-emerald-700 border border-emerald-200">
                  Active Online
                </span>
              </div>
            </div>
          </div>

          {/* Current Geo-Telemetry */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Navigation className="w-3 h-3 text-emerald-600" />
              Current Geo-Telemetry
            </span>
            <div className="bg-[#eff6ff] rounded-2xl p-6 border border-blue-100/90 flex items-center justify-center text-center">
              <div className="bg-white px-4 py-2 rounded-full font-bold text-xs text-slate-800 shadow-sm border border-slate-200/60 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Civil Lines • Geofence Intact</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: BOOKINGS (SCREENSHOT 3) */}
      {/* ========================================================= */}
      {activeTab === "bookings" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBookingFilter("active")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                bookingFilter === "active"
                  ? "bg-white text-emerald-800 border border-slate-200 shadow-xs"
                  : "bg-[#eff6ff] text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Active &amp; Upcoming</span>
            </button>

            <button
              type="button"
              onClick={() => setBookingFilter("completed")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                bookingFilter === "completed"
                  ? "bg-white text-emerald-800 border border-slate-200 shadow-xs"
                  : "bg-[#eff6ff] text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>Completed Trips</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px]">3</span>
            </button>
          </div>

          {/* LIVE RENTAL CARD */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-emerald-600" />
                Live Rental
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eff6ff] text-blue-700 border border-blue-200/60">
                <Activity className="w-3 h-3 text-blue-600" />
                Telemetry Live
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
              {/* Photo hero with title */}
              <div className="relative h-48 w-full bg-slate-900">
                <Image
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80"
                  alt="BMW 3 Series"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/95 text-slate-900 text-[10px] font-black uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    In Progress
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-md bg-white/95 text-slate-900 text-[11px] font-mono font-black">
                    PIN: 4892
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <div>
                    <h4 className="text-lg font-black text-white">BMW 3 Series 330i</h4>
                    <p className="text-xs text-slate-300 font-medium">M Sport Edition • UP70-AX-9901</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <Car className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Timeline route */}
              <div className="p-4 space-y-4">
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                    <div className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Pickup Point</span>
                        <h5 className="font-extrabold text-slate-900 text-sm">Prayagraj Civil Lines Hub</h5>
                        <p className="text-[11px] text-slate-500">Station Road, Pillar 14 Bay B</p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">Oct 24, 10:00 AM</span>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />
                    <div className="flex items-baseline justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Return Dropoff</span>
                        <h5 className="font-extrabold text-slate-900 text-sm">Bamrauli Airport VIP Lounge</h5>
                        <p className="text-[11px] text-slate-500">Arrival Terminal P1 Valet Zone</p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">Oct 27, 08:00 PM</span>
                    </div>
                  </div>
                </div>

                {/* Financials Row */}
                <div className="bg-[#eff6ff] p-3 rounded-2xl flex items-center justify-between border border-blue-100/70 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Deposit (Refundable)</span>
                    <span className="text-base font-black text-slate-900">₹500</span>
                    <span className="text-[10px] text-emerald-700 font-semibold ml-1">On Return</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Rental Paid Total</span>
                    <span className="text-base font-black text-slate-900">₹14,500</span>
                    <span className="text-[10px] text-slate-500 ml-1">All incl.</span>
                  </div>
                </div>

                {/* Buttons row */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => triggerToast("Opening booking management pass...")}
                    className="bg-[#eff6ff] hover:bg-blue-100/80 text-blue-700 border border-blue-200/80 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Manage Rental</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendMessage("I want to extend my current booking")}
                    className="bg-[#173F2D] hover:bg-[#2F7650] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Extend Trip</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COMPLETED TRIPS LIST */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                Completed Trips
              </h3>
              <button
                type="button"
                onClick={() => triggerToast("All tax invoices compiled and emailed to your registered address.")}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Invoices</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Trip 1: Mercedes */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-10 rounded-xl bg-slate-900 overflow-hidden shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=200&q=80"
                        alt="Mercedes-Benz C-Class"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Mercedes-Benz C-Class</h4>
                      <p className="text-[11px] text-slate-500">
                        Completed Oct 12, 2026 • <span className="text-emerald-700 font-bold">Zero Infractions</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-900">₹28,050</span>
                    <span className="text-[10px] text-slate-500 block">4 Days</span>
                  </div>
                </div>

                <div className="bg-[#eff6ff] p-2.5 rounded-xl flex items-center justify-between text-xs border border-blue-100/60">
                  <span className="text-slate-600 text-[11px] font-medium flex items-center gap-1">
                    <Compass className="w-3 h-3 text-emerald-600" />
                    Prayagraj ⇄ Varanasi (620 km)
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerToast("Downloading Tax Invoice RAR-2026-9921.pdf")}
                    className="text-emerald-700 font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Tax Invoice</span>
                  </button>
                </div>
              </div>

              {/* Trip 2: Creta */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-10 rounded-xl bg-slate-900 overflow-hidden shrink-0">
                      <Image
                        src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80"
                        alt="Hyundai Creta"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">Hyundai Creta SX</h4>
                      <p className="text-[11px] text-slate-500">
                        Completed Sep 26, 2026 • <span className="text-amber-700 font-bold">★ 5-Star Rated Trip</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-900">₹8,400</span>
                    <span className="text-[10px] text-slate-500 block">2 Days</span>
                  </div>
                </div>

                <div className="bg-[#eff6ff] p-2.5 rounded-xl flex items-center justify-between text-xs border border-blue-100/60">
                  <span className="text-slate-600 text-[11px] font-medium flex items-center gap-1">
                    <Compass className="w-3 h-3 text-emerald-600" />
                    City Transit Loop (184 km)
                  </span>
                  <button
                    type="button"
                    onClick={() => triggerToast("Downloading Tax Invoice RAR-2026-8812.pdf")}
                    className="text-emerald-700 font-bold text-[11px] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Tax Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA Banner */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Planning another drive?</h4>
                <p className="text-[11px] text-slate-500">Instant unlock at 12 hubs across UP</p>
              </div>
            </div>

            <Link
              href="/cars"
              className="px-4 py-2 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors"
            >
              <span>Book Car</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SUPPORT / SOS CONCIERGE (SCREENSHOT 2) */}
      {/* ========================================================= */}
      {activeTab === "support" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-900">Rent A Ride Concierge &amp; Support</h3>
                <p className="text-[10px] text-slate-500">Fleet Guardian Active • Vehicle Tracking Online</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60 shrink-0">
              24/7 Priority
            </span>
          </div>

          {/* CRITICAL RESPONSE - ROADSIDE SOS DISPATCH */}
          <div className="bg-white rounded-3xl border-t-4 border-t-rose-600 border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">Critical Response</span>
                <span className="text-[10px] text-slate-400 font-medium">Instant Link</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900">Roadside SOS Dispatch</h2>

            {/* Live Beacon Lock Box */}
            <div className="bg-[#eff6ff] p-3 rounded-2xl flex items-center justify-between gap-2 border border-blue-100/70">
              <div className="flex items-center gap-2 min-w-0">
                <Navigation className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800 truncate">
                  Civil Lines, Prayagraj (25.4358° N, 81.8463° E)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                ±1.8m Acc
              </span>
            </div>

            {/* Big Red Button */}
            <button
              type="button"
              onClick={() => triggerToast("EMERGENCY BEACON TRANSMITTED: UP Police & Highway Tow dispatched.")}
              className="w-full py-3.5 rounded-2xl bg-[#b91c1c] hover:bg-[#991b1b] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/20 transition-all cursor-pointer"
            >
              <Power className="w-4 h-4" />
              <span>Tap for Emergency Dispatch</span>
            </button>

            {/* Helplines row */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <a
                href="tel:18005557433"
                className="bg-[#eff6ff] hover:bg-blue-100/80 p-2.5 rounded-xl border border-blue-100/70 block transition-colors"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Primary Helpline</span>
                <span className="font-black text-slate-900 text-xs mt-0.5 block">1800-555-RIDE</span>
              </a>

              <a
                href="tel:18007368743"
                className="bg-[#eff6ff] hover:bg-blue-100/80 p-2.5 rounded-xl border border-blue-100/70 block transition-colors"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Backup Toll-Free</span>
                <span className="font-black text-slate-900 text-xs mt-0.5 block">1800-RENT-RIDE</span>
              </a>
            </div>
          </div>

          {/* MAP CONTAINER */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
            <div className="relative h-44 w-full bg-[#e2e8f0] flex items-center justify-center">
              {/* Map background simulated preview */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-100 to-emerald-50 opacity-90" />
              <div className="relative z-10 text-center space-y-1">
                <span className="text-xs font-bold text-slate-700 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-xs inline-block">
                  Prayagraj Hub Map Area
                </span>
                <p className="text-[10px] text-slate-500 font-medium">MG Marg • Subhash Chauraha • Ganga Bridge</p>
              </div>
            </div>

            <div className="p-3 bg-white flex items-center justify-between text-xs">
              <span className="text-slate-700 font-bold flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                Nearby Recovery Unit: <span className="text-slate-900 font-extrabold">Patrol #09 (MG Marg)</span>
              </span>
              <span className="text-emerald-700 font-bold">4.2 km away</span>
            </div>
          </div>

          {/* ROADSIDE DISPATCH SERVICES */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">Roadside Dispatch Services</h3>
              <span className="text-xs text-slate-500 font-medium">Instant Field Teams</span>
            </div>

            <div className="space-y-2">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">On-Demand Flat Tire &amp; Tube</h4>
                    <p className="text-[11px] text-slate-500">Hydraulic lift &amp; wheel swap • <span className="text-emerald-700 font-bold">Est. 18 mins</span></p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast("Tire puncture unit dispatched to your location.")}
                  className="bg-[#173F2D] hover:bg-[#2F7650] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                >
                  Request
                </button>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Doorstep Fuel / EV Quick Charge</h4>
                    <p className="text-[11px] text-slate-500">5L petrol/diesel or 25kW DC boost • Mobile van</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast("Fuel delivery van route confirmed.")}
                  className="bg-[#eff6ff] hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                >
                  Order
                </button>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Key Lockout Assistance</h4>
                    <p className="text-[11px] text-slate-500">OTA cloud unlock or locksmith • Zero damage</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast("OTA Lockout Bypass triggered. Checking sensors...")}
                  className="bg-[#eff6ff] hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                >
                  Unlock
                </button>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Accident &amp; Insurance Claim Desk</h4>
                    <p className="text-[11px] text-slate-500">Digital survey &amp; FIR documentation • Legal assist</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => triggerToast("Accident claim folder opened. Insurance surveyor alerted.")}
                  className="bg-[#eff6ff] hover:bg-blue-100 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer shrink-0"
                >
                  File
                </button>
              </div>
            </div>
          </div>

          {/* FLEET AI CONCIERGE CHAT */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1">
                    Fleet AI Concierge
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </h4>
                  <p className="text-[10px] text-slate-500">Instant booking &amp; roadside help</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Online</span>
            </div>

            {/* Chat Bubble List */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "bot"
                      ? "bg-[#eff6ff] text-slate-800 rounded-tl-xs border border-blue-100/70"
                      : "bg-emerald-600 text-white rounded-tr-xs ml-8"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[9px] block mt-1 ${msg.sender === "bot" ? "text-slate-400" : "text-emerald-200"}`}>
                    {msg.time} {msg.sender === "bot" ? "• Automated Assistant" : "• You"}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Action Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
              <button
                type="button"
                onClick={() => handleSendMessage("Extend my current reservation")}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
              >
                Extend booking
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("Report a scratch or vehicle damage")}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
              >
                Report damage
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("Check my FASTag expressway toll deduction")}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
              >
                Toll query
              </button>
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your issue or query..."
                className="flex-1 bg-[#eff6ff] border border-blue-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-600"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* RENT A RIDE ASSURANCE GUARANTEE */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">Rent A Ride Assurance Guarantee</h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Every trip includes zero-depreciation coverage, prompt on-site replacement vehicle dispatch within 45 mins, and zero out-of-pocket medical bridge support.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FIXED BOTTOM NAVIGATION BAR (MATCHES ALL 4 SCREENSHOTS) */}
      {/* ========================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg py-2">
        <div className="max-w-md mx-auto sm:max-w-xl md:max-w-2xl px-4 flex items-center justify-around">
          <button
            type="button"
            onClick={() => setActiveTab("smart_key")}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === "smart_key" ? "text-emerald-700 font-black" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Key className="w-5 h-5" />
            <span className="text-[10px]">Smart Key</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("telemetry")}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === "telemetry" ? "text-emerald-700 font-black" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Gauge className="w-5 h-5" />
            <span className="text-[10px]">Telemetry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === "bookings" ? "text-emerald-700 font-black" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px]">Bookings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("support")}
            className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
              activeTab === "support" ? "text-emerald-700 font-black" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Headphones className="w-5 h-5" />
            <span className="text-[10px]">Support</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
