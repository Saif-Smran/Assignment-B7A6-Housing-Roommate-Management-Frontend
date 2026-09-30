import { ArrowLeft, Building2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getProperties,
  getPropertyById,
  getRoomById,
} from "@/api/properties.api";
import { RoomDetailsContent } from "@/components/room/room-details-content";
import { Button } from "@/components/ui/button";
import type { PropertyDetails } from "@/interfaces";

interface PropertiesDetailsPageProps {
  searchParams: Promise<{
    id?: string;
    propertyId?: string;
    roomId?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: PropertiesDetailsPageProps): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const targetId =
    resolvedParams.id || resolvedParams.propertyId || resolvedParams.roomId;

  if (!targetId) {
    return {
      title: "Property & Room Details | UrbanMatch",
      description:
        "View property and room specifications, pricing, amenities, and host details.",
    };
  }

  const response = await getPropertyById(targetId);
  const property = response.data;

  if (!property) {
    return {
      title: "Property Details | UrbanMatch",
      description:
        "View room specifications, pricing, amenities, and host details.",
    };
  }

  return {
    title: `${property.title} | UrbanMatch`,
    description:
      property.description ||
      `Explore rooms at ${property.title}, located in ${property.city}. Verified listings with amenities and direct application.`,
  };
}

export default async function PropertiesDetailsPage({
  searchParams,
}: PropertiesDetailsPageProps) {
  const resolvedParams = await searchParams;
  const targetId =
    resolvedParams.id || resolvedParams.propertyId || resolvedParams.roomId;

  let property: PropertyDetails | null = null;
  let initialRoomId: string | undefined = resolvedParams.roomId;

  if (targetId) {
    // Try fetching by property ID first
    const propRes = await getPropertyById(targetId);
    if (propRes.success && propRes.data) {
      property = propRes.data;
    } else {
      // Try fetching as room ID
      const roomRes = await getRoomById(targetId);
      if (roomRes.success && roomRes.data) {
        initialRoomId = roomRes.data.id;
        const parentPropRes = await getPropertyById(roomRes.data.propertyId);
        if (parentPropRes.success && parentPropRes.data) {
          property = parentPropRes.data;
        }
      }
    }
  }

  // If no specific property found or no ID was provided, fetch the first available listing as a fallback
  if (!property) {
    const listRes = await getProperties({ limit: 1 });
    if (listRes.data?.items && listRes.data.items.length > 0) {
      property = listRes.data.items[0];
    }
  }

  if (!property) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Building2 className="h-8 w-8" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground">
          No Property Selected
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Please select a room or property from our listings catalog to view
          full details, photos, and landlord contact information.
        </p>
        <Button
          asChild
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Link href="/properties">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Browse All Listings
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <RoomDetailsContent property={property} initialRoomId={initialRoomId} />
  );
}
