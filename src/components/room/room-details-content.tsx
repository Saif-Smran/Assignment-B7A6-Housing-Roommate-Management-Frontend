"use client";

import {
  ArrowLeft,
  Bath,
  Bed,
  Check,
  CheckCircle2,
  ChevronRight,
  FileText,
  Flame,
  Home,
  MapPin,
  Navigation,
  Power,
  Refrigerator,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Tv,
  Users,
  Utensils,
  Wifi,
  Wind,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import * as React from "react";
import type { PropertyDetails, Room } from "@/api/interfaces";
import { RoomBookingCard } from "@/components/room/room-booking-card";
import { RoomGallery } from "@/components/room/room-gallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PropertyMap = dynamic(() => import("@/components/room/property-map"), {
  ssr: false,
  loading: () => (
    <div className="aspect-[16/7] w-full rounded-2xl bg-muted/40 animate-pulse flex flex-col items-center justify-center text-muted-foreground text-xs gap-2">
      <MapPin className="h-6 w-6 text-indigo-500 animate-bounce" />
      <span>Loading Interactive Map...</span>
    </div>
  ),
});

// Amenity Icon Mapper
const getAmenityIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("wifi") || lower.includes("internet")) return Wifi;
  if (lower.includes("ac") || lower.includes("air condition")) return Wind;
  if (lower.includes("bath") || lower.includes("attached")) return Bath;
  if (lower.includes("kitchen") || lower.includes("cook")) return Utensils;
  if (
    lower.includes("generator") ||
    lower.includes("electricity") ||
    lower.includes("power")
  )
    return Power;
  if (lower.includes("gas") || lower.includes("cylinder")) return Flame;
  if (lower.includes("fridge") || lower.includes("refrigerator"))
    return Refrigerator;
  if (lower.includes("tv") || lower.includes("television")) return Tv;
  if (
    lower.includes("security") ||
    lower.includes("cctv") ||
    lower.includes("guard")
  )
    return ShieldCheck;
  return Sparkles;
};

interface RoomDetailsContentProps {
  property: PropertyDetails;
  initialRoomId?: string;
}

