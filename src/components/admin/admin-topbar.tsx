"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/firebase/auth-context";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/context/language-context";
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Shield,
  ExternalLink,
  Globe,
} from "lucide-react";

interface AdminTopbarProps {
  onToggleMobileMenu: () => void;
}

export default function AdminTopbar({ onToggleMobileMenu }: AdminTopbarProps) {
  const { user, mongoUser, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const adminName = mongoUser?.name || user?.displayName || user?.email?.split("@")[0] || "Administrator";
  const adminEmail = user?.email || "admin@rentaride.in";
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#DDE6DF] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7] transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#66736A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bookings, fleet vehicles, customers, or reports..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] text-xs text-[#18251D] placeholder:text-[#66736A] focus:outline-hidden focus:border-[#173F2D] transition-all"
          />
        </div>
      </div>

      {/* Right: Actions, Language, Notifications, Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick link to main site */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7] transition-colors"
        >
          <span>Main Site</span>
          <ExternalLink className="w-3 h-3 text-[#66736A]" />
        </Link>

        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#DDE6DF] bg-white text-xs font-semibold text-[#18251D] hover:bg-[#F7FAF7] transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#173F2D]" />
            <span>{currentLangObj.flag}</span>
            <span className="hidden xl:inline">{currentLangObj.nativeName}</span>
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-[#DDE6DF] py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLanguage(l.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                    language === l.code
                      ? "bg-[#EEF5EF] text-[#173F2D] font-bold"
                      : "text-[#18251D] hover:bg-[#F7FAF7]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{l.flag}</span>
                    <span>{l.nativeName}</span>
                  </div>
                  {language === l.code && <span className="w-1.5 h-1.5 rounded-full bg-[#173F2D]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#237447] ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-[#DDE6DF] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDE6DF]">
                <span className="font-bold text-xs text-[#18251D]">Notifications</span>
                <span className="text-[10px] font-semibold text-[#173F2D] bg-[#EEF5EF] border border-[#DDE6DF] px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="divide-y divide-[#DDE6DF] text-xs py-1">
                <div className="py-2.5">
                  <p className="font-semibold text-[#18251D]">New Booking #BK-9482</p>
                  <p className="text-[#66736A] text-[11px] mt-0.5">
                    Aarav Sharma reserved BMW 3 Series for 4 days at Prayagraj Civil Lines.
                  </p>
                  <span className="text-[10px] text-[#66736A] mt-1 block">10 mins ago</span>
                </div>
                <div className="py-2.5">
                  <p className="font-semibold text-[#18251D]">Maintenance Completed</p>
                  <p className="text-[#66736A] text-[11px] mt-0.5">
                    Tesla Model 3 passed scheduled 45-point inspection.
                  </p>
                  <span className="text-[10px] text-[#66736A] mt-1 block">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-[#DDE6DF] hidden sm:block" />

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 sm:px-2 sm:py-1.5 rounded-xl hover:bg-[#F7FAF7] transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#173F2D] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {adminName.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <span className="block text-xs font-bold text-[#18251D] leading-tight">
                {adminName}
              </span>
              <span className="text-[10px] font-semibold text-[#173F2D] flex items-center gap-1">
                <Shield className="w-2.5 h-2.5" />
                Fleet Administrator
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#66736A] hidden sm:block" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#DDE6DF] p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-[#DDE6DF]">
                <p className="text-xs font-bold text-[#18251D]">{adminName}</p>
                <p className="text-[11px] text-[#66736A] truncate">{adminEmail}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/admin/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#18251D] hover:bg-[#F7FAF7] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#66736A]" />
                  <span>Account Settings</span>
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#18251D] hover:bg-[#F7FAF7] transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-[#66736A]" />
                  <span>Customer Dashboard</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-[#DDE6DF]">
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#B42318] hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
