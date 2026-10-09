"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ICar, IReview } from "@/types";
import CarCard from "@/components/car-card";
import { useLanguage } from "@/context/language-context";
import {
  MapPin,
  Calendar,
  Car,
  Search,
  CheckCircle2,
  Shield,
  Clock,
  Sparkles,
  ArrowRight,
  Star,
  Quote,
  Zap,
  Gauge,
  PhoneCall,
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();

  // Search Panel State
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const returnDefault = new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0];

  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState(tomorrow);
  const [returnDate, setReturnDate] = useState(returnDefault);
  const [carType, setCarType] = useState("All");

  const [featuredCars, setFeaturedCars] = useState<ICar[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carsRes, reviewsRes] = await Promise.all([
          fetch("/api/cars?featured=true"),
          fetch("/api/reviews?limit=3"),
        ]);

        if (carsRes.ok) {
          const carsData = await carsRes.json();
          setFeaturedCars(carsData.cars || []);
        }

        if (reviewsRes.ok) {
          const reviewsData = await reviewsRes.json();
          setReviews(reviewsData.reviews || []);
        }
      } catch (e) {
        console.error("Failed to load homepage data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pickupLocation.trim()) {
      params.set("search", pickupLocation.trim());
    }
    if (carType && carType !== "All") {
      params.set("category", carType);
    }
    router.push(`/cars?${params.toString()}`);
  };

  const categories = [
    { name: "Electric", count: "2 Models", icon: Zap, query: "Electric" },
    { name: "Luxury SUVs", count: "3 Models", icon: Shield, query: "SUV" },
    { name: "Executive Sedans", count: "2 Models", icon: Gauge, query: "Sedan" },
    { name: "Sports & Performance", count: "1 Model", icon: Car, query: "Sports" },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#101827] text-white overflow-hidden py-16 lg:py-20 border-b border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(16,185,129,0.18),rgba(255,255,255,0))]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Search Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t("hero_badge")}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                {t("hero_title")}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                {t("hero_sub")}
              </p>

              {/* SEARCH & BOOKING COMPONENT */}
              <div className="bg-white dark:bg-[#111827] rounded-2xl p-4 sm:p-5 shadow-xl text-[#172033] dark:text-white border border-slate-200/80 dark:border-slate-800">
                <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Location */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {t("hero_pickup_loc")}
                    </label>
                    <input
                      type="text"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      placeholder="e.g. Civil Lines, Sangam, Airport"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#172033] dark:text-white focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Pickup Date */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {t("hero_pickup_date")}
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#172033] dark:text-white focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Return Date */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {t("hero_return_date")}
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      min={pickupDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-[#172033] dark:text-white focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Action Button */}
                  <div className="sm:col-span-3 pt-1">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-[#101827] dark:bg-emerald-600 hover:bg-[#172033] dark:hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-emerald-400 dark:text-white" />
                      <span>{t("hero_search_btn")}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column: Hero High-Quality Automotive Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-800">
                <Image
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
                  alt="BMW 3 Series Luxury Sedan"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101827] via-transparent to-transparent opacity-80" />

                {/* Floating vehicle card snippet */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3.5 border border-slate-200/80 text-[#172033] flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                      Featured Model
                    </span>
                    <p className="font-extrabold text-sm text-[#101827]">BMW 3 Series 330i M Sport</p>
                    <p className="text-[11px] text-[#64748B]">Civil Lines & Prayagraj Junction Hub</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-[#101827]">₹8,500</span>
                    <span className="text-[10px] text-[#64748B] block">/ day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CARS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Verified Fleet
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] mt-0.5">
              Popular Vehicles
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Top-rated models available for immediate pickup across Prayagraj and Uttar Pradesh.
            </p>
          </div>

          <Link
            href="/cars"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors group"
          >
            <span>View All Fleet</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.slice(0, 3).map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* 3. BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Tailored Options
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] mt-0.5">
            Browse by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Choose the vehicle format that best matches your trip requirements.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/cars?category=${encodeURIComponent(cat.query)}`}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_2px_8px_rgba(16,24,39,0.02)] hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#101827] text-[#101827] group-hover:text-white flex items-center justify-center transition-colors mb-3">
                  <Icon className="w-5 h-5 text-emerald-600 group-hover:text-emerald-400" />
                </div>
                <h3 className="font-bold text-sm text-[#172033] group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">{cat.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#F1F5F9] border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] mt-0.5">
              How Rent a Ride Works
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Book your car in under 3 minutes with verified digital paperwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(16,24,39,0.02)]">
              <div className="w-9 h-9 rounded-xl bg-[#101827] text-white flex items-center justify-center font-bold text-sm mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-[#172033] mb-1.5">1. Select Vehicle</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Filter our fleet by category, seating, or transmission. Compare transparent daily rates with zero hidden fees.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(16,24,39,0.02)]">
              <div className="w-9 h-9 rounded-xl bg-[#101827] text-white flex items-center justify-center font-bold text-sm mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-[#172033] mb-1.5">2. Choose Dates & Hub</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Select your rental schedule and choose your preferred pickup station (Civil Lines, Sangam, or Bamrauli Airport).
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(16,24,39,0.02)]">
              <div className="w-9 h-9 rounded-xl bg-[#101827] text-white flex items-center justify-center font-bold text-sm mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-[#172033] mb-1.5">3. Instant Key Handover</h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Arrive at the station, show your digital boarding pass, complete quick key handover, and drive with 24/7 roadside cover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY RENT A RIDE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Platform Benefits
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] mt-0.5">
            Why Rent a Ride
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Built for drivers who value punctuality, clean vehicles, and transparent service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(16,24,39,0.02)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-[#172033]">45-Point Inspected</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Every vehicle undergoes a detailed safety inspection and thorough sanitization prior to dispatch.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(16,24,39,0.02)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#172033] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-[#172033]">Flexible Bookings</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Easily manage reservations and extend your journey directly from your customer dashboard.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(16,24,39,0.02)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-[#172033]">Transparent Pricing</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Clear rates in Indian Rupees with GST itemized upfront. No hidden surcharge surprises at the counter.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(16,24,39,0.02)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-[#172033]">24/7 UP Roadside SOS</h4>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Instant helpline (1800-555-RIDE) with rapid mechanical dispatch across all Uttar Pradesh expressways.
            </p>
          </div>
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172033] mt-0.5">
              What Drivers Say
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1">
              Real testimonials from authentic drivers across Prayagraj and Uttar Pradesh.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#172033] font-bold">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>4.9 / 5.0 Average Driver Rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-[0_2px_8px_rgba(16,24,39,0.02)] space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-slate-300" />
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                <div className="w-7 h-7 rounded-full bg-[#101827] text-white flex items-center justify-center font-bold text-xs">
                  {rev.userName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-bold text-xs text-[#172033]">{rev.userName}</p>
                  <p className="text-[10px] text-[#94A3B8]">Verified Renter</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#101827] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Ready to Drive?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Reserve your vehicle in Prayagraj today.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              From business meetings in Civil Lines to highway touring towards Varanasi or Ayodhya, Rent a Ride delivers peace of mind.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/cars"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Browse Available Fleet
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Create Driver Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
