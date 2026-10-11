"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ICar, IReview } from "@/types";
import BookingWidget from "@/components/booking-widget";
import ReviewModal from "@/components/review-modal";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  Star,
  Users,
  Gauge,
  Fuel,
  Calendar,
  Check,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  MapPin,
  MessageSquare,
} from "lucide-react";

export default function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const carId = resolvedParams.id;

  const { user } = useAuth();
  const [car, setCar] = useState<ICar | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const fetchCar = async () => {
    try {
      const res = await fetch(`/api/cars/${carId}`);
      if (res.ok) {
        const data = await res.json();
        setCar(data.car);
      }
    } catch (e) {
      console.error("Failed to load car details", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?carId=${carId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error("Failed to load reviews", e);
    }
  };

  useEffect(() => {
    fetchCar();
    fetchReviews();
  }, [carId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#173F2D]" />
        <p className="text-sm font-medium text-[#66736A]">Loading vehicle details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4 bg-white">
        <h2 className="text-xl font-bold text-[#18251D]">Vehicle Not Found</h2>
        <p className="text-xs text-[#66736A]">
          The requested vehicle may have been removed or the ID is incorrect.
        </p>
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#173F2D] text-white text-xs font-semibold hover:bg-[#2F7650] shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Fleet
        </Link>
      </div>
    );
  }

  const primaryImage =
    car.images?.[selectedImageIndex] ||
    car.images?.[0] ||
    "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-white text-[#18251D]">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DDE6DF]">
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#66736A] hover:text-[#173F2D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all vehicles</span>
        </Link>

        <span className="text-xs font-semibold text-[#66736A]">
          {car.brand} / {car.model} ({car.year})
        </span>
      </div>

      {/* Main Grid: Gallery & Specs (Col 1-2) + Booking Widget (Col 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Car Photos, Specs, Description, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D]">
                {car.category}
              </span>
              <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-[#F7FAF7] text-[#18251D] border border-[#DDE6DF]">
                {car.year} Model
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#A86B18] ml-auto bg-[#F7FAF7] px-3 py-1 rounded-lg border border-[#DDE6DF]">
                <Star className="w-3.5 h-3.5 fill-[#A86B18] text-[#A86B18]" />
                <span>{car.rating ? car.rating.toFixed(1) : "5.0"}</span>
                <span className="text-[#66736A] font-normal">({car.reviewCount || 0} reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#18251D] tracking-tight">
              {car.title}
            </h1>
            <p className="text-xs text-[#66736A] flex items-center gap-1.5 mt-2 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#173F2D]" />
              <span>{car.location.address}, {car.location.city} Hub</span>
            </p>
          </div>

          {/* Photo Gallery */}
          <div className="space-y-3">
            <div className="relative w-full h-[380px] sm:h-[450px] rounded-2xl overflow-hidden bg-[#F7FAF7] border border-[#DDE6DF] shadow-md">
              <Image
                src={primaryImage}
                alt={car.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Thumbnail switcher if multiple images */}
            {car.images && car.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {car.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx
                        ? "border-[#173F2D] ring-2 ring-[#173F2D]/20"
                        : "border-[#DDE6DF] hover:border-[#CAD7CC] opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="Thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specifications Grid */}
          <div className="bg-white rounded-2xl border border-[#DDE6DF] p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-[#173F2D] uppercase tracking-wider">
              VEHICLE SPECIFICATIONS & TELEMETRY
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] flex flex-col gap-1">
                <span className="text-[#66736A] font-semibold text-[11px]">Transmission</span>
                <span className="font-bold text-[#18251D] flex items-center gap-1.5 mt-0.5">
                  <Gauge className="w-4 h-4 text-[#173F2D]" />
                  {car.transmission}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] flex flex-col gap-1">
                <span className="text-[#66736A] font-semibold text-[11px]">Fuel / Energy</span>
                <span className="font-bold text-[#18251D] flex items-center gap-1.5 mt-0.5">
                  <Fuel className="w-4 h-4 text-[#173F2D]" />
                  {car.fuelType}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] flex flex-col gap-1">
                <span className="text-[#66736A] font-semibold text-[11px]">Seating</span>
                <span className="font-bold text-[#18251D] flex items-center gap-1.5 mt-0.5">
                  <Users className="w-4 h-4 text-[#173F2D]" />
                  {car.seats} Passengers
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7FAF7] border border-[#DDE6DF] flex flex-col gap-1">
                <span className="text-[#66736A] font-semibold text-[11px]">Doors</span>
                <span className="font-bold text-[#18251D] flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-4 h-4 text-[#173F2D]" />
                  {car.doors} Doors
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-[#DDE6DF] p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-[#173F2D] uppercase tracking-wider">
              ABOUT THIS VEHICLE
            </h3>
            <p className="text-xs sm:text-sm text-[#66736A] leading-relaxed">
              {car.description}
            </p>
          </div>

          {/* Features Checklist */}
          {car.features && car.features.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#DDE6DF] p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-xs text-[#173F2D] uppercase tracking-wider">
                INCLUDED FEATURES & EQUIPMENT
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {car.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-[#18251D]">
                    <div className="w-5 h-5 rounded-full bg-[#EEF5EF] border border-[#DDE6DF] text-[#173F2D] flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guarantee / Policy */}
          <div className="bg-[#EEF5EF] rounded-2xl border border-[#DDE6DF] p-6 flex items-start gap-4 text-xs text-[#18251D] shadow-xs">
            <ShieldCheck className="w-6 h-6 text-[#173F2D] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#173F2D] text-sm mb-1">Rent-a-Ride Clean & Safe Guarantee</p>
              <p className="leading-relaxed text-[#66736A]">
                This vehicle has completed a 45-point maintenance and sanitization check prior to being dispatched. Includes 24/7 roadside mechanical assistance across Uttar Pradesh expressways.
              </p>
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="bg-white rounded-2xl border border-[#DDE6DF] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE6DF]">
              <div>
                <h3 className="font-extrabold text-base text-[#18251D]">Verified Customer Reviews</h3>
                <p className="text-xs text-[#66736A] mt-0.5">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"} from authentic renters
                </p>
              </div>

              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#DDE6DF] text-xs font-bold text-[#173F2D] hover:bg-[#EEF5EF] bg-white transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#173F2D]" />
                <span>Write a Review</span>
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#66736A] bg-[#F7FAF7] rounded-xl border border-[#DDE6DF]">
                No reviews yet for this vehicle. Be the first to rent and share your rating!
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-[#DDE6DF]">
                {reviews.map((rev) => (
                  <div key={rev._id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#173F2D] text-white flex items-center justify-center font-bold text-xs">
                          {rev.userName?.charAt(0) || "U"}
                        </div>
                        <span className="font-bold text-xs text-[#18251D]">{rev.userName}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[#A86B18]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "fill-[#A86B18] text-[#A86B18]" : "text-[#DDE6DF]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#66736A] leading-relaxed italic pl-9">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="lg:col-span-1">
          <BookingWidget car={car} />
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        carId={car._id}
        carTitle={car.title}
        userId={user?.uid}
        userName={user?.displayName || user?.email?.split("@")[0]}
        onSuccess={fetchCar}
      />
    </div>
  );
}
