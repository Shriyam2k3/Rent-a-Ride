"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ICar, IReview } from "@/types";
import CarCard from "@/components/car-card";
import { useLanguage } from "@/context/language-context";
import dynamic from "next/dynamic";
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
  Zap,
  Gauge,
  PhoneCall,
  Heart,
  Navigation,
  FileCheck2,
  KeyRound,
  ShieldCheck,
  Receipt,
} from "lucide-react";

const HubLocationMap = dynamic(() => import("@/components/map/hub-location-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] rounded-2xl bg-[#EEF5EF] flex items-center justify-center text-xs text-[#173F2D] font-bold">
      Loading Rent-a-Ride Hub Station Network...
    </div>
  ),
});

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();

  // Search Panel State
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const returnDefault = new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0];

  const [pickupLocation, setPickupLocation] = useState("Prayagraj - Civil Lines Executive Hub");
  const [returnToAnother, setReturnToAnother] = useState(false);
  const [pickupDate, setPickupDate] = useState(tomorrow);
  const [pickupTime, setPickupTime] = useState("10:00 AM");
  const [returnDate, setReturnDate] = useState(returnDefault);
  const [returnTime, setReturnTime] = useState("06:00 PM");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeFleetTab, setActiveFleetTab] = useState("All");
  const [savedWishlist, setSavedWishlist] = useState(false);

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
      params.set("search", pickupLocation.split("-")[0].trim());
    }
    if (activeCategory && activeCategory !== "All") {
      params.set("category", activeCategory);
    }
    router.push(`/cars?${params.toString()}`);
  };

  const heroCategories = [
    { label: "All Fleet (40)", value: "All" },
    { label: "Luxury Sedans (12)", value: "Sedan" },
    { label: "Electric SUVs (10)", value: "Electric" },
    { label: "Executive SUVs (18)", value: "SUV" },
  ];

  const fleetFilterTabs = [
    { label: "All (24)", value: "All" },
    { label: "Sedans (10)", value: "Sedan" },
    { label: "SUVs (9)", value: "SUV" },
    { label: "EV & Hybrid (5)", value: "Electric" },
  ];

  const filteredFleet = featuredCars.filter((car) => {
    if (activeFleetTab === "All") return true;
    if (activeFleetTab === "Electric") return car.category === "Electric" || car.fuelType === "Electric";
    return car.category?.toLowerCase() === activeFleetTab.toLowerCase();
  });

  return (
    <div className="space-y-20 pb-24 text-[#18251D] bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 bg-[#F7FAF7] border-b border-[#DDE6DF]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Top Banner & Headlines */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headlines & Guarantees */}
            <div className="lg:col-span-7 space-y-6">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] text-xs font-bold tracking-wide shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#237447] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#237447]" />
                </span>
                <span>PREMIUM MOBILITY PLATFORM • UTTAR PRADESH</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#18251D] leading-[1.12]">
                Experience Exceptional Drives Across{" "}
                <span className="text-[#173F2D]">Uttar Pradesh</span>
              </h1>

              <p className="text-base sm:text-lg text-[#66736A] max-w-2xl leading-relaxed font-normal">
                Reserve top-tier luxury sedans, electric SUVs, and high-performance vehicles across Prayagraj, Lucknow, and Varanasi hubs with zero paperwork friction.
              </p>

              {/* Guarantees badges row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#DDE6DF] text-xs font-semibold text-[#18251D] shadow-xs">
                  <Zap className="w-3.5 h-3.5 text-[#237447]" />
                  <span>45s Fleet Ready Today</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#DDE6DF] text-xs font-semibold text-[#18251D] shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#237447]" />
                  <span>₹0 Security Deposit Available</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#DDE6DF] text-xs font-semibold text-[#18251D] shadow-xs">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#237447]" />
                  <span>45s Fast Digitalized KYC</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero High-End Featured Model Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#DDE6DF] bg-white shadow-md group">
                {/* Top status bar inside car card */}
                <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#173F2D] text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                    <span>FEATURED MODEL • 0-100 IN 5.8S</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSavedWishlist(!savedWishlist)}
                    className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-[#DDE6DF] shadow-xs flex items-center justify-center text-[#18251D] hover:text-rose-500 transition-colors cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${savedWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                </div>

                {/* Car Image with zoom */}
                <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-[#F7FAF7]">
                  <Image
                    src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
                    alt="BMW 3 Series 330i M Sport"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card telemetry specs & price */}
                <div className="p-6 space-y-4 bg-white border-t border-[#DDE6DF]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-black text-[#18251D]">BMW 3 Series 330i M Sport</h3>
                      <p className="text-xs text-[#66736A] flex items-center gap-1.5 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#173F2D]" />
                        <span>Civil Lines & Prayagraj Junction Hub</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-black text-[#18251D]">₹8,500 <span className="text-xs font-normal text-[#66736A]">/ day</span></div>
                      <div className="flex items-center gap-1 text-xs text-[#A86B18] justify-end mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-[#A86B18] text-[#A86B18]" />
                        <span className="font-bold">4.9</span>
                        <span className="text-[#66736A]">(128)</span>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry pill specs */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#DDE6DF] text-center">
                    <div className="p-2.5 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF]">
                      <span className="text-[10px] uppercase font-bold text-[#66736A] block">Engine</span>
                      <span className="text-xs font-bold text-[#18251D] block mt-0.5">Petrol Turbo</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF]">
                      <span className="text-[10px] uppercase font-bold text-[#66736A] block">Gearbox</span>
                      <span className="text-xs font-bold text-[#18251D] block mt-0.5">Auto Steptronic</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF]">
                      <span className="text-[10px] uppercase font-bold text-[#66736A] block">Capacity</span>
                      <span className="text-xs font-bold text-[#18251D] block mt-0.5">5 Seater</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. SEARCH CONSOLE (Pure White & Forest Green Design) */}
          <div className="rounded-2xl p-6 sm:p-8 bg-white border border-[#DDE6DF] shadow-md space-y-6">
            {/* Top row: Category Selector Pills & Return Checkbox */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDE6DF]">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#66736A] mr-2">
                  CATEGORY:
                </span>
                {heroCategories.map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeCategory === cat.value
                        ? "bg-[#173F2D] text-white shadow-xs"
                        : "bg-[#F7FAF7] text-[#66736A] hover:bg-[#EEF5EF] hover:text-[#18251D] border border-[#DDE6DF]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Return to another hub toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold text-[#66736A] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={returnToAnother}
                  onChange={(e) => setReturnToAnother(e.target.checked)}
                  className="w-4 h-4 rounded-md border-[#DDE6DF] bg-white text-[#173F2D] focus:ring-[#173F2D] cursor-pointer"
                />
                <span>Return to another hub</span>
              </label>
            </div>

            {/* Input fields row + Find Vehicles button */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Pickup Station / Hub */}
              <div className="md:col-span-5 space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173F2D] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>PICKUP STATION / HUB</span>
                </label>
                <div className="relative">
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-[#18251D] font-semibold text-xs sm:text-sm focus:outline-hidden focus:border-[#173F2D] focus:ring-1 focus:ring-[#173F2D] transition-all appearance-none cursor-pointer"
                  >
                    <option value="Prayagraj - Civil Lines Executive Hub" className="bg-white text-[#18251D]">
                      Prayagraj - Civil Lines Executive Hub
                    </option>
                    <option value="Lucknow - Chaudhary Charan Singh T3 Airport" className="bg-white text-[#18251D]">
                      Lucknow - Chaudhary Charan Singh T3 Airport
                    </option>
                    <option value="Lucknow - Gomti Nagar VIP Hub" className="bg-white text-[#18251D]">
                      Lucknow - Gomti Nagar VIP Hub
                    </option>
                    <option value="Varanasi - Cantt Heritage Hub" className="bg-white text-[#18251D]">
                      Varanasi - Cantt Heritage Hub
                    </option>
                  </select>
                  <p className="text-[11px] text-[#66736A] mt-1 pl-1">
                    Complementary valet & Instant Key Locker
                  </p>
                </div>
              </div>

              {/* Pickup Date & Time */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173F2D] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>PICKUP DATE & TIME</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={pickupDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-[#18251D] text-xs font-semibold focus:outline-hidden focus:border-[#173F2D]"
                  />
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full px-2 py-3 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-[#18251D] text-xs font-semibold focus:outline-hidden focus:border-[#173F2D] cursor-pointer"
                  >
                    <option value="09:00 AM" className="bg-white text-[#18251D]">09:00 AM</option>
                    <option value="10:00 AM" className="bg-white text-[#18251D]">10:00 AM</option>
                    <option value="01:00 PM" className="bg-white text-[#18251D]">01:00 PM</option>
                    <option value="06:00 PM" className="bg-white text-[#18251D]">06:00 PM</option>
                  </select>
                </div>
                <p className="text-[11px] text-[#66736A] pl-1">Immediate key access</p>
              </div>

              {/* Return Date & Time */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#173F2D] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>RETURN DATE & TIME</span>
                </label>
                <input
                  type="date"
                  value={returnDate}
                  min={pickupDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-[#DDE6DF] bg-[#F7FAF7] text-[#18251D] text-xs font-semibold focus:outline-hidden focus:border-[#173F2D]"
                />
                <p className="text-[11px] text-[#66736A] pl-1">Flexible dropoff</p>
              </div>

              {/* Find Vehicles Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#173F2D] hover:bg-[#2F7650] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Search className="w-4 h-4 text-white" />
                  <span>Find Vehicles</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. POPULAR EXECUTIVE VEHICLES (FLEET SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#DDE6DF]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#173F2D] mb-1">
              <Shield className="w-3.5 h-3.5 text-[#173F2D]" />
              <span>CERTIFIED FLEET • PRISTINE CONDITION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18251D] tracking-tight">
              Popular Executive Vehicles
            </h2>
            <p className="text-xs sm:text-sm text-[#66736A] mt-1 max-w-xl">
              Every car undergoes a 120-point digital inspection prior to dispatch. Zero odometer tampering guaranteed.
            </p>
          </div>

          {/* Filter Pills and View All Link */}
          <div className="flex flex-wrap items-center gap-2.5">
            {fleetFilterTabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveFleetTab(tab.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeFleetTab === tab.value
                    ? "bg-[#173F2D] text-white shadow-xs"
                    : "bg-[#F7FAF7] text-[#66736A] hover:bg-[#EEF5EF] hover:text-[#18251D] border border-[#DDE6DF]"
                }`}
              >
                {tab.label}
              </button>
            ))}

            <Link
              href="/cars"
              className="inline-flex items-center gap-1.5 ml-2 text-xs font-bold text-[#173F2D] hover:text-[#2F7650] transition-colors group"
            >
              <span>View all 24 cars</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-[#F7FAF7] border border-[#DDE6DF] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFleet.slice(0, 3).map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </section>

      {/* 3. PICK UP ANYWHERE IN 15 MINUTES (HUBS & LIVE TELEMETRY MAP) */}
      <section id="hubs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#173F2D] mb-1">
            <Navigation className="w-3.5 h-3.5 text-[#173F2D]" />
            <span>STRATEGIC NETWORK & UTTAR PRADESH ARTERY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#18251D] tracking-tight">
            Pick Up Anywhere in 15 Minutes
          </h2>
          <p className="text-xs sm:text-sm text-[#66736A] mt-1 max-w-2xl">
            Direct lounge access, automated express key-lockers, and rapid terminal delivery across the Golden Triangle of eastern and central Uttar Pradesh.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: UP Hub Stations List */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Hub 1: Prayagraj */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDE6DF] hover:border-[#CAD7CC] transition-all space-y-3 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-[#18251D] text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#237447]" />
                    Prayagraj Executive Hub
                  </h4>
                  <p className="text-xs text-[#66736A] mt-0.5">Civil Lines • 400m from Prayagraj Junction</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF]">
                  18 CARS
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-[#66736A] pt-2 border-t border-[#DDE6DF]">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#237447]" /> Fast DC Chargers
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-[#237447]" /> 24/7 Smart Lockers
                </span>
              </div>
            </div>

            {/* Hub 2: Lucknow */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDE6DF] hover:border-[#CAD7CC] transition-all space-y-3 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-[#18251D] text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#237447]" />
                    Lucknow Airport & Gomti Nagar
                  </h4>
                  <p className="text-xs text-[#66736A] mt-0.5">Chaudhary Charan Singh T3 & Gomti Nagar Lounge</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF]">
                  22 CARS
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-[#66736A] pt-2 border-t border-[#DDE6DF]">
                <span className="flex items-center gap-1">
                  <Car className="w-3 h-3 text-[#237447]" /> Airport Curbside
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#237447]" /> Chauffeur Standby
                </span>
              </div>
            </div>

            {/* Hub 3: Varanasi */}
            <div className="p-5 rounded-2xl bg-white border border-[#DDE6DF] hover:border-[#CAD7CC] transition-all space-y-3 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-[#18251D] text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#237447]" />
                    Varanasi Cantt Heritage Hub
                  </h4>
                  <p className="text-xs text-[#66736A] mt-0.5">Cantt Station Precinct • Babatpur Airport Express</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF]">
                  8 CARS
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-[#66736A] pt-2 border-t border-[#DDE6DF]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#237447]" /> Hotel Delivery
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#237447]" /> Zero Inspection Delay
                </span>
              </div>
            </div>

            {/* Expressways Banner */}
            <div className="p-4 rounded-2xl bg-[#EEF5EF] border border-[#DDE6DF] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#173F2D] block">
                  INTER-CITY FAST RUN
                </span>
                <p className="font-bold text-xs text-[#18251D]">Purvanchal & Bundelkhand Expressways</p>
              </div>
              <span className="text-xl">⚡</span>
            </div>
          </div>

          {/* Right: Tactical Interactive Map Visual */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-[#DDE6DF] bg-[#F7FAF7] min-h-[420px] flex flex-col justify-between p-6 shadow-xs">
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#DDE6DF_1px,transparent_1px)] [background-size:20px_20px] opacity-70" />

            {/* Map Top Status Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#DDE6DF] text-[11px] font-bold text-[#18251D] shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#237447] animate-pulse" />
                <span>Live Hub Telemetry • GPS Active</span>
              </div>
              <span className="text-xs font-semibold text-[#66736A]">Uttar Pradesh Region</span>
            </div>

            {/* Geographic Hub Nodes */}
            <div className="relative z-10 my-auto py-12 px-6">
              {/* Lucknow Node */}
              <div className="relative mb-12 ml-16 max-w-xs p-3 rounded-2xl bg-white border border-[#DDE6DF] shadow-md inline-flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#237447] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#237447]" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#18251D]">Lucknow Hub</p>
                  <span className="text-[10px] text-[#237447] font-bold">22 Available</span>
                </div>
              </div>

              {/* Connecting Artery Line */}
              <div className="h-0.5 w-48 bg-gradient-to-r from-[#237447] to-[#43865B] ml-28 my-3 rotate-12" />

              {/* Prayagraj Node */}
              <div className="relative ml-44 max-w-xs p-3 rounded-2xl bg-white border border-[#173F2D] shadow-md inline-flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#173F2D] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#173F2D]" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#18251D]">Prayagraj Hub (Flagship)</p>
                  <span className="text-[10px] text-[#173F2D] font-bold">18 Available</span>
                </div>
              </div>

              {/* Varanasi Node */}
              <div className="relative mt-8 ml-64 max-w-xs p-3 rounded-2xl bg-white border border-[#DDE6DF] shadow-md inline-flex items-center gap-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#237447] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#237447]" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#18251D]">Varanasi Cantt Hub</p>
                  <span className="text-[10px] text-[#237447] font-bold">8 Available</span>
                </div>
              </div>
            </div>

            {/* Bottom Map Info Footer */}
            <div className="relative z-10 flex items-center justify-between text-xs text-[#66736A] border-t border-[#DDE6DF] pt-3">
              <span>⚡ Express Highway Permitted: NH-19, Bundelkhand & Purvanchal</span>
              <Link href="/cars" className="text-[#173F2D] hover:text-[#2F7650] font-bold flex items-center gap-1">
                <span>Explore Hub Addresses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE RENT-A-RIDE ADVANTAGE (BENTO GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#173F2D]">
            THE RENT-A-RIDE ADVANTAGE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#18251D] tracking-tight">
            Uncompromising Quality & Assurance
          </h2>
          <p className="text-xs sm:text-sm text-[#66736A]">
            Built for corporate dignitaries, elite families, and road enthusiasts demanding reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bento Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE6DF] hover:border-[#CAD7CC] transition-all space-y-4 group shadow-xs hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#18251D]">45-Sec DigiLocker KYC</h3>
            <p className="text-xs text-[#66736A] leading-relaxed">
              No physical photocopy verification. Scan your Aadhaar or Driving License directly via government API for instant unlocking.
            </p>
          </div>

          {/* Bento Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE6DF] hover:border-[#CAD7CC] transition-all space-y-4 group shadow-xs hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#18251D]">Doorstep & Valet Drop</h3>
            <p className="text-xs text-[#66736A] leading-relaxed">
              Delivered right to your office, premium hotel lobby, or residence in Prayagraj, Lucknow, or Varanasi without delays.
            </p>
          </div>

          {/* Bento Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE6DF] hover:border-[#CAD7CC] transition-all space-y-4 group shadow-xs hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#18251D]">Zero-Dep Comprehensive</h3>
            <p className="text-xs text-[#66736A] leading-relaxed">
              Full bumper-to-bumper insurance with roadside rescue. In the rare event of mechanical failure, replacement within 40 minutes.
            </p>
          </div>

          {/* Bento Card 4 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE6DF] hover:border-[#CAD7CC] transition-all space-y-4 group shadow-xs hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-[#18251D]">Corporate GST Billing</h3>
            <p className="text-xs text-[#66736A] leading-relaxed">
              Automated GST credit invoices generated directly at trip checkout. Consolidated billing solutions for enterprises and event stays.
            </p>
          </div>
        </div>
      </section>

      {/* 4.5. INTERACTIVE FLEET STATION NETWORK (Geoapify Maps API) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#DDE6DF]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#173F2D] flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" />
              <span>STATION NETWORK & COVERAGE</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18251D] tracking-tight mt-1">
              Explore Our Hubs & Pickups
            </h2>
          </div>
          <p className="text-xs text-[#66736A] max-w-md">
            Interactive map powered by Geoapify. Select any depot across Prayagraj, Lucknow, and Varanasi to discover available fleet units.
          </p>
        </div>

        <HubLocationMap height="h-[420px]" />
      </section>

      {/* 5. VERIFIED REVIEWS */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#DDE6DF]">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#173F2D]">
              VERIFIED REVIEWS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#18251D] tracking-tight mt-1">
              Trusted by Travelers Across UP
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-[#A86B18] bg-[#F7FAF7] px-3.5 py-1.5 rounded-full border border-[#DDE6DF] shadow-xs">
            <Star className="w-4 h-4 fill-[#A86B18] text-[#A86B18]" />
            <span>4.92 / 5.0 (2,400+ rides)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE6DF] space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#A86B18]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#A86B18]" />
                ))}
              </div>
              <p className="text-xs text-[#66736A] leading-relaxed italic">
                &ldquo;Reserved the BMW 330i for an official summit from Prayagraj to Lucknow. The car was spotless, 4 kg/bar tyre pressure was seamless, and zero deposit made it friction-free.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-[#DDE6DF]">
              <div className="w-8 h-8 rounded-full bg-[#173F2D] text-white flex items-center justify-center font-bold text-xs">
                SR
              </div>
              <div>
                <p className="font-bold text-xs text-[#18251D]">Shriyam Rastogi</p>
                <p className="text-[10px] text-[#66736A]">Prayagraj Executive Renter</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE6DF] space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#A86B18]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#A86B18]" />
                ))}
              </div>
              <p className="text-xs text-[#66736A] leading-relaxed italic">
                &ldquo;We booked the Audi A6 straight to Lucknow Airport T3 for our delegates. Delivered right on time outside on schedule. The automated billing and GST invoices saved our corporate team hours.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-[#DDE6DF]">
              <div className="w-8 h-8 rounded-full bg-[#173F2D] text-white flex items-center justify-center font-bold text-xs">
                AK
              </div>
              <div>
                <p className="font-bold text-xs text-[#18251D]">Ananya Kapoor</p>
                <p className="text-[10px] text-[#66736A]">Corporate Legal Partner</p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDE6DF] space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-[#A86B18]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#A86B18]" />
                ))}
              </div>
              <p className="text-xs text-[#66736A] leading-relaxed italic">
                &ldquo;Took the Mercedes C-Class for a weekend heritage drive from Varanasi to Ayodhya. Premium telematics, crystal-clear sound system, and zero paperwork hassle. Absolutely five stars.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-[#DDE6DF]">
              <div className="w-8 h-8 rounded-full bg-[#173F2D] text-white flex items-center justify-center font-bold text-xs">
                VM
              </div>
              <div>
                <p className="font-bold text-xs text-[#18251D]">Vikramaditya Mishra</p>
                <p className="text-[10px] text-[#66736A]">Varanasi Cantt Hub</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl p-8 sm:p-12 overflow-hidden bg-[#173F2D] text-white shadow-md">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EEF5EF]">
              READY FOR THE NEXT JOURNEY?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Unlock Your Preferred Vehicle in Under 2 Minutes
            </h2>
            <p className="text-xs sm:text-sm text-[#EEF5EF]/90 leading-relaxed">
              Select your ride, complete identification via DigiLocker, and roll on. Always at your convenience: 24/7 dedicated executive support.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/cars"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#173F2D] bg-white hover:bg-[#EEF5EF] shadow-xs transition-all cursor-pointer"
              >
                <span>Browse All 48 Cars</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:18005557433"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-[#24583C] hover:bg-[#2F7650] border border-[#43865B] transition-all"
              >
                <PhoneCall className="w-4 h-4 text-[#EEF5EF]" />
                <span>Talk to Fleet Manager</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
