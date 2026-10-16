"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
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
  fetchGeoapifyRoute,
  GeoapifyRouteResult,
  GEOAPIFY_API_KEY,
} from "@/lib/geoapify";
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
  Sparkles,
} from "lucide-react";

// Client-side dynamic import of Leaflet map to ensure zero SSR hydration issues
const GeoapifyInteractiveMap = dynamic(
  () => import("@/components/map/geoapify-interactive-map"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[380px] bg-[#EEF5EF] flex flex-col items-center justify-center gap-3 text-[#173F2D]">
        <div className="w-8 h-8 rounded-full border-3 border-[#173F2D] border-t-transparent animate-spin" />
        <span className="text-xs font-bold text-[#173F2D]">
          Initializing Geoapify Vector & Tile Engine...
        </span>
      </div>
    ),
  }
);

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
    return resolveCoordinates(pickupLocation, { lat: 25.4524, lng: 81.834 });
  }, [pickupLocation]);

  const destCoords: LatLng = useMemo(() => {
    return resolveCoordinates(returnLocation, { lat: 25.4402, lng: 81.7341 });
  }, [returnLocation]);

  // Real Geoapify Driving Route State
  const [geoRoute, setGeoRoute] = useState<GeoapifyRouteResult | null>(null);
  const [mapEngine, setMapEngine] = useState<"geoapify" | "schematic">("geoapify");

  // Fetch real road route from Geoapify API
  useEffect(() => {
    let active = true;
    async function loadRoute() {
      try {
        const result = await fetchGeoapifyRoute(originCoords, destCoords);
        if (active && result && result.coordinates.length > 3) {
          setGeoRoute(result);
        }
      } catch (err) {
        console.warn("Geoapify Routing API fallback to vector:", err);
      }
    }

    loadRoute();

    return () => {
      active = false;
    };
  }, [originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng]);

  // Route path points (Real Geoapify Highway coordinates or geometric fallback)
  const routePoints: LatLng[] = useMemo(() => {
    if (geoRoute && geoRoute.coordinates.length > 3) {
      return geoRoute.coordinates;
    }
    return generateRoutePoints(originCoords, destCoords, 100);
  }, [originCoords, destCoords, geoRoute]);

  const totalTripKm = useMemo(() => {
    if (geoRoute?.distanceKm) return geoRoute.distanceKm;
    return calculateDistanceKm(originCoords, destCoords) || 8.4;
  }, [originCoords, destCoords, geoRoute]);

  const directions: NavigationStep[] = useMemo(() => {
    if (geoRoute?.steps && geoRoute.steps.length > 0) {
      return geoRoute.steps.map((s) => ({
        instruction: s.instruction,
        distanceKm: s.distanceKm,
        street: s.street || "City Arterial Corridor",
      }));
    }
    return generateTurnByTurnDirections(pickupLocation, returnLocation, totalTripKm);
  }, [pickupLocation, returnLocation, totalTripKm, geoRoute]);

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
  const [copiedLink, setCopiedLink] = useState(false);
  const [mapStyle, setMapStyle] = useState<"osm" | "dark" | "satellite">("osm");

  // Keep index within bounds if route points change
  useEffect(() => {
    if (currentIndex >= routePoints.length) {
      setCurrentIndex(Math.max(0, routePoints.length - 1));
    }
  }, [routePoints.length]);

  // Telemetry values
  const currentPos: LatLng = routePoints[currentIndex] || originCoords;
  const nextPos: LatLng =
    routePoints[Math.min(currentIndex + 1, routePoints.length - 1)] || currentPos;
  const bearing = useMemo(
    () => calculateBearing(currentPos, nextPos),
    [currentPos, nextPos]
  );

  const progressFraction =
    routePoints.length > 1 ? currentIndex / (routePoints.length - 1) : 0;
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

    const intervalTime = Math.max(100, Math.floor(600 / simSpeed));
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

  // Canvas / SVG Coordinate Projection Math for Schematic fallback
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

  const project = useCallback(
    (pt: LatLng) => {
      const x = ((pt.lng - minLng) / (maxLng - minLng)) * 1000;
      const y = (1 - (pt.lat - minLat) / (maxLat - minLat)) * 600;
      return { x, y };
    },
    [minLat, maxLat, minLng, maxLng]
  );

  const originSvg = project(originCoords);
  const destSvg = project(destCoords);
  const carSvg = project(currentPos);

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

  return (
    <div
      className={`bg-white rounded-3xl border border-[#DDE6DF] shadow-xs overflow-hidden ${className}`}
    >
      {/* HEADER BAR: Live Telemetry Status Banner */}
      <div className="bg-[#F7FAF7] text-[#18251D] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DDE6DF]">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-[#173F2D] animate-ping absolute" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#173F2D] relative" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#173F2D]">
                Live GPS Trip Tracking
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#EEF5EF] text-[#173F2D] border border-[#DDE6DF]">
                Ref #{bookingCode}
              </span>
              {geoRoute && (
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#173F2D] text-white flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  Geoapify Routing
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 mt-0.5 text-[#18251D]">
              <span>{tripPhase}</span>
            </h3>
          </div>
        </div>

        {/* Live HUD Quick Counters & Map Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          {/* Map Engine Toggle */}
          <div className="bg-[#EEF5EF] p-1 rounded-xl border border-[#DDE6DF] flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMapEngine("geoapify")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mapEngine === "geoapify"
                  ? "bg-[#173F2D] text-white shadow-xs"
                  : "text-[#66736A] hover:text-[#18251D]"
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Geoapify Map</span>
            </button>
            <button
              type="button"
              onClick={() => setMapEngine("schematic")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                mapEngine === "schematic"
                  ? "bg-[#173F2D] text-white shadow-xs"
                  : "text-[#66736A] hover:text-[#18251D]"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Vector Radar</span>
            </button>
          </div>

          <div className="bg-white px-3 py-2 rounded-xl border border-[#DDE6DF] flex items-center gap-2 shadow-xs">
            <Gauge className="w-4 h-4 text-[#173F2D] shrink-0" />
            <div>
              <span className="text-[10px] text-[#66736A] block leading-none">Speed</span>
              <span className="font-extrabold text-[#18251D] text-xs">
                {currentSpeedKmH} km/h
              </span>
            </div>
          </div>

          <div className="bg-white px-3 py-2 rounded-xl border border-[#DDE6DF] flex items-center gap-2 shadow-xs">
            <Clock className="w-4 h-4 text-[#173F2D] shrink-0" />
            <div>
              <span className="text-[10px] text-[#66736A] block leading-none">ETA</span>
              <span className="font-extrabold text-[#18251D] text-xs">
                {estimatedMinsLeft} mins
              </span>
            </div>
          </div>

          <div className="bg-white px-3 py-2 rounded-xl border border-[#DDE6DF] flex items-center gap-2 shadow-xs">
            <Navigation className="w-4 h-4 text-[#173F2D] shrink-0" />
            <div>
              <span className="text-[10px] text-[#66736A] block leading-none">Remaining</span>
              <span className="font-extrabold text-[#18251D] text-xs">{remainingKm} km</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAP VIEWPORT: GEOAPIFY INTERACTIVE MAP OR VECTOR RADAR */}
      {mapEngine === "geoapify" ? (
        <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[500px]">
          <GeoapifyInteractiveMap
            origin={originCoords}
            destination={destCoords}
            currentCarPos={currentPos}
            carBearing={bearing}
            routeCoordinates={routePoints}
            pickupLabel={pickupLocation}
            returnLabel={returnLocation}
            carTitle={carTitle}
            speedKmH={currentSpeedKmH}
            etaMins={estimatedMinsLeft}
            className="h-[400px] sm:h-[460px] lg:h-[500px]"
          />

          {/* Floating Playback Controls in Map Corner */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-[#DDE6DF] shadow-lg pointer-events-auto">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
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

            <button
              type="button"
              onClick={() => {
                setCurrentIndex(0);
                setIsPlaying(true);
              }}
              title="Reset trip simulation"
              className="p-2 rounded-xl border border-[#DDE6DF] text-[#18251D] hover:bg-[#EEF5EF] transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-1 border-l border-[#DDE6DF] pl-2">
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSimSpeed(s)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                    simSpeed === s
                      ? "bg-[#173F2D] text-white shadow-xs"
                      : "text-[#66736A] hover:bg-[#EEF5EF]"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* FALLBACK: VECTOR SCHEMATIC MAP CONTAINER */
        <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] bg-[#E8EEF5] overflow-hidden select-none">
          <div
            className={`absolute inset-0 w-full h-full transition-colors duration-500 ${
              mapStyle === "satellite" ? "bg-[#18231c]" : "bg-[#eaf1f8]"
            }`}
          >
            <div
              className="absolute inset-0 opacity-25 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(23, 63, 45, 0.4) 1px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
            />

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
              </defs>

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

              <path
                d={fullPathD}
                fill="none"
                stroke="#0f172a"
                strokeWidth="8"
                strokeOpacity="0.12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {remainingPathD && (
                <path
                  d={remainingPathD}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="5"
                  strokeOpacity="0.45"
                  strokeDasharray="8,6"
                  strokeLinecap="round"
                />
              )}
              {completedPathD && (
                <path
                  d={completedPathD}
                  fill="none"
                  stroke="url(#routeGradientPast)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </div>

          {/* ORIGIN PIN */}
          <div
            className="absolute z-10 -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-auto group cursor-pointer"
            style={{
              left: `${(originSvg.x / 1000) * 100}%`,
              top: `${(originSvg.y / 600) * 100}%`,
            }}
          >
            <div className="relative flex flex-col items-center">
              <span className="w-6 h-6 rounded-full bg-emerald-500/30 animate-ping absolute -top-1" />
              <div className="w-8 h-8 rounded-full bg-[#173F2D] text-white flex items-center justify-center shadow-lg border-2 border-white">
                <MapPin className="w-4 h-4 fill-white" />
              </div>
              <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#173F2D] text-white">
                ORIGIN
              </span>
            </div>
          </div>

          {/* DESTINATION PIN */}
          <div
            className="absolute z-10 -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-auto group cursor-pointer"
            style={{
              left: `${(destSvg.x / 1000) * 100}%`,
              top: `${(destSvg.y / 600) * 100}%`,
            }}
          >
            <div className="relative flex flex-col items-center">
              <span className="w-6 h-6 rounded-full bg-slate-500/30 animate-ping absolute -top-1" />
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg border-2 border-white">
                <Crosshair className="w-4 h-4 fill-white" />
              </div>
              <span className="mt-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-slate-900 text-white">
                DESTINATION
              </span>
            </div>
          </div>

          {/* MOVING VEHICLE MARKER */}
          <div
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-linear pointer-events-auto"
            style={{
              left: `${(carSvg.x / 1000) * 100}%`,
              top: `${(carSvg.y / 600) * 100}%`,
            }}
          >
            <div className="relative flex items-center justify-center">
              <span className="w-10 h-10 rounded-full bg-[#173F2D]/20 animate-ping absolute" />
              <div
                className="w-10 h-10 rounded-full bg-[#173F2D] text-white border-2 border-white flex items-center justify-center shadow-lg transition-transform duration-300"
                style={{ transform: `rotate(${bearing}deg)` }}
              >
                <Navigation className="w-4 h-4 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* FLOATING CONTROLS */}
          <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between gap-3 pointer-events-none">
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-[#DDE6DF] shadow-lg pointer-events-auto">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                <span className="hidden sm:inline">{isPlaying ? "Pause" : "Resume"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentIndex(0);
                  setIsPlaying(true);
                }}
                className="p-2 rounded-xl border border-[#DDE6DF] text-[#18251D] hover:bg-[#EEF5EF] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1 border-l border-[#DDE6DF] pl-2">
                {[1, 2, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSimSpeed(s)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-extrabold transition-colors cursor-pointer ${
                      simSpeed === s ? "bg-[#173F2D] text-white shadow-xs" : "text-[#66736A]"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-slate-900/90 text-white px-3 py-2 rounded-2xl border border-slate-800 backdrop-blur-md text-[11px] font-mono pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                GPS: {currentPos.lat.toFixed(4)}°N, {currentPos.lng.toFixed(4)}°E
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TRIP PROGRESS SLIDER BAR */}
      <div className="bg-[#F7FAF7] px-4 sm:px-6 py-2.5 border-t border-b border-[#DDE6DF] flex items-center gap-4 text-xs">
        <span className="font-bold text-[#66736A] text-[11px] uppercase tracking-wider shrink-0">
          Trip Completion
        </span>
        <div className="flex-1 bg-[#EEF5EF] h-2.5 rounded-full overflow-hidden relative">
          <div
            className="bg-[#173F2D] h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.round(progressFraction * 100)}%` }}
          />
        </div>
        <span className="font-extrabold text-[#18251D] text-xs shrink-0">
          {Math.round(progressFraction * 100)}%
        </span>
      </div>

      {/* BOTTOM INFO PANEL: Driver Card + Turn-by-Turn Directions */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white">
        {/* DRIVER & VEHICLE DETAILS */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F7FAF7] border border-[#DDE6DF]">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-white shrink-0 border border-[#DDE6DF]">
              <Image
                src={driver.avatar}
                alt={driver.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm text-[#18251D] truncate">
                  {driver.name}
                </h4>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#173F2D] shrink-0" />
              </div>
              <p className="text-xs text-[#66736A]">
                ⭐ {driver.rating} • {driver.tripsCount} trips completed
              </p>
              <p className="text-[11px] font-bold text-[#173F2D] uppercase mt-0.5">
                Assigned Fleet Pilot
              </p>
            </div>
          </div>

          {/* Vehicle summary */}
          <div className="p-3.5 rounded-2xl bg-[#F7FAF7] border border-[#DDE6DF] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#66736A]">Vehicle:</span>
              <span className="font-bold text-[#18251D]">{carTitle}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#66736A]">Plate Number:</span>
              <span className="font-mono font-bold text-[#173F2D]">
                {driver.plateNumber}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#66736A]">Cartography:</span>
              <span className="font-semibold text-emerald-700">
                Geoapify Navigation Engine
              </span>
            </div>
          </div>

          {/* Contact & Actions */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${driver.phone}`}
              className="py-2.5 px-3 rounded-xl bg-[#173F2D] hover:bg-[#2F7650] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Driver</span>
            </a>

            <button
              type="button"
              onClick={handleShare}
              className="py-2.5 px-3 rounded-xl border border-[#DDE6DF] text-[#18251D] hover:bg-[#F7FAF7] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#66736A]" />
              <span>{copiedLink ? "Link Copied!" : "Share Live"}</span>
            </button>
          </div>
        </div>

        {/* ROUTE WAYPOINTS & TURN GUIDANCE */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDE6DF]">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#173F2D]" />
              <h4 className="font-extrabold text-xs text-[#18251D] uppercase tracking-wider">
                Live Route Guidance & Road Milestones
              </h4>
            </div>
            <span className="text-[11px] text-[#66736A] font-medium">
              {geoRoute ? "Live Turn-by-Turn" : "Estimated Corridor"}
            </span>
          </div>

          {/* Turn-by-Turn Step Cards */}
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
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
                      ? "bg-[#EEF5EF] border-[#DDE6DF] text-[#18251D] font-semibold ring-1 ring-[#173F2D]/20"
                      : isPastStep
                      ? "bg-[#F7FAF7] border-[#DDE6DF] text-[#66736A] opacity-70"
                      : "bg-white border-[#DDE6DF] text-[#18251D]"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold ${
                      isCurrentStep
                        ? "bg-[#173F2D] text-white shadow-xs"
                        : isPastStep
                        ? "bg-[#DDE6DF] text-[#66736A]"
                        : "bg-[#F7FAF7] text-[#18251D]"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{step.instruction}</p>
                    <p className="text-[11px] text-[#66736A]">{step.street}</p>
                  </div>
                  <span className="text-[11px] font-bold text-[#66736A] shrink-0">
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
