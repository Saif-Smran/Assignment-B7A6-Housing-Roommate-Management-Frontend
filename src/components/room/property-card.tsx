import {
  ArrowRight,
  Bed,
  Building,
  CheckCircle2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PropertyCardProps, PropertyDetails } from "@/interfaces";
export type { PropertyCardProps };


export function PropertyCard({ property }: PropertyCardProps) {
  // Get primary image or first available image or fallback Unsplash property image
  const primaryImg =
    property.images?.find((img) => img.isPrimary)?.url ||
    property.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";

  // Calculate lowest rent among available rooms
  const availableRooms = property.rooms?.filter((r) => r.isAvailable) || [];
  const roomCount = property.rooms?.length || 0;
  const rents = property.rooms?.map((r) => r.rentAmount) || [];
  const minRent = rents.length > 0 ? Math.min(...rents) : null;

  return (
    <Card className="group overflow-hidden border border-border/60 bg-card hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Card Header Media */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
          <Image
            src={primaryImg}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges on Image */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <Badge className="bg-background/95 text-foreground backdrop-blur-md shadow-sm border-none text-[11px] font-semibold px-2.5 py-0.5">
              <Building className="h-3 w-3 mr-1 text-indigo-500 inline" />
              {property.propertyType}
            </Badge>

            {availableRooms.length > 0 ? (
              <Badge
                variant="success"
                className="backdrop-blur-md shadow-sm text-[10px] font-semibold"
              >
                <CheckCircle2 className="h-3 w-3 mr-1 inline" />
                {availableRooms.length} Available
              </Badge>
            ) : (
              <Badge
                variant="warning"
                className="backdrop-blur-md shadow-sm text-[10px] font-semibold"
              >
                Fully Booked
              </Badge>
            )}
          </div>

          {/* Price Tag Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
            <div>
              <span className="text-xs font-medium text-zinc-300 block">
                Rent Starts From
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold font-heading text-white tracking-tight">
                  ৳{minRent ? minRent.toLocaleString() : "N/A"}
                </span>
                <span className="text-xs text-zinc-300">/ month</span>
              </div>
            </div>

            {roomCount > 0 && (
              <div className="flex items-center gap-1 text-xs bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                <Bed className="h-3.5 w-3.5 text-indigo-400" />
                <span>
                  {roomCount} {roomCount === 1 ? "Room" : "Rooms"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card Content Body */}
        <CardContent className="p-5 space-y-3">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">
              {property.address}, {property.city}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-lg text-foreground line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {property.title}
          </h3>

          {/* Description */}
          {property.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {property.description}
            </p>
          )}

          {/* Amenities Chips */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {property.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center text-[10px] font-medium bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md border border-border/40"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="text-[10px] font-medium text-muted-foreground px-1.5 py-0.5">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Card Footer */}
      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-border/40 mt-3 pt-3">
        {property.owner ? (
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/20">
              {property.owner.fullName.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-foreground line-clamp-1">
                {property.owner.fullName}
              </span>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                <ShieldCheck className="h-2.5 w-2.5 inline" /> Verified Owner
              </span>
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            Verified Property
          </span>
        )}

        <Button
          asChild
          size="sm"
          className="rounded-xl text-xs gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm"
        >
          <Link href={`/properties/details?id=${property.id}`}>
            View Rooms
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
