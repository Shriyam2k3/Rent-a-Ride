"use client";

import React, { useEffect, useRef, useState } from "react";
import { PRAYAGRAJ_HUBS, HubLocation } from "@/lib/tracking-data";
import { getGeoapifyTileUrl, GEOAPIFY_API_KEY } from "@/lib/geoapify";
import { MapPin, Navigation, Phone, Clock, CheckCircle2 } from "lucide-react";

interface HubLocationMapProps {
  selectedHubId?: string;
  onSelectHub?: (hub: HubLocation) => void;
  className?: string;
  height?: string;
}

export default function HubLocationMap({
  selectedHubId = "civil_lines",
  onSelectHub,
  className = "",
  height = "h-[360px]",
}: HubLocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const [activeHub, setActiveHub] = useState<HubLocation>(
    PRAYAGRAJ_HUBS.find((h) => h.id === selectedHubId) || PRAYAGRAJ_HUBS[0]
  );

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!containerRef.current || mapRef.current || typeof window === "undefined") return;

      const L = (await import("leaflet")).default;
      if (!mounted || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [activeHub.lat, activeHub.lng],
        zoom: 13,
        zoomControl: true,
      });

      mapRef.current = map;

      // Add Geoapify bright street tiles
      L.tileLayer(getGeoapifyTileUrl("street", GEOAPIFY_API_KEY), {
        attribution: 'Map &copy; <a href="https://www.geoapify.com/">Geoapify</a>',
        maxZoom: 19,
      }).addTo(map);

      // Add all hubs as markers
      PRAYAGRAJ_HUBS.forEach((hub) => {
        const isSelected = hub.id === activeHub.id;
        const icon = L.divIcon({
          className: "hub-marker",
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: ${isSelected ? "#173F2D" : "#FFFFFF"};
              color: ${isSelected ? "#FFFFFF" : "#173F2D"};
              border: 2.5px solid #173F2D;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 10px rgba(0,0,0,0.18);
              cursor: pointer;
            ">
              <svg style="width: 16px; height: 16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([hub.lat, hub.lng], { icon })
          .addTo(map)
          .bindPopup(`<strong>${hub.name}</strong><br/><small>${hub.landmark}</small>`);

        marker.on("click", () => {
          setActiveHub(hub);
          if (onSelectHub) onSelectHub(hub);
        });

        markersRef.current[hub.id] = marker;
      });
    }

    init();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleHubClick = (hub: HubLocation) => {
    setActiveHub(hub);
    if (onSelectHub) onSelectHub(hub);
    if (mapRef.current) {
      mapRef.current.setView([hub.lat, hub.lng], 14, { animate: true });
      const marker = markersRef.current[hub.id];
      if (marker) marker.openPopup();
    }
  };

  return (
    <div className={`bg-white rounded-2xl border border-[#DDE6DF] overflow-hidden shadow-xs ${className}`}>
      {/* Header bar */}
      <div className="p-4 bg-[#F7FAF7] border-b border-[#DDE6DF] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EEF5EF] text-[#173F2D] flex items-center justify-center">
            <MapPin className="w-4 h-4 text-[#173F2D]" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#18251D] uppercase tracking-wider">
              Rent-a-Ride Hub Station Network
            </h4>
            <p className="text-[11px] text-[#66736A]">
              Geoapify-powered real-time pickup & dispatch depots
            </p>
          </div>
        </div>

        {/* Selected Hub Badge */}
        <div className="text-xs font-bold text-[#173F2D] bg-[#EEF5EF] px-3 py-1 rounded-lg border border-[#DDE6DF] flex items-center gap-1.5 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{activeHub.name.split("&")[0].trim()}</span>
        </div>
      </div>

      {/* Map display */}
      <div ref={containerRef} className={`w-full ${height} bg-[#E8EEF5]`} />

      {/* Hub list buttons */}
      <div className="p-3 bg-white border-t border-[#DDE6DF] flex items-center gap-2 overflow-x-auto no-scrollbar">
        {PRAYAGRAJ_HUBS.slice(0, 5).map((hub) => (
          <button
            key={hub.id}
            type="button"
            onClick={() => handleHubClick(hub)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              hub.id === activeHub.id
                ? "bg-[#173F2D] text-white shadow-xs"
                : "bg-[#F7FAF7] border border-[#DDE6DF] text-[#66736A] hover:text-[#18251D]"
            }`}
          >
            {hub.name.split("(")[0].split("&")[0].trim()}
          </button>
        ))}
      </div>
    </div>
  );
}
