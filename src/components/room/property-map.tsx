"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Bus,
  Compass,
  ExternalLink,
  GraduationCap,
  Hospital,
  ShoppingBag,
} from "lucide-react";
import * as React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

// Map of major cities to geographic coordinates in Bangladesh
const CITY_COORDINATES: Record<string, [number, number]> = {
  dhaka: [23.8103, 90.4125],
  chattogram: [22.3569, 91.7832],
  chittagong: [22.3569, 91.7832],
  sylhet: [24.8949, 91.8687],
  rajshahi: [24.3745, 88.6042],
  khulna: [22.8456, 89.5403],
  barishal: [22.701, 90.3535],
  rangpur: [25.7439, 89.2752],
  mymensingh: [24.7471, 90.4203],
  gazipur: [23.9999, 90.4203],
  narayanganj: [23.6238, 90.5],
  uttara: [23.8759, 90.3795],
  dhanmondi: [23.7461, 90.3742],
  gulshan: [23.7925, 90.4078],
  banani: [23.7937, 90.4043],
  mirpur: [23.8071, 90.3686],
  mohammadpur: [23.7658, 90.3585],
  badda: [23.7806, 90.4267],
  bashundhara: [23.8191, 90.4326],
};

function getCoordinates(city?: string, address?: string): [number, number] {
  const query = `${address || ""} ${city || ""}`.toLowerCase();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (query.includes(key)) {
      return coords;
    }
  }
  return [23.8103, 90.4125]; // Default to Dhaka Center
}

// Create custom pulse pin icon for Leaflet
const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div class="relative flex items-center justify-center">
        <span class="absolute -top-1 -left-1 h-10 w-10 animate-ping rounded-full bg-indigo-500/40 opacity-75"></span>
        <div class="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl ring-2 ring-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

interface PropertyMapProps {
  title: string;
  address: string;
  city: string;
  propertyType?: string;
}

export default function PropertyMap({
  title,
  address,
  city,
}: PropertyMapProps) {
  const position = React.useMemo(
    () => getCoordinates(city, address),
    [city, address],
  );

  const customIcon = React.useMemo(() => createCustomIcon(), []);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}, ${city}, Bangladesh`,
  )}`;

  return (
    <div className="w-full space-y-4">
      {/* Map Container */}
      <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full overflow-hidden rounded-2xl border border-border/80 bg-muted/40 shadow-inner z-0">
        <MapContainer
          center={position}
          zoom={14}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={customIcon}>
            <Popup className="custom-leaflet-popup">
              <div className="p-1 space-y-1.5 max-w-[200px]">
                <span className="font-heading font-bold text-xs text-foreground block line-clamp-1">
                  {title}
                </span>
                <span className="text-[11px] text-muted-foreground block line-clamp-2">
                  {address}, {city}
                </span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 pt-0.5"
                >
                  Open in Google Maps
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Floating Quick Navigation Link */}
        <div className="absolute top-3 right-3 z-400">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-md backdrop-blur-md hover:bg-background transition-all border border-border/60"
          >
            <Compass className="h-3.5 w-3.5 text-indigo-500" />
            <span>Open Directions</span>
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        </div>
      </div>

      {/* Nearby Amenities / Hotspots Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Bus className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-foreground block">Transit</span>
            <span className="text-[10px] text-muted-foreground">
              &lt; 300m Away
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-foreground block">University</span>
            <span className="text-[10px] text-muted-foreground">
              5-10 Min Commute
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-foreground block">
              Grocery & Mart
            </span>
            <span className="text-[10px] text-muted-foreground">
              &lt; 200m Walk
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <Hospital className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-foreground block">Healthcare</span>
            <span className="text-[10px] text-muted-foreground">
              Nearby Clinic
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
