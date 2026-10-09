"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, MessageSquare, Car, ArrowRight } from "lucide-react";

export default function UserReviewsPage() {
  const [reviews] = useState([
    {
      _id: "my_rev_1",
      carTitle: "Tesla Model 3 Long Range",
      rating: 5,
      comment: "Renting the Tesla Model 3 was seamless from start to finish. The car was spotless, fully charged, and the pickup process took less than 3 minutes.",
      date: "Oct 2, 2024",
    },
    {
      _id: "my_rev_2",
      carTitle: "BMW 3 Series 330i M Sport",
      rating: 4,
      comment: "Great experience with the BMW 3 Series. The car drove like a dream. Minor wait during return at the airport, but staff was very professional.",
      date: "Sep 15, 2024",
    },
  ]);

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Customer Voice
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-0.5">My Reviews & Ratings</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track the reviews and ratings you have shared for rented vehicles.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev._id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{rev.carTitle}</h4>
                  <span className="text-[11px] text-slate-400">Reviewed on {rev.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-400 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-slate-800">{rev.rating}.0</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic pl-13">
              &ldquo;{rev.comment}&rdquo;
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-100 rounded-3xl p-6 text-center space-y-3">
        <MessageSquare className="w-6 h-6 text-slate-400 mx-auto" />
        <h4 className="font-bold text-sm text-slate-800">Want to review another vehicle?</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Completed a rental recently? You can leave ratings directly from your booking receipts.
        </p>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-emerald-600 transition-colors cursor-pointer"
        >
          <span>Go to Booking Receipts</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
