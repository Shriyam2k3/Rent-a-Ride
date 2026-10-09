"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  resolveCoordinates,
  calculateDistanceKm,
  calculateBearing,
  generateRoutePoints,
  generateTurnByTurnDirections,
  ASSIGNED_DRIVERS,
  LatLng,
  DriverInfo,
  NavigationStep,
} from "@/lib/tracking-data";
import {
  Navigation,
  Compass,
  MapPin,
  Clock,
  Gauge,
  Phone,
  MessageSquare,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Crosshair,
  Share2,
  CheckCircle2,
  Volume2,
  VolumeX,
  Layers,
} from "lucide-react";

interface LiveTripTrackerProps {
  bookingId?: string;
  bookingCode?: string;
  pickupLocation: string;
  returnLocation: string;
  carTitle?: string;
  carImage?: string;
  carCategory?: string;
  driverName?: string;
  driverPhone?: string;
  status?: string;
  className?: string;
}

export default function LiveTripTracker({
  bookingCode = "RAR-CURRENT",
  pickupLocation,
  returnLocation,
  carTitle = "Rental Vehicle",
  carImage = "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
  driverName,
  driverPhone,
  status = "confirmed",
  className = "",
}: LiveTripTrackerProps) {
  // Determine Origin & Destination GPS Coordinates
  const originCoords: LatLng = useMemo(() => {
    return resolveCoordinates(pickupLocation, { lat: 25.4524, lng: 81.8340 });
  }, [pickupLocation]);

  const destCoords: LatLng = useMemo(() => {
    return resolveCoordinates(returnLocation, { lat: 25.4402, lng: 81.7341 });
  }, [returnLocation]);

  // Route path points (interpolated curve along Prayagraj roadways)
  const routePoints = useMemo(() => {
    return generateRoutePoints(originCoords, destCoords, 100);
  }, [originCoords, destCoords]);

  const totalTripKm = useMemo(() => {
    return calculateDistanceKm(originCoords, destCoords) || 8.4;
  }, [originCoords, destCoords]);

  const directions: NavigationStep[] = useMemo(() => {
    return generateTurnByTurnDirections(pickupLocation, returnLocation, totalTripKm);
  }, [pickupLocation, returnLocation, totalTripKm]);

  // Assigned driver
  const driver: DriverInfo = useMemo(() => {
    const base = ASSIGNED_DRIVERS[0];
    return {
      ...base,
      name: driverName || base.name,
      phone: driverPhone || base.phone,
    };
  }, [driverName, driverPhone]);

  // Simulation & Real-time Tracking State
  const [currentIndex, setCurrentIndex] = useState(0); // 0 to routePoints.length - 1
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "turns">("map");
  const [copiedLink, setCopiedLink] = useState(false);
  const [mapStyle, setMapStyle] = useState<"osm" | "dark" | "satellite">("osm");

  // Telemetry values
  const currentPos: LatLng = routePoints[currentIndex] || originCoords;
  const nextPos: LatLng = routePoints[Math.min(currentIndex + 1, routePoints.length - 1)] || currentPos;
  const bearing = useMemo(() => calculateBearing(currentPos, nextPos), [currentPos, nextPos]);

  const progressFraction = routePoints.length > 1 ? currentIndex / (routePoints.length - 1) : 0;
  const remainingKm = Number((totalTripKm * (1 - progressFraction)).toFixed(1));
  const estimatedMinsLeft = Math.max(1, Math.round((remainingKm / 35) * 60)); // based on 35 km/h avg city speed
  const currentSpeedKmH =
    progressFraction >= 1
      ? 0
      : Math.round(32 + Math.sin(currentIndex * 0.4) * 12 * (simSpeed === 1 ? 1 : 1.2));

  // Determine current trip phase label
  const tripPhase = useMemo(() => {
    if (status === "completed" || progressFraction >= 1) return "Arrived at Destination";
    if (progressFraction <= 0.05) return "Trip Started • Departing Origin";
    if (progressFraction <= 0.3) return "En Route • Approaching City Arterial";
    if (progressFraction <= 0.7) return "Cruising on Express Corridor";
    if (progressFraction <= 0.95) return "Approaching Destination Hub";
    return "Arriving at Gate";
  }, [progressFraction, status]);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) return;
    if (currentIndex >= routePoints.length - 1) {
      setIsPlaying(false);
      return;
    }

    const intervalTime = Math.max(120, Math.floor(650 / simSpeed));
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= routePoints.length - 1) {
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, simSpeed, currentIndex, routePoints.length]);

  // Audio cue simulation on trip start / complete
  useEffect(() => {
    if (!soundEnabled) return;
    try {
      if (typeof window !== "undefined" && window.AudioContext) {
        const ctx = new window.AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(progressFraction >= 1 ? 880 : 520, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch {
      // AudioContext muted or blocked
    }
  }, [soundEnabled, progressFraction]);

  // Share live tracking link
  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Canvas / SVG Coordinate Projection Math
  // Calculate bounding box containing all route points with healthy padding
  const { minLat, maxLat, minLng, maxLng } = useMemo(() => {
    let minLat = 90;
    let maxLat = -90;
    let minLng = 180;
    let maxLng = -180;

    for (const pt of routePoints) {
      if (pt.lat < minLat) minLat = pt.lat;
      if (pt.lat > maxLat) maxLat = pt.lat;
      if (pt.lng < minLng) minLng = pt.lng;
      if (pt.lng > maxLng) maxLng = pt.lng;
    }

    // Add 25% padding so pins never touch edges
    const latSpan = Math.max(maxLat - minLat, 0.015);
    const lngSpan = Math.max(maxLng - minLng, 0.015);
    const padLat = latSpan * 0.22;
    const padLng = lngSpan * 0.22;

    return {
      minLat: minLat - padLat,
      maxLat: maxLat + padLat,
      minLng: minLng - padLng,
      maxLng: maxLng + padLng,
    };
  }, [routePoints]);

  // Function to convert LatLng to SVG viewport [0..1000] x [0..600]
  const project = useCallback(
    (pt: LatLng) => {
      const x = ((pt.lng - minLng) / (maxLng - minLng)) * 1000;
      // Invert Y since latitude increases northward (up) while SVG y increases downward (down)
      const y = (1 - (pt.lat - minLat) / (maxLat - minLat)) * 600;
      return { x, y };
    },
    [minLat, maxLat, minLng, maxLng]
  );

  const originSvg = project(originCoords);
  const destSvg = project(destCoords);
  const carSvg = project(currentPos);

  // SVG polyline path strings
  const fullPathD = useMemo(() => {
    if (routePoints.length === 0) return "";
    return routePoints.reduce((acc, pt, i) => {
      const p = project(pt);
      return `${acc} ${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }, "");
  }, [routePoints, project]);

  const completedPathD = useMemo(() => {
    const completedSlice = routePoints.slice(0, currentIndex + 1);
    if (completedSlice.length === 0) return "";
    return completedSlice.reduce((acc, pt, i) => {
      const p = project(pt);
      return `${acc} ${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }, "");
  }, [routePoints, currentIndex, project]);

  const remainingPathD = useMemo(() => {
    const remainingSlice = routePoints.slice(currentIndex);
    if (remainingSlice.length === 0) return "";
    return remainingSlice.reduce((acc, pt, i) => {
      const p = project(pt);
      return `${acc} ${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }, "");
  }, [routePoints, currentIndex, project]);

  // Google Maps dynamic container ref
  const googleMapRef = useRef<HTMLDivElement>(null);
  const [googleMapsReady, setGoogleMapsReady] = useState(false);
  const googleApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_MAP_API_KEY ||
    "";

  useEffect(() => {
    if (!googleApiKey || googleApiKey.length < 10) return;
    // Check if script is already present
    if (typeof window !== "undefined" && !(window as unknown as { google?: unknown }).google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = () => setGoogleMapsReady(true);
      document.head.appendChild(script);
    } else {
      setGoogleMapsReady(true);
    }
  }, [googleApiKey]);

  return (
    <div
      className={`bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden ${className}`}
    >
      {/* HEADER BAR: Live Telemetry Status Banner */}
      <div className="bg-[#101827] text-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Live GPS Trip Tracking
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-slate-300 border border-slate-700">
                Ref #{bookingCode}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 mt-0.5">
              <span>{tripPhase}</span>
            </h3>
          </div>
        </div>

        {/* Live HUD Quick Counters */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs">
          <div className="bg-slate-800/90 px-3 py-2 rounded-xl border border-slate-700/80 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block leading-none">Speed</span>
              <span className="font-extrabold text-white text-xs">{currentSpeedKmH} km/h</span>
            </div>
          </div>

          <div className="bg-slate-800/90 px-3 py-2 rounded-xl border border-slate-700/80 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block leading-none">ETA</span>
              <span className="font-extrabold text-white text-xs">{estimatedMinsLeft} mins</span>
            </div>
          </div>

          <div className="bg-slate-800/90 px-3 py-2 rounded-xl border border-slate-700/80 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block leading-none">Remaining</span>
              <span className="font-extrabold text-white text-xs">{remainingKm} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE MAP CONTAINER */}
      <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] bg-[#E8EEF5] dark:bg-[#0B132B] overflow-hidden select-none">
        {/* If Google Maps API key loaded and ready, allow mounting */}
        {googleMapsReady && (
          <div ref={googleMapRef} className="absolute inset-0 w-full h-full z-0 hidden" />
        )}

        {/* MAP BACKGROUND CANVAS / CARTOGRAPHY VISUALIZATION */}
        <div
          className={`absolute inset-0 w-full h-full transition-colors duration-500 ${
            mapStyle === "dark"
              ? "bg-[#0b0f19]"
              : mapStyle === "satellite"
              ? "bg-[#18231c]"
              : "bg-[#eaf1f8] dark:bg-[#0c1222]"
          }`}
        >
          {/* Subtle grid pattern resembling real GPS mapping grid */}
          <div
            className="absolute inset-0 opacity-25 dark:opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(16, 185, 129, 0.4) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Prayagraj Rivers Visualization (Ganga & Yamuna Sangam curves) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="gangaRiver" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.45" />
              </linearGradient>
              <linearGradient id="routeGradientPast" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="routeGradientFuture" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#34D399" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#6EE7B7" stopOpacity="0.5" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stylized Holy Triveni Sangam River Curve */}
            <path
              d="M 50,580 Q 300,520 540,430 T 980,310"
              fill="none"
              stroke="url(#gangaRiver)"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M 320,590 Q 520,510 540,430 T 950,330"
              fill="none"
              stroke="url(#gangaRiver)"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Secondary Prayagraj Roadways Mesh */}
            <path
              d="M 120,80 L 880,520 M 240,560 L 760,60 M 50,280 L 950,260"
              stroke={mapStyle === "dark" ? "#1e293b" : "#cbd5e1"}
              strokeWidth="3"
              strokeDasharray="6,4"
              opacity="0.35"
            />

            {/* 1. Base Full Route Shadow */}
            <path
              d={fullPathD}
              fill="none"
              stroke="#0f172a"
              strokeWidth="10"
              strokeOpacity="0.12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 2. Remaining Route Path (Dashed Emerald Trail) */}
            {remainingPathD && (
              <path
                d={remainingPathD}
                fill="none"
                stroke="#10B981"
                strokeWidth="5"
                strokeOpacity="0.45"
                strokeDasharray="8,6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* 3. Completed Route Path (Glowing Solid Green Trail) */}
            {completedPathD && (
              <path
                d={completedPathD}
                fill="none"
                stroke="url(#routeGradientPast)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
            )}
          </svg>
        </div>

        {/* MAP MARKERS OVERLAY */}

        {/* ORIGIN PIN (Green) */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-auto group cursor-pointer"
          style={{
            left: `${(originSvg.x / 1000) * 100}%`,
            top: `${(originSvg.y / 600) * 100}%`,
          }}
        >
          {/* Tooltip on hover */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
            <span className="text-emerald-400">PICKUP:</span> {pickupLocation}
          </div>

          <div className="relative flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-emerald-500/30 animate-ping absolute -top-1" />
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
              <MapPin className="w-4 h-4 fill-white" />
            </div>
            <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-700 text-white shadow-xs">
              ORIGIN
            </span>
          </div>
        </div>

        {/* DESTINATION PIN (Red / Checkered) */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-auto group cursor-pointer"
          style={{
            left: `${(destSvg.x / 1000) * 100}%`,
            top: `${(destSvg.y / 600) * 100}%`,
          }}
        >
          {/* Tooltip on hover */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap shadow-lg opacity-90 group-hover:opacity-100 transition-opacity">
            <span className="text-rose-400">RETURN:</span> {returnLocation}
          </div>

          <div className="relative flex flex-col items-center">
            <span className="w-6 h-6 rounded-full bg-rose-500/30 animate-ping absolute -top-1" />
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900">
              <Crosshair className="w-4 h-4 fill-white" />
            </div>
            <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-rose-700 text-white shadow-xs">
              DESTINATION
            </span>
          </div>
        </div>

        {/* MOVING RIDER / VEHICLE MARKER */}
        <div
          className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-linear pointer-events-auto"
          style={{
            left: `${(carSvg.x / 1000) * 100}%`,
            top: `${(carSvg.y / 600) * 100}%`,
          }}
        >
          {/* Dynamic Car Speed & Plate Pill */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 flex flex-col items-center pointer-events-none">
            <div className="px-2.5 py-1 rounded-full bg-[#101827] text-white text-[10px] font-bold shadow-xl border border-emerald-500/50 flex items-center gap-1.5 whitespace-nowrap animate-bounce duration-1000">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{driver.plateNumber}</span>
              <span className="text-emerald-400 font-extrabold">({currentSpeedKmH} km/h)</span>
            </div>
            <div className="w-2 h-2 bg-[#101827] rotate-45 -mt-1 border-r border-b border-emerald-500/50" />
          </div>

          {/* Vehicle Pulsing Icon Oriented by Bearing */}
          <div className="relative flex items-center justify-center">
            {/* GPS Pulse Ring */}
            <span className="w-12 h-12 rounded-full bg-emerald-500/25 animate-ping absolute" />
            <span className="w-8 h-8 rounded-full bg-emerald-500/40 absolute" />

            {/* Oriented Vehicle Capsule */}
            <div
              className="w-11 h-11 rounded-full bg-[#101827] text-white border-2 border-emerald-400 flex items-center justify-center shadow-2xl transition-transform duration-300"
              style={{
                transform: `rotate(${bearing}deg)`,
              }}
              title={`Heading ${bearing}° • ${driver.vehicleModel}`}
            >
              <Navigation className="w-5 h-5 text-emerald-400 fill-emerald-400" />
            </div>
          </div>
        </div>

        {/* FLOATING MAP CONTROLS OVERLAY */}
        <div className="absolute top-4 right-4 z-30 flex flex-col gap-2">
          {/* Map Style Selector */}
          <button
            type="button"
            onClick={() => {
              setMapStyle((prev) =>
                prev === "osm" ? "dark" : prev === "dark" ? "satellite" : "osm"
              );
            }}
            aria-label="Toggle Map Layer"
            title={`Current: ${mapStyle.toUpperCase()} Mode`}
            className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md text-slate-700 dark:text-slate-200 hover:bg-white cursor-pointer"
          >
            <Layers className="w-4 h-4 text-emerald-600" />
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            aria-label="Toggle Sound Cues"
            title={soundEnabled ? "Mute audio cues" : "Enable GPS audio beeps"}
            className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md text-slate-700 dark:text-slate-200 hover:bg-white cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Recenter on Rider */}
          <button
            type="button"
            onClick={() => {
              // Smooth momentary flash on rider
            }}
            title="Recenter on vehicle position"
            className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-md text-slate-700 dark:text-slate-200 hover:bg-white cursor-pointer"
          >
            <Compass className="w-4 h-4 text-slate-700 dark:text-slate-200" />
          </button>
        </div>

        {/* FLOATING BOTTOM PLAYBACK & SPEED CONTROLS */}
        <div className="absolute bottom-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-lg pointer-events-auto">
            {/* Play / Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span className="hidden sm:inline">Resume</span>
                </>
              )}
            </button>

            {/* Restart Simulation */}
            <button
              type="button"
              onClick={() => {
                setCurrentIndex(0);
                setIsPlaying(true);
              }}
              title="Reset trip to Origin"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Simulation Speed Pill Toggle */}
            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
              <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">Speed:</span>
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSimSpeed(s)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                    simSpeed === s
                      ? "bg-slate-900 dark:bg-emerald-600 text-white"
                      : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Coordinates HUD chip */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/90 text-white px-3 py-2 rounded-2xl border border-slate-800 backdrop-blur-md text-[11px] font-mono pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              GPS: {currentPos.lat.toFixed(4)}°N, {currentPos.lng.toFixed(4)}°E
            </span>
          </div>
        </div>
      </div>

      {/* TRIP PROGRESS SLIDER BAR */}
      <div className="bg-slate-100 dark:bg-slate-800/80 px-4 sm:px-6 py-2.5 border-t border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs">
        <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider shrink-0">
          Trip Completion
        </span>
        <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden relative">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.round(progressFraction * 100)}%` }}
          />
        </div>
        <span className="font-extrabold text-slate-900 dark:text-white text-xs shrink-0">
          {Math.round(progressFraction * 100)}%
        </span>
      </div>

      {/* BOTTOM INFO PANEL: Driver Card + Turn-by-Turn Directions */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white dark:bg-[#111827]">
        {/* DRIVER & VEHICLE DETAILS */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 dark:border-slate-600">
              <Image
                src={driver.avatar}
                alt={driver.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {driver.name}
                </h4>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ⭐ {driver.rating} • {driver.tripsCount} trips
              </p>
              <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mt-0.5">
                Assigned Fleet Pilot
              </p>
            </div>
          </div>

          {/* Vehicle summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Vehicle:</span>
              <span className="font-bold text-slate-900 dark:text-white">{carTitle}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400">Plate Number:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {driver.plateNumber}
              </span>
            </div>
          </div>

          {/* Contact & Actions */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${driver.phone}`}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Driver</span>
            </a>

            <button
              type="button"
              onClick={handleShare}
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{copiedLink ? "Link Copied!" : "Share Live"}</span>
            </button>
          </div>
        </div>

        {/* ROUTE WAYPOINTS & TURN GUIDANCE */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Live Route Guidance & Corridor Milestones
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Prayagraj Smart Mobility Network
            </span>
          </div>

          {/* Turn-by-Turn Step Cards */}
          <div className="space-y-2.5">
            {directions.map((step, idx) => {
              const isCurrentStep =
                progressFraction >= idx / directions.length &&
                progressFraction < (idx + 1) / directions.length;
              const isPastStep = progressFraction >= (idx + 1) / directions.length;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border text-xs flex items-start gap-3 transition-colors ${
                    isCurrentStep
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-slate-900 dark:text-white font-semibold"
                      : isPastStep
                      ? "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 line-through"
                      : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold ${
                      isCurrentStep
                        ? "bg-emerald-600 text-white"
                        : isPastStep
                        ? "bg-slate-200 dark:bg-slate-700 text-slate-500"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{step.instruction}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{step.street}</p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 shrink-0">
                    {step.distanceKm} km
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
