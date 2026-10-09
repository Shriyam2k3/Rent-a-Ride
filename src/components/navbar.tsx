"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { useTheme } from "@/context/theme-context";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "@/context/language-context";
import {
  Car,
  Menu,
  X,
  User as UserIcon,
  Shield,
  Calendar,
  LogOut,
  ChevronDown,
  Bell,
  Star,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  Globe,
  Navigation,
} from "lucide-react";

export default function Navbar() {
  const { user, mongoUser, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<{ id: string; code: string; title: string; pickup: string } | null>(null);

  const pathname = usePathname();
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const isAdmin = role === "admin" || mongoUser?.role === "admin";

  // Check for active booking for logged in user
  useEffect(() => {
    if (!user) {
      setActiveBooking(null);
      return;
    }

    const checkActiveBooking = async () => {
      try {
        const uid = mongoUser?.firebaseUid || user.uid;
        const res = await fetch(`/api/bookings?userId=${uid}`);
        if (res.ok) {
          const data = await res.json();
          const active = data.bookings?.find(
            (b: { status: string }) => b.status === "confirmed" || b.status === "pending"
          );
          if (active) {
            setActiveBooking({
              id: active._id,
              code: active.bookingCode,
              title: active.car?.title || "Reserved Car",
              pickup: active.pickupLocation || "Prayagraj Hub",
            });
          } else {
            setActiveBooking(null);
          }
        }
      } catch {
        // ignore background poll
      }
    };

    checkActiveBooking();
  }, [user, mongoUser]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
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

  const navLinks = [
    { name: t("nav_home"), href: "/" },
    { name: t("nav_browse"), href: "/cars" },
    { name: t("nav_how"), href: "/#how-it-works" },
  ];

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-[0_1px_3px_rgba(16,24,39,0.02)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* LEFT: Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#101827] dark:bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 text-emerald-400 dark:text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-[#172033] dark:text-white">
                Rent <span className="text-emerald-600 dark:text-emerald-400 font-bold">a</span> Ride
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#64748B] dark:text-slate-400">
                {t("brand_sub")}
              </span>
            </div>
          </Link>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "text-[#101827] dark:text-white font-semibold bg-slate-100/80 dark:bg-slate-800"
                      : "text-[#64748B] dark:text-slate-300 hover:text-[#172033] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Language, Theme, Notifications & User Account */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>{currentLangObj.flag}</span>
                <span className="hidden lg:inline">{currentLangObj.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#111827] shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Select Language
                    </span>
                  </div>
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
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                      </div>
                      {language === l.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    aria-label="Notifications"
                    className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    {activeBooking && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#111827] shadow-xl border border-slate-200/80 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-1 text-slate-900 dark:text-white">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Notifications
                        </span>
                        <span className="text-[11px] text-emerald-600 font-medium">All caught up</span>
                      </div>

                      {activeBooking ? (
                        <div className="space-y-2">
                          <Link
                            href={`/dashboard/bookings/${activeBooking.id}`}
                            onClick={() => setNotificationsOpen(false)}
                            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50/70 border border-slate-200/60 dark:border-slate-700 transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700">
                                Active Booking #{activeBooking.code}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{activeBooking.title}</p>
                              <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                                Pickup at {activeBooking.pickup}
                              </p>
                            </div>
                          </Link>

                          <Link
                            href={`/dashboard/tracking/${activeBooking.id}`}
                            onClick={() => setNotificationsOpen(false)}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Live GPS Vehicle Tracking</span>
                          </Link>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No new alerts at this time.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Avatar & Dropdown */}
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium transition-all shadow-xs cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#101827] dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-xs overflow-hidden">
                      {user.photoURL ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        user.displayName?.charAt(0) || user.email?.charAt(0) || "U"
                      )}
                    </div>
                    <span className="max-w-[120px] truncate font-semibold text-xs sm:text-sm">
                      {user.displayName || user.email?.split("@")[0]}
                    </span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 uppercase">
                        Admin
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-[#111827] shadow-xl border border-slate-200/80 dark:border-slate-800 py-2 z-50 text-slate-900 dark:text-white divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-top-1">
                      <div className="px-4 py-2.5">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {user.displayName || user.email}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      <div className="py-1 text-xs">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-slate-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 font-semibold"
                          >
                            <Shield className="w-4 h-4 text-emerald-600" />
                            {t("nav_admin")}
                          </Link>
                        )}
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          {t("nav_dashboard")}
                        </Link>
                        <Link
                          href="/dashboard/bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                        >
                          <Calendar className="w-4 h-4 text-slate-400" />
                          My Bookings
                        </Link>
                        <Link
                          href="/dashboard/reviews"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                        >
                          <Star className="w-4 h-4 text-slate-400" />
                          My Reviews
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left font-medium cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          {t("nav_signout")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t("nav_login")}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#101827] dark:bg-emerald-600 hover:bg-[#172033] dark:hover:bg-emerald-700 shadow-xs transition-colors"
                >
                  {t("nav_register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions: Language, Theme & Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] px-4 pt-3 pb-6 space-y-4 animate-in fade-in">
          {/* Mobile Language Selector */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Language / भाषा</span>
            <div className="flex gap-1 overflow-x-auto">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    language === l.code
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          </div>

          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-sm font-medium ${
                  pathname === link.href
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {activeBooking && (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/dashboard/tracking/${activeBooking.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Track Live</span>
              </Link>
              <Link
                href={`/dashboard/bookings/${activeBooking.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
              >
                <span>Trip Pass</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </Link>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{user.displayName || user.email}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50"
                >
                  {t("nav_dashboard")}
                </Link>
                <Link
                  href="/dashboard/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50"
                >
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40"
                  >
                    {t("nav_admin")} (Shriyam)
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 font-medium text-xs hover:bg-rose-50 cursor-pointer mt-1"
                >
                  {t("nav_signout")}
                </button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-medium text-xs text-slate-900 dark:text-white"
                  >
                    {t("nav_login")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 rounded-xl bg-[#101827] dark:bg-emerald-600 font-semibold text-xs text-white"
                  >
                    {t("nav_register")}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
