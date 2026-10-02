"use client";

import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import { createProperty } from "@/api/properties.api";
import { createRoom } from "@/api/rooms.api";
import {
  OwnerPageHeader,
  ownerSectionClass,
} from "@/components/owner/owner-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAuthToken } from "@/lib/auth";

type Draft = {
  title: string;
  description: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  amenities: string;
  rooms: {
    id: string;
    roomNumber: string;
    roomType: string;
    capacity: string;
    rentAmount: string;
    securityDeposit: string;
    description: string;
  }[];
};
const initialDraft: Draft = {
  title: "",
  description: "",
  propertyType: "Apartment",
  address: "",
  city: "",
  state: "",
  country: "Bangladesh",
  zipCode: "",
  amenities: "",
  rooms: [
    {
      id: "room-1",
      roomNumber: "",
      roomType: "Single",
      capacity: "1",
      rentAmount: "",
      securityDeposit: "",
      description: "",
    },
  ],
};

export default function NewOwnerPropertyPage() {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [saving, setSaving] = useState(false);
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const updateRoom = (
    index: number,
    key: keyof Draft["rooms"][number],
    value: string,
  ) =>
    setDraft((current) => ({
      ...current,
      rooms: current.rooms.map((room, roomIndex) =>
        roomIndex === index ? { ...room, [key]: value } : room,
      ),
    }));

  function next() {
    if (step === 1 && (!draft.title || !draft.address || !draft.city)) {
      toast.error("Title, address, and city are required.");
      return;
    }
    if (
      step === 3 &&
      draft.rooms.some((room) => !room.roomType || !room.rentAmount)
    ) {
      toast.error("Each room needs a type and rent amount.");
      return;
    }
    setStep((current) => Math.min(4, current + 1));
  }

  async function submit() {
    setSaving(true);
    const token = getAuthToken() || undefined;
    const propertyResponse = await createProperty(
      {
        ...draft,
        amenities: draft.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      },
      token,
    );
    if (!propertyResponse.success || !propertyResponse.data) {
      toast.error(propertyResponse.message || "Unable to create property.");
      setSaving(false);
      return;
    }
    for (const room of draft.rooms) {
      const roomResponse = await createRoom(
        propertyResponse.data.id,
        {
          roomNumber: room.roomNumber || undefined,
          roomType: room.roomType,
          capacity: Number(room.capacity),
          rentAmount: Number(room.rentAmount),
          securityDeposit: room.securityDeposit
            ? Number(room.securityDeposit)
            : undefined,
          description: room.description || undefined,
        },
        token,
      );
      if (!roomResponse.success) {
        toast.error(
          roomResponse.message ||
            "Property created, but a room could not be added.",
        );
        setSaving(false);
        return;
      }
    }
    toast.success("Property and rooms created.");
    window.location.href = `/dashboard/owner/properties/${propertyResponse.data.id}`;
  }

  return (
    <section className={ownerSectionClass}>
      <OwnerPageHeader
        title="Add a property"
        description="Create a listing and define its rooms in four steps."
        action={
          <Link
            href="/dashboard/owner/properties"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to properties
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[180px_1fr]">
        <div className="space-y-2">
          {["Basics", "Amenities", "Rooms", "Review"].map((label, index) => (
            <div
              key={label}
              className={`rounded-lg border p-3 text-sm ${step === index + 1 ? "border-indigo-500 bg-indigo-500/10 font-semibold" : "text-muted-foreground"}`}
            >
              <span className="mr-2">{index + 1}</span>
              {label}
            </div>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>
              {
                [
                  "Property basics",
                  "Amenities and images",
                  "Rooms",
                  "Review and submit",
                ][step - 1]
              }
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["title", "Title"],
                    ["propertyType", "Property type"],
                    ["address", "Address"],
                    ["city", "City"],
                    ["state", "State"],
                    ["country", "Country"],
                    ["zipCode", "ZIP code"],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    htmlFor={`new-${key}`}
                    key={key}
                    className="space-y-1 text-sm"
                  >
                    <span>{label}</span>
                    <Input
                      id={`new-${key}`}
                      value={draft[key]}
                      onChange={(event) => update(key, event.target.value)}
                    />
                  </label>
                ))}
                <label
                  htmlFor="new-description"
                  className="space-y-1 text-sm sm:col-span-2"
                >
                  <span>Description</span>
                  <textarea
                    id="new-description"
                    value={draft.description}
                    onChange={(event) =>
                      update("description", event.target.value)
                    }
                    className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </label>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <label htmlFor="new-amenities" className="space-y-1 text-sm">
                  <span>Amenities</span>
                  <Input
                    id="new-amenities"
                    value={draft.amenities}
                    onChange={(event) =>
                      update("amenities", event.target.value)
                    }
                    placeholder="WiFi, Parking, Lift"
                  />
                  <span className="text-xs text-muted-foreground">
                    Separate amenities with commas.
                  </span>
                </label>
                <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                  Property image upload is unavailable because the backend
                  collection exposes no image upload endpoint.
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                {draft.rooms.map((room, index) => (
                  <div key={room.id} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold">Room {index + 1}</p>
                      {draft.rooms.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Remove room"
                          onClick={() =>
                            update(
                              "rooms",
                              draft.rooms.filter(
                                (_, roomIndex) => roomIndex !== index,
                              ),
                            )
                          }
                        >
                          <Trash2 />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          ["roomNumber", "Room number"],
                          ["roomType", "Room type"],
                          ["capacity", "Capacity"],
                          ["rentAmount", "Rent amount"],
                          ["securityDeposit", "Security deposit"],
                        ] as const
                      ).map(([key, label]) => (
                        <label
                          htmlFor={`${room.id}-${key}`}
                          key={key}
                          className="space-y-1 text-sm"
                        >
                          <span>{label}</span>
                          <Input
                            id={`${room.id}-${key}`}
                            type={
                              [
                                "capacity",
                                "rentAmount",
                                "securityDeposit",
                              ].includes(key)
                                ? "number"
                                : "text"
                            }
                            value={room[key]}
                            onChange={(event) =>
                              updateRoom(index, key, event.target.value)
                            }
                          />
                        </label>
                      ))}
                      <label
                        htmlFor={`${room.id}-description`}
                        className="space-y-1 text-sm sm:col-span-2"
                      >
                        <span>Description</span>
                        <Input
                          id={`${room.id}-description`}
                          value={room.description}
                          onChange={(event) =>
                            updateRoom(index, "description", event.target.value)
                          }
                        />
                      </label>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    update("rooms", [
                      ...draft.rooms,
                      {
                        id: `room-${Date.now()}`,
                        roomNumber: "",
                        roomType: "Single",
                        capacity: "1",
                        rentAmount: "",
                        securityDeposit: "",
                        description: "",
                      },
                    ])
                  }
                >
                  <Plus /> Add room
                </Button>
              </div>
            )}
            {step === 4 && (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold">{draft.title}</p>
                  <p className="text-muted-foreground">
                    {draft.address}, {draft.city}, {draft.country}
                  </p>
                </div>
                <p>{draft.description || "No description provided."}</p>
                <p>
                  <span className="font-medium">Amenities:</span>{" "}
                  {draft.amenities || "None"}
                </p>
                <div className="space-y-2">
                  {draft.rooms.map((room, index) => (
                    <div key={room.id} className="rounded-md border p-3">
                      Room {room.roomNumber || index + 1}: {room.roomType}, BDT{" "}
                      {room.rentAmount} rent, capacity {room.capacity}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between border-t pt-4">
              <Button
                variant="outline"
                disabled={step === 1 || saving}
                onClick={() => setStep((current) => current - 1)}
              >
                <ArrowLeft /> Back
              </Button>
              {step < 4 ? (
                <Button onClick={next}>
                  Next <ArrowRight />
                </Button>
              ) : (
                <Button disabled={saving} onClick={() => void submit()}>
                  <Check /> {saving ? "Creating..." : "Create property"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
