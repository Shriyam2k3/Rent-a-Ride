"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ICar, IReview } from "@/types";
import BookingWidget from "@/components/booking-widget";
import ReviewModal from "@/components/review-modal";
import { useAuth } from "@/lib/firebase/auth-context";
import {
  ArrowLeft,
  Star,
  Users,
  Gauge,
  Fuel,
  Check,
  MapPin,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function CarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();

  const [car, setCar] = useState<ICar | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const fetchCar = async () => {
    try {
      const res = await fetch(`/api/cars/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCar(data.car);
        setReviews(data.reviews || []);
      }
    } catch (e) {
      console.error("Failed to load car details:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-slate-500">Loading vehicle details...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Vehicle Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested vehicle may have been removed or the ID is incorrect.
        </p>
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-sm"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/cars"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all vehicles</span>
        </Link>

        <span className="text-xs font-medium text-slate-400">
          {car.brand} / {car.model} ({car.year})
        </span>
      </div>

      {/* Main Grid: Gallery & Specs (Col 1-2) + Booking Widget (Col 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Car Photos, Specs, Description, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-900 text-white">
                {car.category}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {car.year} Model
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 ml-auto bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{car.rating ? car.rating.toFixed(1) : "5.0"}</span>
                <span className="text-slate-400 font-normal">({car.reviewCount || 0} reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {car.title}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{car.location.address}, {car.location.city}</span>
            </p>
          </div>

          {/* Photo Gallery */}
          <div className="space-y-3">
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
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
                    className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-emerald-600 ring-2 ring-emerald-600/20"
                        : "border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="Thumb" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Specifications Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-4">
              Vehicle Specifications
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                <span className="text-slate-400 font-medium">Transmission</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-emerald-600" />
                  {car.transmission}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                <span className="text-slate-400 font-medium">Fuel / Energy</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Fuel className="w-4 h-4 text-emerald-600" />
                  {car.fuelType}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                <span className="text-slate-400 font-medium">Seating</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  {car.seats} Passengers
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1">
                <span className="text-slate-400 font-medium">Doors</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  {car.doors} Doors
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
              About This Vehicle
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {car.description}
            </p>
          </div>

          {/* Features Checklist */}
          {car.features && car.features.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Included Features & Equipment
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {car.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guarantee / Policy */}
          <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-5 flex items-start gap-4 text-xs text-slate-600">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 text-sm mb-1">Rent-a-Ride Clean & Safe Guarantee</p>
              <p className="leading-relaxed">
                This vehicle has completed a 45-point maintenance and sanitization check prior to being dispatched. Includes 24/7 roadside mechanical assistance across India.
              </p>
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Verified Customer Reviews</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"} from authentic renters
                </p>
              </div>

              <button
                type="button"
                onClick={() => setReviewModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-emerald-600 hover:border-emerald-300 bg-white shadow-xs transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Write a Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                No reviews yet for this vehicle. Be the first to rent and share your rating!
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev._id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                          {rev.userName?.charAt(0) || "U"}
                        </div>
                        <span className="font-semibold text-xs text-slate-900">{rev.userName}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic pl-9">
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
