"use client";

import React, { useState } from "react";
import { UserCheck, Search, ShieldCheck, Phone, MapPin, Star, Plus } from "lucide-react";

export default function AdminDriversPage() {
  const [search, setSearch] = useState("");

  const drivers = [
    {
      id: "drv-1",
      name: "Rameshwar Singh",
      phone: "+91 98391 22345",
      hub: "Civil Lines Hub, Prayagraj",
      rating: 4.9,
      trips: 184,
      status: "Available",
      license: "UP-70-2018-004912",
    },
    {
      id: "drv-2",
      name: "Amit Kumar Yadav",
      phone: "+91 94150 99823",
      hub: "Bamrauli Airport Station, Prayagraj",
      rating: 4.8,
      trips: 142,
      status: "On Trip",
      license: "UP-70-2019-009182",
    },
    {
      id: "drv-3",
      name: "Suresh Chandra Gupta",
      phone: "+91 91250 88219",
      hub: "Gomti Nagar Hub, Lucknow",
      rating: 5.0,
      trips: 210,
      status: "Available",
      license: "UP-32-2016-003491",
    },
    {
      id: "drv-4",
      name: "Vikas Pandey",
      phone: "+91 99360 44102",
      hub: "Varanasi Airport Hub",
      rating: 4.7,
      trips: 98,
      status: "Available",
      license: "UP-65-2020-001289",
    },
  ];

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.hub.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block mb-1">
            Chauffeur & Fleet Pilots
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Registered Drivers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Certified chauffeurs and transfer drivers assigned across UP regional hubs.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#101827] hover:bg-[#172033] text-white font-bold text-xs shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Register New Driver</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search driver name, phone, or hub..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#172033] placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Driver cards table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-3.5">Driver Name</th>
                <th className="px-6 py-3.5">Assigned Station</th>
                <th className="px-6 py-3.5">Contact Number</th>
                <th className="px-6 py-3.5">Commercial DL</th>
                <th className="px-6 py-3.5">Rating & Trips</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((drv) => (
                <tr key={drv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-[#172033] font-bold flex items-center justify-center border border-slate-200">
                        {drv.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-[#172033] block">{drv.name}</span>
                        <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          Background Verified
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{drv.hub}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{drv.phone}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 font-mono text-slate-500 text-[11px]">
                    {drv.license}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-[11px]">{drv.rating}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">({drv.trips} trips)</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        drv.status === "Available"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {drv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
