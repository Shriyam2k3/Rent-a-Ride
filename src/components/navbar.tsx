"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
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
  Globe,
  Navigation,
} from "lucide-react";

export default function Navbar() {
  const { user, mongoUser, role, logout } = useAuth();
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#DDE6DF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LEFT: Brand Logo & Hub Pill */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#173F2D] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider text-[#18251D]">
                  RENT <span className="text-[#173F2D]">A</span> RIDE
                </span>
                <span className="text-[9px] tracking-widest uppercase font-bold text-[#66736A] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#237447]" />
                  ELITE MOBILITY • UP
                </span>
              </div>
            </Link>

            {/* Prayagraj Hub Quick Indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EEF5EF] border border-[#DDE6DF] text-xs font-semibold text-[#173F2D]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#237447] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#237447]" />
              </span>
              <span>Prayagraj, IN</span>
              <ChevronDown className="w-3 h-3 text-[#66736A]" />
            </div>
          </div>

          {/* CENTER: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-xs tracking-wide transition-all ${
                    isActive
                      ? "text-[#173F2D] bg-[#EEF5EF] border border-[#DDE6DF] font-bold shadow-xs"
                      : "text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7] font-semibold"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/#hubs"
              className="px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7] transition-all"
            >
              Hubs
            </Link>
          </nav>

          {/* RIGHT: Language, Notifications & User Account */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#DDE6DF] bg-white hover:bg-[#F7FAF7] text-xs font-semibold text-[#18251D] transition-colors cursor-pointer"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-[#173F2D]" />
                <span>{currentLangObj.flag}</span>
                <span className="hidden lg:inline">{currentLangObj.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-[#66736A]" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-lg border border-[#DDE6DF] py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 border-b border-[#DDE6DF]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#66736A]">
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
                          ? "bg-[#EEF5EF] text-[#173F2D] font-bold"
                          : "text-[#18251D] hover:bg-[#F7FAF7]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.nativeName}</span>
                      </div>
                      {language === l.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#173F2D]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    aria-label="Notifications"
                    className="relative p-2 rounded-xl border border-[#DDE6DF] bg-white text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7] transition-colors cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    {activeBooking && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#237447] ring-2 ring-white" />
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-xl border border-[#DDE6DF] p-3 z-50 animate-in fade-in slide-in-from-top-1 text-[#18251D]">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DDE6DF]">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#66736A]">
                          Notifications
                        </span>
                        <span className="text-[11px] text-[#237447] font-medium">All caught up</span>
                      </div>

                      {activeBooking ? (
                        <div className="space-y-2">
                          <Link
                            href={`/dashboard/bookings/${activeBooking.id}`}
                            onClick={() => setNotificationsOpen(false)}
                            className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#F7FAF7] hover:bg-[#EEF5EF] border border-[#DDE6DF] transition-colors group"
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#EEF5EF] text-[#173F2D] flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#18251D] group-hover:text-[#173F2D]">
                                Active Booking #{activeBooking.code}
                              </p>
                              <p className="text-[11px] text-[#66736A] truncate">{activeBooking.title}</p>
                              <p className="text-[10px] text-[#173F2D] font-medium mt-0.5">
                                Pickup at {activeBooking.pickup}
                              </p>
                            </div>
                          </Link>

                          <Link
                            href={`/dashboard/tracking/${activeBooking.id}`}
                            onClick={() => setNotificationsOpen(false)}
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white text-xs font-bold transition-colors shadow-xs"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Live GPS Vehicle Tracking</span>
                          </Link>
                        </div>
                      ) : (
                        <div className="py-6 text-center text-xs text-[#66736A]">
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
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-[#DDE6DF] bg-[#F7FAF7] hover:bg-[#EEF5EF] text-[#18251D] text-sm font-medium transition-all shadow-xs cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#173F2D] text-white flex items-center justify-center font-bold text-xs overflow-hidden">
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
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#A86B18]/10 text-[#A86B18] border border-[#A86B18]/30 uppercase">
                        Admin
                      </span>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-[#66736A]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-xl border border-[#DDE6DF] py-2 z-50 text-[#18251D] divide-y divide-[#DDE6DF] animate-in fade-in slide-in-from-top-1">
                      <div className="px-4 py-2.5">
                        <p className="text-[11px] text-[#66736A] font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-[#18251D] truncate">
                          {user.displayName || user.email}
                        </p>
                        <p className="text-[11px] text-[#66736A] truncate">{user.email}</p>
                      </div>

                      <div className="py-1 text-xs">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-[#18251D] hover:bg-[#EEF5EF] hover:text-[#173F2D] font-semibold"
                          >
                            <Shield className="w-4 h-4 text-[#173F2D]" />
                            {t("nav_admin")}
                          </Link>
                        )}
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7] font-medium"
                        >
                          <UserIcon className="w-4 h-4 text-[#66736A]" />
                          {t("nav_dashboard")}
                        </Link>
                        <Link
                          href="/dashboard/bookings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7] font-medium"
                        >
                          <Calendar className="w-4 h-4 text-[#66736A]" />
                          My Bookings
                        </Link>
                        <Link
                          href="/dashboard/reviews"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7] font-medium"
                        >
                          <Star className="w-4 h-4 text-[#66736A]" />
                          My Reviews
                        </Link>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#B42318] hover:bg-rose-50 text-left font-medium cursor-pointer"
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
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#66736A] hover:text-[#18251D] transition-colors"
                >
                  {t("nav_login")}
                </Link>
                <Link
                  href="/cars"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#173F2D] hover:bg-[#2F7650] shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5" />
                  <span>Book Drive</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions: Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#18251D] hover:bg-[#F7FAF7] border border-[#DDE6DF] cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DDE6DF] bg-white px-4 pt-3 pb-6 space-y-4 animate-in fade-in">
          {/* Mobile Language Selector */}
          <div className="flex items-center justify-between pb-2 border-b border-[#DDE6DF]">
            <span className="text-xs font-bold text-[#66736A]">Language / भाषा</span>
            <div className="flex gap-1 overflow-x-auto">
              {SUPPORTED_LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    language === l.code
                      ? "bg-[#173F2D] text-white font-bold"
                      : "bg-[#F7FAF7] text-[#18251D] border border-[#DDE6DF]"
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
                    ? "bg-[#EEF5EF] text-[#173F2D] font-bold"
                    : "text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7]"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/#hubs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium text-[#66736A] hover:text-[#18251D] hover:bg-[#F7FAF7]"
            >
              Hubs
            </Link>
          </nav>

          {activeBooking && (
            <div className="grid grid-cols-2 gap-2">
              <Link
                href={`/dashboard/tracking/${activeBooking.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#173F2D] text-white text-xs font-bold shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Track Live</span>
              </Link>
              <Link
                href={`/dashboard/bookings/${activeBooking.id}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-xs font-semibold text-[#173F2D]"
              >
                <span>Trip Pass</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#173F2D]" />
              </Link>
            </div>
          )}

          <div className="pt-3 border-t border-[#DDE6DF] flex flex-col gap-2">
            {user ? (
              <>
                <div className="px-3 py-2 bg-[#F7FAF7] rounded-xl border border-[#DDE6DF]">
                  <p className="text-xs font-bold text-[#18251D]">{user.displayName || user.email}</p>
                  <p className="text-[11px] text-[#66736A]">{user.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-[#18251D] hover:bg-[#F7FAF7]"
                >
                  {t("nav_dashboard")}
                </Link>
                <Link
                  href="/dashboard/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-[#18251D] hover:bg-[#F7FAF7]"
                >
                  My Bookings
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-sm font-semibold text-[#173F2D] bg-[#EEF5EF]"
                  >
                    {t("nav_admin")}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-xl border border-rose-200 text-[#B42318] font-medium text-xs hover:bg-rose-50 cursor-pointer mt-1"
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
                    className="text-center px-4 py-2.5 rounded-xl border border-[#DDE6DF] font-medium text-xs text-[#18251D] hover:bg-[#F7FAF7]"
                  >
                    {t("nav_login")}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center px-4 py-2.5 rounded-xl bg-[#173F2D] font-semibold text-xs text-white hover:bg-[#2F7650]"
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
