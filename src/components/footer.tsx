"use client";

import React from "react";
import Link from "next/link";
import { Car, MapPin, Phone, ShieldCheck, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#101827] text-[#94A3B8] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1: Rent a Ride */}
          <div className="col-span-2 md:col-span-1 space-y-3.5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white text-[#101827] flex items-center justify-center shadow-xs">
                <Car className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Rent <span className="text-emerald-500 font-bold">a</span> Ride
              </span>
            </Link>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Premium mobility platform engineered for effortless journeys. Instant digital dispatch across Prayagraj and Uttar Pradesh.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium pt-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>1800-555-RIDE (24/7)</span>
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-white transition-colors">
                  Browse Fleet
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-white transition-colors">
                  Customer Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Support</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="tel:18005557433" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Manage Bookings
                </Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Roadside Assistance
                </span>
              </li>
              <li>
                <a href="mailto:support@rentaride.com" className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Rental Insurance
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition-colors">
                  Driver Requirements
                </span>
              </li>
            </ul>
          </div>

          {/* Col 5: Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Social</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  WhatsApp Concierge
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>© {new Date().getFullYear()} Rent a Ride. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Flagship Hub: Civil Lines & MG Marg, Prayagraj</span>
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Transparent Billing in ₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
