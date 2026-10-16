"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  getGeoapifyTileUrl,
  GEOAPIFY_MAP_STYLES,
  GeoapifyStyleKey,
  GeoapifyLatLng,
  GEOAPIFY_API_KEY,
} from "@/lib/geoapify";
import {
  Layers,
  Crosshair,
  Maximize2,
  Minimize2,
  Navigation,
  Compass,
  MapPin,
  Car as CarIcon,
  RotateCcw,
} from "lucide-react";

interface GeoapifyInteractiveMapProps {
  origin: GeoapifyLatLng;
  destination: GeoapifyLatLng;
  currentCarPos?: GeoapifyLatLng;
  carBearing?: number;
  routeCoordinates?: GeoapifyLatLng[];
  pickupLabel?: string;
  returnLabel?: string;
  carTitle?: string;
  speedKmH?: number;
  etaMins?: number;
  className?: string;
}

export default function GeoapifyInteractiveMap({
  origin,
  destination,
  currentCarPos,
  carBearing = 0,
  routeCoordinates = [],
  pickupLabel = "Pickup Location",
  returnLabel = "Return Location",
  carTitle = "Rental Car",
  speedKmH,
  etaMins,
  className = "",
}: GeoapifyInteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const carMarkerRef = useRef<any>(null);
  const routePolylineRef = useRef<any>(null);
  const remainingPolylineRef = useRef<any>(null);

  const [activeStyle, setActiveStyle] = useState<GeoapifyStyleKey>("street");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [satelliteMode, setSatelliteMode] = useState(false);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;
      if (typeof window === "undefined") return;

      const L = (await import("leaflet")).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Center between origin and destination
      const centerLat = (origin.lat + destination.lat) / 2;
      const centerLng = (origin.lng + destination.lng) / 2;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 13,
        zoomControl: false,
      });

      mapInstanceRef.current = map;

      // Add zoom control top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Add Base Geoapify Tile Layer
      const tileUrl = getGeoapifyTileUrl(activeStyle, GEOAPIFY_API_KEY);
      const tileLayer = L.tileLayer(tileUrl, {
        attribution:
          'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        maxZoom: 20,
        subdomains: ["maps"],
      }).addTo(map);

      tileLayerRef.current = tileLayer;

      // Custom Pickup Div Icon (Emerald Pin)
      const originIcon = L.divIcon({
        className: "custom-map-marker",
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: #173F2D;
            color: white;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 14px rgba(23,63,45,0.45);
            border: 2px solid #FFFFFF;
          ">
            <svg style="transform: rotate(45deg); width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      // Custom Destination Div Icon (Dark Checkered Flag Pin)
      const destIcon = L.divIcon({
        className: "custom-map-marker",
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: #0F172A;
            color: #10B981;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            box-shadow: 0 4px 14px rgba(15,23,42,0.45);
            border: 2px solid #FFFFFF;
          ">
            <svg style="transform: rotate(45deg); width: 18px; height: 18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
              <line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      // Add Origin Marker
      L.marker([origin.lat, origin.lng], { icon: originIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
            <strong style="color: #173F2D; display: block; margin-bottom: 2px;">🟢 Pickup Location</strong>
            <span style="color: #475569;">${pickupLabel}</span>
          </div>`
        );

      // Add Destination Marker
      L.marker([destination.lat, destination.lng], { icon: destIcon })
        .addTo(map)
        .bindPopup(
          `<div style="font-family: inherit; font-size: 12px; line-height: 1.4;">
            <strong style="color: #0F172A; display: block; margin-bottom: 2px;">🏁 Return Destination</strong>
            <span style="color: #475569;">${returnLabel}</span>
          </div>`
        );

      // Fit map to markers bounds
      const bounds = L.latLngBounds([
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });

      setMapLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [origin.lat, origin.lng, destination.lat, destination.lng, pickupLabel, returnLabel]);

  // Update Tile Layer when style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    let tileUrl = "";
    if (satelliteMode) {
      // High-resolution OpenStreetMap Aerial/Satellite Tile Fallback
      tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    } else {
      tileUrl = getGeoapifyTileUrl(activeStyle, GEOAPIFY_API_KEY);
    }

    tileLayerRef.current.setUrl(tileUrl);
  }, [activeStyle, satelliteMode]);

  // Draw or update route polyline
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    async function drawRoute() {
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;
      if (!map) return;

      if (routePolylineRef.current) {
        map.removeLayer(routePolylineRef.current);
        routePolylineRef.current = null;
      }

      if (routeCoordinates && routeCoordinates.length > 0) {
        const latLngs = routeCoordinates.map((c) => [c.lat, c.lng] as [number, number]);

        // Background shadow polyline
        const routeLine = L.polyline(latLngs, {
          color: "#173F2D",
          weight: 6,
          opacity: 0.85,
          lineCap: "round",
          lineJoin: "round",
          smoothFactor: 1.0,
        }).addTo(map);

        routePolylineRef.current = routeLine;

        // Auto fit bounds to route
        map.fitBounds(routeLine.getBounds(), { padding: [40, 40] });
      }
    }

    drawRoute();
  }, [routeCoordinates, mapLoaded]);

  // Update Car Marker position & heading
  useEffect(() => {
    const pos = currentCarPos;
    if (!mapInstanceRef.current || !mapLoaded || !pos) return;

    async function updateCarMarker() {
      if (!pos) return;
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;
      if (!map) return;

      const carIconHtml = `
        <div style="
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <!-- Pulse halo -->
          <div style="
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: rgba(16, 185, 129, 0.35);
            animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></div>
          <!-- Vehicle badge with directional rotation -->
          <div style="
            position: relative;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #173F2D;
            color: #FFFFFF;
            border: 2.5px solid #FFFFFF;
            box-shadow: 0 4px 14px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(${carBearing}deg);
            transition: transform 0.4s ease-out;
          ">
            <svg style="width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2.5;" viewBox="0 0 24 24">
              <polygon points="12 2 19 21 12 17 5 21 12 2" fill="#FFFFFF"/>
            </svg>
          </div>
        </div>
      `;

      const carIcon = L.divIcon({
        className: "custom-car-marker",
        html: carIconHtml,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
      });

      if (carMarkerRef.current) {
        carMarkerRef.current.setLatLng([pos.lat, pos.lng]);
        carMarkerRef.current.setIcon(carIcon);
      } else {
        const marker = L.marker([pos.lat, pos.lng], {
          icon: carIcon,
          zIndexOffset: 1000,
        })
          .addTo(map)
          .bindPopup(
            `<div style="font-family: inherit; font-size: 12px;">
              <strong style="color: #173F2D; display: block;">${carTitle}</strong>
              <span style="color: #64748B;">GPS Telemetry Active</span>
            </div>`
          );
        carMarkerRef.current = marker;
      }
    }

    updateCarMarker();
  }, [currentCarPos, carBearing, mapLoaded, carTitle]);

  // Recenter map on active vehicle or full route
  const handleRecenter = useCallback(() => {
    if (!mapInstanceRef.current) return;
    if (currentCarPos) {
      mapInstanceRef.current.setView([currentCarPos.lat, currentCarPos.lng], 15, {
        animate: true,
      });
    } else if (routePolylineRef.current) {
      mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), {
        padding: [40, 40],
        animate: true,
      });
    }
  }, [currentCarPos]);

  // Reset view to entire route bounds
  const handleResetView = useCallback(() => {
    if (!mapInstanceRef.current) return;
    const L = (window as any).L;
    if (routePolylineRef.current) {
      mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), {
        padding: [50, 50],
        animate: true,
      });
    } else {
      mapInstanceRef.current.fitBounds(
        [
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        ],
        { padding: [50, 50], animate: true }
      );
    }
  }, [origin, destination]);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-[#DDE6DF] bg-[#F7FAF7] shadow-inner select-none ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : className
      }`}
    >
      {/* Map DOM target */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px] z-0" />

      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none gap-2">
        {/* Style Selector Pill */}
        <div className="bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-xl border border-[#DDE6DF] shadow-md pointer-events-auto flex items-center gap-1 text-xs">
          <Layers className="w-3.5 h-3.5 text-[#173F2D] shrink-0 ml-1" />
          <button
            type="button"
            onClick={() => {
              setSatelliteMode(false);
              setActiveStyle("street");
            }}
            className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              !satelliteMode && activeStyle === "street"
                ? "bg-[#173F2D] text-white shadow-xs"
                : "text-[#66736A] hover:text-[#18251D]"
            }`}
          >
            Street
          </button>
          <button
            type="button"
            onClick={() => {
              setSatelliteMode(false);
              setActiveStyle("dark");
            }}
            className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              !satelliteMode && activeStyle === "dark"
                ? "bg-[#173F2D] text-white shadow-xs"
                : "text-[#66736A] hover:text-[#18251D]"
            }`}
          >
            Dark HUD
          </button>
          <button
            type="button"
            onClick={() => setSatelliteMode(true)}
            className={`px-2 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
              satelliteMode
                ? "bg-[#173F2D] text-white shadow-xs"
                : "text-[#66736A] hover:text-[#18251D]"
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Quick Map Action Tools */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {currentCarPos && (
            <button
              type="button"
              onClick={handleRecenter}
              title="Focus on Vehicle"
              className="p-2 bg-white/95 backdrop-blur-md rounded-xl border border-[#DDE6DF] shadow-md hover:bg-[#EEF5EF] text-[#173F2D] transition-colors cursor-pointer"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleResetView}
            title="Fit Entire Route"
            className="p-2 bg-white/95 backdrop-blur-md rounded-xl border border-[#DDE6DF] shadow-md hover:bg-[#EEF5EF] text-[#18251D] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
            className="p-2 bg-white/95 backdrop-blur-md rounded-xl border border-[#DDE6DF] shadow-md hover:bg-[#EEF5EF] text-[#18251D] transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Floating Live Telemetry Badge (Speed + ETA) */}
      {(speedKmH !== undefined || etaMins !== undefined) && (
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-lg border border-slate-700/60 flex items-center gap-3 text-xs">
            {speedKmH !== undefined && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-white text-sm">{speedKmH}</span>
                <span className="text-[10px] text-slate-400 uppercase">km/h</span>
              </div>
            )}
            {etaMins !== undefined && (
              <div className="border-l border-slate-700 pl-3">
                <span className="text-[10px] text-slate-400 block leading-none">ETA</span>
                <span className="font-bold text-emerald-300 text-xs">{etaMins} mins</span>
              </div>
            )}
            <div className="border-l border-slate-700 pl-3 text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <span>Geoapify API Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
