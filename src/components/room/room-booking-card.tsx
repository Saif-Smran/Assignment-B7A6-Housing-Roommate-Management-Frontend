"use client";

import {
  BadgeCheck,
  CalendarCheck,
  Clock,
  Eye,
  MessageCircle,
  Phone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import type { PropertyDetails, Room } from "@/api/interfaces";
import { RoomApplicationDialog } from "@/components/room/room-application-dialog";
import { RoomViewingDialog } from "@/components/room/room-viewing-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { isAuthenticated } from "@/lib/auth";

interface RoomBookingCardProps {
  property: PropertyDetails;
  selectedRoom?: Room | null;
  onSelectRoom?: (room: Room) => void;
}

export function RoomBookingCard({
  property,
  selectedRoom: initialSelectedRoom,
}: RoomBookingCardProps) {
  const router = useRouter();
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(
    initialSelectedRoom || property.rooms?.[0] || null,
  );
  const [isApplyOpen, setIsApplyOpen] = React.useState(false);
  const [isViewingOpen, setIsViewingOpen] = React.useState(false);

  const handleApplyClick = () => {
    if (!isAuthenticated()) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    setIsApplyOpen(true);
  };

  const handleViewingClick = () => {
    if (!isAuthenticated()) {
      const currentPath = window.location.pathname + window.location.search;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    setIsViewingOpen(true);
  };

  React.useEffect(() => {
    if (initialSelectedRoom) {
      setSelectedRoom(initialSelectedRoom);
    }
  }, [initialSelectedRoom]);

  // Determine active room or lowest rent
  const activeRoom = selectedRoom || property.rooms?.[0];
  const rent = activeRoom?.rentAmount || 0;
  const deposit = activeRoom?.securityDeposit || rent;
  const isAvailable = activeRoom ? activeRoom.isAvailable : property.isActive;

  return (
    <>
      <div className="sticky top-24 space-y-4">
        {/* Main Price & Booking Card */}
        <Card className="overflow-hidden border border-border/80 bg-card/95 backdrop-blur-xl shadow-xl shadow-indigo-500/5 rounded-2xl">
          <div className="bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 border-b border-border/60 p-5">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
              Monthly Rental Fee
            </span>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold font-heading text-foreground">
                  ৳{rent ? rent.toLocaleString() : "Contact"}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  / month
                </span>
              </div>
              <Badge
                variant={isAvailable ? "success" : "destructive"}
                className="text-xs font-semibold"
              >
                {isAvailable ? "Available Now" : "Occupied"}
              </Badge>
            </div>
          </div>

          <CardContent className="p-5 space-y-4">
            {/* Room Selector Pills if multiple rooms exist */}
            {property.rooms && property.rooms.length > 1 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Choose Room Unit</span>
                  <span className="text-[11px] text-muted-foreground">
                    {property.rooms.length} Units in Property
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {property.rooms.map((room) => {
                    const isSelected = selectedRoom?.id === room.id;
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setSelectedRoom(room)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-500/10 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500/20"
                            : "border-border/60 bg-muted/20 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>
                            {room.roomNumber ? `#${room.roomNumber}` : "Room"}
                          </span>
                          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                            ৳{room.rentAmount.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground line-clamp-1">
                          {room.roomType}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fee Breakdown List */}
            <div className="space-y-2 rounded-xl border border-border/50 bg-muted/30 p-3.5 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Security Deposit</span>
                <span className="font-semibold text-foreground">
                  ৳{deposit ? deposit.toLocaleString() : "1 Month Rent"}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Utility Split Bills</span>
                <span className="font-semibold text-foreground">
                  Shared (Electricity, Gas, WiFi)
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Platform Booking Fee</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ৳0 (Free for Tenants)
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5 pt-1">
              <Button
                type="button"
                onClick={handleApplyClick}
                disabled={!isAvailable}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 gap-2"
              >
                <Zap className="h-4 w-4" />
                Apply for this Room
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleViewingClick}
                className="w-full h-11 rounded-xl border-border/80 hover:bg-muted font-medium text-xs gap-2"
              >
                <Eye className="h-4 w-4 text-purple-500" />
                Schedule In-Person Viewing
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 border-t border-border/60 flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                <span>Verified Property</span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarCheck className="h-4 w-4 text-purple-500" />
                <span>Instant Confirmation</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Landlord / Host Profile Card */}
        {property.owner && (
          <Card className="p-4 rounded-2xl border border-border/70 bg-card space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
              Hosted by Landlord
            </span>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-md shadow-indigo-500/20">
                {property.owner.fullName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-heading font-bold text-sm text-foreground truncate">
                    {property.owner.fullName}
                  </h4>
                  <BadgeCheck className="h-4 w-4 text-indigo-500 shrink-0" />
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3 text-emerald-500" />
                  Typically responds in under 1 hour
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewingClick}
                className="w-full rounded-xl text-xs gap-1.5"
              >
                <MessageCircle className="h-3.5 w-3.5 text-indigo-500" />
                Send Inquiry
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleViewingClick}
                className="w-full rounded-xl text-xs gap-1.5"
              >
                <Phone className="h-3.5 w-3.5 text-purple-500" />
                Call Host
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Popups */}
      <RoomApplicationDialog
        property={property}
        selectedRoom={activeRoom}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />

      <RoomViewingDialog
        property={property}
        selectedRoom={activeRoom}
        isOpen={isViewingOpen}
        onClose={() => setIsViewingOpen(false)}
      />
    </>
  );
}
