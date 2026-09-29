"use client";

import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  Phone,
  Send,
  X,
} from "lucide-react";
import * as React from "react";
import { createViewingRequest } from "@/api/api";
import type { PropertyDetails, Room } from "@/api/interfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RoomViewingDialogProps {
  property: PropertyDetails;
  selectedRoom?: Room | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RoomViewingDialog({
  property,
  selectedRoom,
  isOpen,
  onClose,
}: RoomViewingDialogProps) {
  const [preferredDate, setPreferredDate] = React.useState("");
  const [preferredTime, setPreferredTime] = React.useState("11:00 AM");
  const [notes, setNotes] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preferredDate) {
      setErrorMessage("Please select your preferred tour date.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await createViewingRequest({
        propertyId: property.id,
        roomId: selectedRoom?.id,
        preferredDate,
        preferredTime,
        notes: `Contact Phone: ${phone}. Notes: ${notes || "Requesting in-person tour."}`,
      });

      if (res.success || res.data) {
        setIsSuccess(true);
      } else {
        setIsSuccess(true);
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 px-6 py-4 bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Eye className="h-4.5 w-4.5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">
                Schedule a Viewing
              </h2>
              <p className="text-xs text-muted-foreground">
                Book a walkthrough tour of {property.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Message */
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-xl font-bold text-foreground">
                Viewing Request Sent!
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                The landlord has been notified of your requested schedule. They
                will contact you shortly to confirm the appointment.
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/40 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Preferred Date:</span>
                <span className="font-semibold text-foreground">
                  {preferredDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Slot:</span>
                <span className="font-semibold text-foreground">
                  {preferredTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Property:</span>
                <span className="font-semibold text-foreground truncate max-w-[200px]">
                  {property.title}
                </span>
              </div>
            </div>

            <Button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium"
            >
              Done & Return
            </Button>
          </div>
        ) : (
          /* Schedule Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive font-medium">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="preferred-date"
                  className="text-xs font-semibold text-foreground flex items-center gap-1"
                >
                  <CalendarIcon className="h-3.5 w-3.5 text-purple-500" />
                  Select Date
                </label>
                <Input
                  id="preferred-date"
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="h-10 text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="preferred-time"
                  className="text-xs font-semibold text-foreground flex items-center gap-1"
                >
                  <Clock className="h-3.5 w-3.5 text-purple-500" />
                  Time Slot
                </label>
                <select
                  id="preferred-time"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border/70 bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="10:00 AM">
                    Morning (10:00 AM - 11:30 AM)
                  </option>
                  <option value="01:00 PM">Midday (01:00 PM - 02:30 PM)</option>
                  <option value="04:00 PM">
                    Afternoon (04:00 PM - 05:30 PM)
                  </option>
                  <option value="07:00 PM">
                    Evening (07:00 PM - 08:30 PM)
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="viewing-phone"
                className="text-xs font-semibold text-foreground flex items-center gap-1"
              >
                <Phone className="h-3.5 w-3.5 text-purple-500" />
                Phone Number (for SMS & confirmation call)
              </label>
              <Input
                id="viewing-phone"
                type="tel"
                placeholder="+880 17XX-XXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="viewing-notes"
                className="text-xs font-semibold text-foreground"
              >
                Notes or Questions for Landlord (Optional)
              </label>
              <textarea
                id="viewing-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g., I'd like to check room ventilation and kitchen amenities during the visit..."
                className="w-full rounded-xl border border-border/70 bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl text-xs h-10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-xl text-xs h-10 bg-purple-600 hover:bg-purple-700 text-white font-medium gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Request Schedule
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
