"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Car, MapPin, Phone, ShieldCheck, Mail, ArrowRight, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#F7FAF7] text-[#66736A] border-t border-[#DDE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Col 1: Rent a Ride Brand & Newsletter */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#173F2D] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider text-[#18251D]">
                  RENT <span className="text-[#173F2D]">A</span> RIDE
                </span>
                <span className="text-[9px] tracking-widest uppercase font-bold text-[#66736A]">
                  ELITE MOBILITY • UTTAR PRADESH
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#66736A] leading-relaxed max-w-sm">
              Premier self-drive and executive mobility network. Protocol-fleet status, transparent guarantees, and effortless digital pickup across flagship urban hubs.
            </p>

            {/* Newsletter input */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#18251D] block">Mobility Newsletter</span>
              {subscribed ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-[#173F2D] p-3 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF]">
                  <Check className="w-4 h-4 text-[#237447]" />
                  <span>Subscribed to VIP dispatch alerts!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#DDE6DF] bg-white text-xs text-[#18251D] placeholder:text-[#66736A] focus:outline-hidden focus:border-[#173F2D] focus:ring-1 focus:ring-[#173F2D] transition-all"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#173F2D] hover:bg-[#2F7650] transition-colors shadow-xs cursor-pointer"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Fleet & Services */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#173F2D]">
              FLEET & SERVICES
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/cars?category=Electric" className="hover:text-[#173F2D] transition-colors">
                  Electrical Hybrids
                </Link>
              </li>
              <li>
                <Link href="/cars?category=Sedan" className="hover:text-[#173F2D] transition-colors">
                  Executive Sedans
                </Link>
              </li>
              <li>
                <Link href="/cars?category=SUV" className="hover:text-[#173F2D] transition-colors">
                  Luxury SUVs
                </Link>
              </li>
              <li>
                <span className="hover:text-[#173F2D] transition-colors cursor-pointer">
                  Monthly Subscriptions
                </span>
              </li>
              <li>
                <span className="hover:text-[#173F2D] transition-colors cursor-pointer">
                  Corporate Leases
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Regional Hubs */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#173F2D]">
              REGIONAL HUBS
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#hubs" className="hover:text-[#173F2D] transition-colors">
                  Prayagraj Central Station
                </Link>
              </li>
              <li>
                <Link href="/#hubs" className="hover:text-[#173F2D] transition-colors">
                  Lucknow Airport Terminal 3
                </Link>
              </li>
              <li>
                <Link href="/#hubs" className="hover:text-[#173F2D] transition-colors">
                  Varanasi Cantt Lounge
                </Link>
              </li>
              <li>
                <Link href="/#hubs" className="hover:text-[#173F2D] transition-colors">
                  Ayodhya Dham Expressway
                </Link>
              </li>
              <li>
                <span className="hover:text-[#173F2D] transition-colors cursor-pointer">
                  All Express Lockers
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Company */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#173F2D]">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#how-it-works" className="hover:text-[#173F2D] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <span className="hover:text-[#173F2D] transition-colors cursor-pointer">
                  Enterprise Solutions
                </span>
              </li>
              <li>
                <Link href="/#assurance" className="text-[#173F2D] font-bold hover:text-[#2F7650] transition-colors">
                  Insurance & Safety
                </Link>
              </li>
              <li>
                <a href="tel:18005557433" className="hover:text-[#173F2D] transition-colors">
                  24/7 Roadside Assistance
                </a>
              </li>
              <li>
                <span className="hover:text-[#173F2D] transition-colors cursor-pointer">
                  Press & Media
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-[#DDE6DF] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#66736A]">
          <p>© {new Date().getFullYear()} Rent a Ride Mobility Technologies Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="hover:text-[#173F2D] transition-colors cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-[#173F2D] transition-colors cursor-pointer">Terms of Rental</span>
            <span>•</span>
            <span className="hover:text-[#173F2D] transition-colors cursor-pointer">Security Standards</span>
            <span>•</span>
            <span className="hover:text-[#173F2D] transition-colors cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
