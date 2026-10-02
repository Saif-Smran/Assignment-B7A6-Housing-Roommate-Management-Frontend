"use client";

import { Save, ToggleLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getPropertyById,
  getRoomsByPropertyId,
  updateProperty,
} from "@/api/properties.api";
import { updateRoom, updateRoomAvailability } from "@/api/rooms.api";
import {
  OwnerPageHeader,
  OwnerStatus,
  ownerSectionClass,
} from "@/components/owner/owner-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PropertyDetails, Room } from "@/interfaces";
import { getAuthToken } from "@/lib/auth";

export default function OwnerPropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    void params.then((value) => setId(value.id));
  }, [params]);
  useEffect(() => {
    if (!id) return;
    Promise.all([getPropertyById(id), getRoomsByPropertyId(id)]).then(
      ([propertyResponse, roomResponse]) => {
        if (propertyResponse.success) setProperty(propertyResponse.data);
        else
          toast.error(propertyResponse.message || "Unable to load property.");
        if (roomResponse.success) setRooms(roomResponse.data ?? []);
        else toast.error(roomResponse.message || "Unable to load rooms.");
        setLoading(false);
      },
    );
  }, [id]);

  async function saveProperty(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!property) return;
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const response = await updateProperty(
      property.id,
      {
        title: String(form.get("title")),
        description: String(form.get("description")),
        address: String(form.get("address")),
        city: String(form.get("city")),
        state: String(form.get("state")),
        country: String(form.get("country")),
        zipCode: String(form.get("zipCode")),
      },
      getAuthToken() || undefined,
    );
    if (response.success && response.data) {
      setProperty(response.data);
      toast.success("Property updated.");
    } else toast.error(response.message || "Unable to update property.");
    setSaving(false);
  }

  async function toggleRoom(room: Room) {
    const response = await updateRoom(
      room.id,
      { isAvailable: !room.isAvailable },
      getAuthToken() || undefined,
    );
    if (!response.success) {
      toast.error(response.message || "Unable to update room.");
      return;
    }
    setRooms((current) =>
      current.map((item) =>
        item.id === room.id
          ? { ...item, isAvailable: !room.isAvailable }
          : item,
      ),
    );
  }

  async function saveAvailability(
    room: Room,
    availableFrom: string,
    availableTo: string,
  ) {
    const response = await updateRoomAvailability(
      room.id,
      {
        availableFrom: availableFrom || null,
        availableTo: availableTo || null,
        isAvailable: room.isAvailable,
      },
      getAuthToken() || undefined,
    );
    if (!response.success)
      toast.error(response.message || "Unable to update availability.");
    else toast.success("Room availability updated.");
  }

  if (loading)
    return (
      <section className={ownerSectionClass}>
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </section>
    );
  if (!property)
    return (
      <section className={ownerSectionClass}>
        <p className="text-sm text-muted-foreground">Property not found.</p>
      </section>
    );

  return (
    <section className={ownerSectionClass}>
      <OwnerPageHeader
        title={property.title}
        description={`${property.city}, ${property.country}`}
      />
      <Card>
        <CardHeader>
          <CardTitle>Property details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveProperty} className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["title", "Title"],
                ["address", "Address"],
                ["city", "City"],
                ["state", "State"],
                ["country", "Country"],
                ["zipCode", "ZIP code"],
              ] as const
            ).map(([name, label]) => (
              <label
                htmlFor={`property-${name}`}
                key={name}
                className="space-y-1 text-sm"
              >
                <span>{label}</span>
                <Input
                  id={`property-${name}`}
                  name={name}
                  defaultValue={property[name] ?? ""}
                />
              </label>
            ))}
            <label
              htmlFor="property-description"
              className="space-y-1 text-sm sm:col-span-2"
            >
              <span>Description</span>
              <textarea
                id="property-description"
                name="description"
                defaultValue={property.description ?? ""}
                className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </label>
            <div>
              <Button type="submit" disabled={saving}>
                <Save /> {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rooms.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No rooms have been added to this property.
            </p>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      Room {room.roomNumber || "Unnamed"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {room.roomType} · BDT {room.rentAmount.toLocaleString()} ·
                      capacity {room.capacity}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OwnerStatus
                      value={room.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void toggleRoom(room)}
                    >
                      <ToggleLeft /> Toggle
                    </Button>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <label
                    htmlFor={`from-${room.id}`}
                    className="space-y-1 text-xs"
                  >
                    <span>Available from</span>
                    <Input
                      type="date"
                      defaultValue={room.availableFrom?.slice(0, 10) ?? ""}
                      id={`from-${room.id}`}
                    />
                  </label>
                  <label
                    htmlFor={`to-${room.id}`}
                    className="space-y-1 text-xs"
                  >
                    <span>Available to</span>
                    <Input
                      type="date"
                      defaultValue={room.availableTo?.slice(0, 10) ?? ""}
                      id={`to-${room.id}`}
                    />
                  </label>
                  <Button
                    className="self-end"
                    variant="outline"
                    onClick={() => {
                      const from = (
                        document.getElementById(
                          `from-${room.id}`,
                        ) as HTMLInputElement
                      ).value;
                      const to = (
                        document.getElementById(
                          `to-${room.id}`,
                        ) as HTMLInputElement
                      ).value;
                      void saveAvailability(room, from, to);
                    }}
                  >
                    Save dates
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
}
