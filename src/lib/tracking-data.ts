export interface LatLng {
  lat: number;
  lng: number;
}

export interface NavigationStep {
  instruction: string;
  distanceKm: number;
  street: string;
}

export interface HubLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  landmark: string;
}

export interface DriverInfo {
  id: string;
  name: string;
  phone: string;
  rating: number;
  tripsCount: number;
  avatar: string;
  vehicleModel: string;
  plateNumber: string;
  color: string;
}

// Key mobility hubs in Prayagraj & UP with precise GPS coordinates
export const PRAYAGRAJ_HUBS: HubLocation[] = [
  {
    id: "civil_lines",
    name: "Civil Lines Hub & MG Marg, Prayagraj",
    lat: 25.4524,
    lng: 81.8340,
    landmark: "Mahatma Gandhi Marg, Near All Saints Cathedral",
  },
  {
    id: "junction",
    name: "Prayagraj Junction (PRYJ) & Leader Road Hub",
    lat: 25.4484,
    lng: 81.8286,
    landmark: "Platform 1 Civil Lines Side, Leader Road",
  },
  {
    id: "airport",
    name: "Bamrauli Airport (IXD) VIP Lounge Hub, Prayagraj",
    lat: 25.4402,
    lng: 81.7341,
    landmark: "VIP Arrivals Exit, Air Force Station Bamrauli",
  },
  {
    id: "sangam",
    name: "Triveni Sangam Darshan & Naini Bridge Hub, Prayagraj",
    lat: 25.4290,
    lng: 81.8845,
    landmark: "Sangam Ghat Road & New Yamuna Bridge",
  },
  {
    id: "subedarganj",
    name: "Subedarganj Station & GT Road Hub, Prayagraj",
    lat: 25.4495,
    lng: 81.7960,
    landmark: "Grand Trunk Road, Subedarganj Flyover",
  },
  {
    id: "high_court",
    name: "High Court of Judicature & Stanley Road Hub",
    lat: 25.4560,
    lng: 81.8230,
    landmark: "Stanley Road, Near Gate No. 3",
  },
  {
    id: "naini",
    name: "Naini Industrial & ADA Colony Hub",
    lat: 25.3985,
    lng: 81.8652,
    landmark: "ADA Colony, Mirzapur Highway",
  },
  {
    id: "lucknow",
    name: "Lucknow Charbagh Hub & Airport Express",
    lat: 26.8467,
    lng: 80.9462,
    landmark: "Charbagh Railway Hub / Shaheed Path",
  },
  {
    id: "varanasi",
    name: "Varanasi Cantt & Babatpur Airport Hub",
    lat: 25.3176,
    lng: 82.9739,
    landmark: "Varanasi Cantt Junction & Ring Road",
  },
];

// Fallback driver roster
export const ASSIGNED_DRIVERS: DriverInfo[] = [
  {
    id: "drv_1",
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    rating: 4.94,
    tripsCount: 1420,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    vehicleModel: "BMW 3 Series (Metallic White)",
    plateNumber: "UP 70 BK 4821",
    color: "Alpine White",
  },
  {
    id: "drv_2",
    name: "Vikramaditya Yadav",
    phone: "+91 98112 76543",
    rating: 4.91,
    tripsCount: 980,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    vehicleModel: "Tesla Model 3 Performance",
    plateNumber: "UP 70 EV 9012",
    color: "Pearl White",
  },
  {
    id: "drv_3",
    name: "Amitabh Singh",
    phone: "+91 99351 22840",
    rating: 4.96,
    tripsCount: 1840,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    vehicleModel: "Audi Q5 Quattro (Mythos Black)",
    plateNumber: "UP 70 AQ 5510",
    color: "Mythos Black",
  },
];

// Helper to find closest coordinate for an address string
export function resolveCoordinates(addressString: string, fallbackDefault: LatLng): LatLng {
  if (!addressString) return fallbackDefault;
  const lower = addressString.toLowerCase();

  if (lower.includes("airport") || lower.includes("bamrauli") || lower.includes("ixd")) {
    return { lat: 25.4402, lng: 81.7341 };
  }
  if (lower.includes("sangam") || lower.includes("triveni") || lower.includes("naini bridge")) {
    return { lat: 25.4290, lng: 81.8845 };
  }
  if (lower.includes("junction") || lower.includes("pryj") || lower.includes("leader road") || lower.includes("station")) {
    return { lat: 25.4484, lng: 81.8286 };
  }
  if (lower.includes("subedarganj")) {
    return { lat: 25.4495, lng: 81.7960 };
  }
  if (lower.includes("court")) {
    return { lat: 25.4560, lng: 81.8230 };
  }
  if (lower.includes("naini")) {
    return { lat: 25.3985, lng: 81.8652 };
  }
  if (lower.includes("lucknow")) {
    return { lat: 26.8467, lng: 80.9462 };
  }
  if (lower.includes("varanasi")) {
    return { lat: 25.3176, lng: 82.9739 };
  }
  if (lower.includes("civil") || lower.includes("lines") || lower.includes("mg marg")) {
    return { lat: 25.4524, lng: 81.8340 };
  }

  return fallbackDefault;
}