export function RoomDetailsContent({
  property,
  initialRoomId,
}: RoomDetailsContentProps) {
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(() => {
    if (initialRoomId && property.rooms) {
      return (
        property.rooms.find((r) => r.id === initialRoomId) ||
        property.rooms[0] ||
        null
      );
    }
    return property.rooms?.[0] || null;
  });

  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const availableRoomsCount =
    property.rooms?.filter((r) => r.isAvailable).length || 0;
  const totalRoomsCount = property.rooms?.length || 0;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation & Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              href="/"
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href="/properties"
              className="hover:text-foreground transition-colors"
            >
              Rooms & Properties
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {property.city}
            </span>
            <ChevronRight className="h-3 w-3 hidden sm:inline" />
            <span className="text-muted-foreground truncate max-w-[220px] hidden sm:inline">
              {property.title}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-xs gap-1.5 rounded-xl text-muted-foreground hover:text-foreground"
            >
              <Link href="/properties">
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Listings
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-xs gap-1.5 rounded-xl border-border/80"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Property Header Banner */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-indigo-600 text-white font-medium text-xs px-2.5 py-0.5">
              {property.propertyType}
            </Badge>
            {availableRoomsCount > 0 ? (
              <Badge variant="success" className="text-xs">
                {availableRoomsCount} of {totalRoomsCount} Rooms Available
              </Badge>
            ) : (
              <Badge variant="warning" className="text-xs">
                Fully Occupied
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
              Verified Listing
            </Badge>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
            {property.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
              {property.address}, {property.city}
              {property.state ? `, ${property.state}` : ""}, {property.country}
              {property.zipCode ? ` - ${property.zipCode}` : ""}
            </span>
          </div>
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Gallery, Details, Rooms, Amenities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <RoomGallery
              images={property.images}
              title={property.title}
              propertyType={property.propertyType}
              isAvailable={availableRoomsCount > 0}
            />

            {/* Quick Specs Highlight Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-border/70 bg-card p-4 text-center space-y-1">
                <Bed className="h-5 w-5 text-indigo-500 mx-auto" />
                <span className="text-[11px] text-muted-foreground block">
                  Total Units
                </span>
                <span className="font-heading font-bold text-base text-foreground">
                  {totalRoomsCount} {totalRoomsCount === 1 ? "Room" : "Rooms"}
                </span>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-4 text-center space-y-1">
                <Users className="h-5 w-5 text-purple-500 mx-auto" />
                <span className="text-[11px] text-muted-foreground block">
                  Capacity
                </span>
                <span className="font-heading font-bold text-base text-foreground">
                  {selectedRoom?.capacity || 1} Person/Unit
                </span>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-4 text-center space-y-1">
                <Shield className="h-5 w-5 text-emerald-500 mx-auto" />
                <span className="text-[11px] text-muted-foreground block">
                  Security
                </span>
                <span className="font-heading font-bold text-base text-foreground">
                  24/7 Verified
                </span>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card p-4 text-center space-y-1">
                <Zap className="h-5 w-5 text-amber-500 mx-auto" />
                <span className="text-[11px] text-muted-foreground block">
                  Utility Sharing
                </span>
                <span className="font-heading font-bold text-base text-foreground">
                  Fair Split
                </span>
              </div>
            </div>

            {/* Property Description */}
            <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-6">
              <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500" />
                About This Property
              </h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-3">
                {property.description ? (
                  property.description
                    .split("\n\n")
                    .map((para) => <p key={para.slice(0, 30)}>{para}</p>)
                ) : (
                  <p>
                    A premium, comfortable residential space offering modern
                    urban living with all essential utilities, clean
                    surroundings, and secure gated access. Ideal for working
                    professionals, students, and roommates seeking peace of
                    mind.
                  </p>
                )}
              </div>
            </div>

            {/* Individual Room Units Breakdown Section */}
            {property.rooms && property.rooms.length > 0 && (
              <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                      <Bed className="h-5 w-5 text-indigo-500" />
                      Available Room Units ({property.rooms.length})
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Select a room unit to view individual pricing and details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                  {property.rooms.map((room) => {
                    const isSelected = selectedRoom?.id === room.id;
                    return (
                      <button
                        type="button"
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`text-left cursor-pointer rounded-xl border p-4 transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-500/5 ring-2 ring-indigo-500/20 shadow-md"
                            : "border-border/70 bg-muted/20 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-heading font-bold text-sm text-foreground block">
                              {room.roomNumber
                                ? `Unit #${room.roomNumber} - `
                                : ""}
                              {room.roomType}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Capacity: {room.capacity} Person(s)
                            </span>
                          </div>
                          <Badge
                            variant={
                              room.isAvailable ? "success" : "destructive"
                            }
                            className="text-[10px]"
                          >
                            {room.isAvailable ? "Available" : "Occupied"}
                          </Badge>
                        </div>

                        <div className="mt-3 pt-3 border-t border-border/50 flex items-baseline justify-between text-xs">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">
                              Monthly Rent
                            </span>
                            <span className="font-heading font-extrabold text-indigo-600 dark:text-indigo-400 text-base">
                              ৳{room.rentAmount.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-muted-foreground block">
                              Security Deposit
                            </span>
                            <span className="font-semibold text-foreground">
                              ৳
                              {room.securityDeposit?.toLocaleString() ||
                                "1 Mo. Rent"}
                            </span>
                          </div>
                        </div>

                        {room.description && (
                          <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
                            {room.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Amenities Grid */}
            <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-6">
              <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                Amenities & Features
              </h2>

              {property.amenities && property.amenities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {property.amenities.map((amenity) => {
                    const Icon = getAmenityIcon(amenity);
                    return (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">
                          {amenity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {[
                    "High-speed WiFi",
                    "Attached Bath",
                    "Generator Backup",
                    "Gas Connection",
                    "24/7 Security CCTV",
                    "Spacious Balcony",
                  ].map((item) => {
                    const Icon = getAmenityIcon(item);
                    return (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/20 p-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-semibold text-foreground">
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* House Rules & Community Guidelines */}
            <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-6">
              <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-500" />
                House Rules & Policies
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2.5 rounded-xl bg-muted/30 p-3 border border-border/50">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">
                      Minimum Lease Duration
                    </span>
                    <span className="text-muted-foreground">
                      Standard 6-month agreement with 1-month advance notice.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl bg-muted/30 p-3 border border-border/50">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">
                      Quiet Hours
                    </span>
                    <span className="text-muted-foreground">
                      11:00 PM – 7:00 AM to respect working roommates and
                      neighbors.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl bg-muted/30 p-3 border border-border/50">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">
                      Visitor Policy
                    </span>
                    <span className="text-muted-foreground">
                      Guests welcome during daytime; overnight guests by mutual
                      agreement.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl bg-muted/30 p-3 border border-border/50">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground block">
                      Smoking & Pets
                    </span>
                    <span className="text-muted-foreground">
                      Designated smoking zones only. Please check with landlord
                      for pets.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Leaflet Location & Neighborhood Map */}
            <div className="space-y-4 rounded-2xl border border-border/70 bg-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-indigo-500" />
                    Location & Neighborhood Map
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Interactive geographic overview of {property.city} and
                    surrounding transit
                  </p>
                </div>
              </div>

              <PropertyMap
                title={property.title}
                address={property.address}
                city={property.city}
                propertyType={property.propertyType}
              />
            </div>
          </div>

          {/* Right Column (1 Col): Sticky Booking & Landlord Widget */}
          <div className="lg:col-span-1">
            <RoomBookingCard
              property={property}
              selectedRoom={selectedRoom}
              onSelectRoom={(r) => setSelectedRoom(r)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