// Calculate distance in kilometers using Haversine formula
export function calculateDistanceKm(a: LatLng, b: LatLng): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const c =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLng *
      sinLng;
  const d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
  const km = Number((R * d).toFixed(2));
  return km < 0.5 ? 14.8 : km;
}

// Calculate bearing/heading angle in degrees between two points
export function calculateBearing(start: LatLng, end: LatLng): number {
  const startLat = (start.lat * Math.PI) / 180;
  const startLng = (start.lng * Math.PI) / 180;
  const endLat = (end.lat * Math.PI) / 180;
  const endLng = (end.lng * Math.PI) / 180;
  const dLng = endLng - startLng;

  const y = Math.sin(dLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);

  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  brng = (brng + 360) % 360;
  return Math.round(brng);
}

// Generate a realistic multi-point road route polyline between Origin and Destination
export function generateRoutePoints(origin: LatLng, destination: LatLng, stepsCount: number = 80): LatLng[] {
  const points: LatLng[] = [];

  const rawDist = calculateDistanceKm(origin, destination);
  if (rawDist < 0.5) {
    // Round-trip rental returning to same hub: generate an expansive scenic Prayagraj circuit loop!
    const keyWaypoints = [
      origin,
      { lat: origin.lat + 0.008, lng: origin.lng - 0.032 }, // Subedarganj GT Road
      { lat: 25.4402, lng: 81.7341 }, // Bamrauli Express Corridor
      { lat: 25.4290, lng: 81.8845 }, // Triveni Sangam Darshan & Naini Bridge
      destination,
    ];
    for (let i = 0; i <= stepsCount; i++) {
      const t = i / stepsCount;
      const point = getSplinePoint(keyWaypoints, t);
      points.push(point);
    }
    return points;
  }

  // Point-to-point journey
  const midLat = (origin.lat + destination.lat) / 2;
  const midLng = (origin.lng + destination.lng) / 2;

  // Add natural curve offset perpendicular to straight vector
  const dLat = destination.lat - origin.lat;
  const dLng = destination.lng - origin.lng;
  const perpLat = -dLng * 0.25;
  const perpLng = dLat * 0.25;

  const wp1: LatLng = {
    lat: origin.lat + dLat * 0.28 + perpLat * 0.7,
    lng: origin.lng + dLng * 0.28 + perpLng * 0.7,
  };

  const wp2: LatLng = {
    lat: midLat + perpLat * 1.0,
    lng: midLng + perpLng * 1.0,
  };

  const wp3: LatLng = {
    lat: origin.lat + dLat * 0.72 + perpLat * 0.5,
    lng: origin.lng + dLng * 0.72 + perpLng * 0.5,
  };

  const keyWaypoints = [origin, wp1, wp2, wp3, destination];

  // Catmull-Rom or cubic spline interpolation between key waypoints
  for (let i = 0; i <= stepsCount; i++) {
    const t = i / stepsCount;
    const point = getSplinePoint(keyWaypoints, t);
    points.push(point);
  }

  return points;
}

function getSplinePoint(pts: LatLng[], t: number): LatLng {
  const n = pts.length - 1;
  const p = t * n;
  const idx = Math.min(Math.floor(p), n - 1);
  const frac = p - idx;

  const p0 = pts[Math.max(idx - 1, 0)];
  const p1 = pts[idx];
  const p2 = pts[Math.min(idx + 1, n)];
  const p3 = pts[Math.min(idx + 2, n)];

  // Cubic Hermite spline
  const lat = interpolateCubic(p0.lat, p1.lat, p2.lat, p3.lat, frac);
  const lng = interpolateCubic(p0.lng, p1.lng, p2.lng, p3.lng, frac);

  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
  };
}

function interpolateCubic(v0: number, v1: number, v2: number, v3: number, t: number): number {
  const a = -0.5 * v0 + 1.5 * v1 - 1.5 * v2 + 0.5 * v3;
  const b = v0 - 2.5 * v1 + 2 * v2 - 0.5 * v3;
  const c = -0.5 * v0 + 0.5 * v2;
  const d = v1;
  return a * t * t * t + b * t * t + c * t + d;
}

// Generate realistic turn-by-turn guidance for Prayagraj routes
export function generateTurnByTurnDirections(originName: string, destName: string, totalKm: number): NavigationStep[] {
  return [
    {
      instruction: `Depart from ${originName} heading toward main arterial road`,
      distanceKm: Number((totalKm * 0.15).toFixed(1)),
      street: "MG Marg / Civil Lines Corridor",
    },
    {
      instruction: "Keep straight through the roundabout toward GT Road Flyover",
      distanceKm: Number((totalKm * 0.25).toFixed(1)),
      street: "Subedarganj Bypass / GT Road (NH19)",
    },
    {
      instruction: "Merge onto expressway connector with smooth traffic flow",
      distanceKm: Number((totalKm * 0.35).toFixed(1)),
      street: "Kanpur-Prayagraj Express Corridor",
    },
    {
      instruction: `Prepare for arrival at destination entrance: ${destName}`,
      distanceKm: Number((totalKm * 0.25).toFixed(1)),
      street: "Dedicated Fleet Reception Lane",
    },
  ];
}
