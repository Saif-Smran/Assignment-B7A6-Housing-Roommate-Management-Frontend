"use client";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Image as ImageIcon,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import type { PropertyImage } from "@/interfaces";

interface RoomGalleryProps {
  images?: PropertyImage[];
  title: string;
  propertyType?: string;
  isAvailable?: boolean;
}

export function RoomGallery({
  images = [],
  title,
  propertyType,
  isAvailable = true,
}: RoomGalleryProps) {
  // Fallback images if no images are in the database
  const fallbackImages = [
    {
      id: "fb-1",
      propertyId: "default",
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85",
      isPrimary: true,
      createdAt: "",
    },
    {
      id: "fb-2",
      propertyId: "default",
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85",
      isPrimary: false,
      createdAt: "",
    },
    {
      id: "fb-3",
      propertyId: "default",
      url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85",
      isPrimary: false,
      createdAt: "",
    },
    {
      id: "fb-4",
      propertyId: "default",
      url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=85",
      isPrimary: false,
      createdAt: "",
    },
  ];

  const displayImages = images && images.length > 0 ? images : fallbackImages;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = React.useState(false);

  const activeImage = displayImages[currentIndex] || displayImages[0];

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  };

  return (
    <div className="w-full space-y-3">
      {/* Main Feature Image Container */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted/60 border border-border/60 shadow-lg group">
        <Image
          src={activeImage.url}
          alt={`${title} - Photo ${currentIndex + 1}`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 80vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
          {propertyType && (
            <Badge className="bg-background/90 text-foreground backdrop-blur-md border-none font-semibold px-3 py-1 shadow-sm text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
              {propertyType}
            </Badge>
          )}
          <Badge
            variant={isAvailable ? "success" : "warning"}
            className="backdrop-blur-md shadow-sm font-semibold px-2.5 py-1 text-xs"
          >
            {isAvailable ? "Available for Rent" : "Currently Occupied"}
          </Badge>
        </div>

        {/* Fullscreen Expand Action */}
        <button
          type="button"
          onClick={() => setIsFullscreenOpen(true)}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-black/50 text-white backdrop-blur-md hover:bg-black/75 transition-all"
          aria-label="View Fullscreen"
        >
          <Expand className="h-4 w-4" />
        </button>

        {/* Navigation Arrows (if > 1 image) */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md opacity-80 hover:opacity-100 hover:bg-black/70 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md opacity-80 hover:opacity-100 hover:bg-black/70 transition-all"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Bottom Counter Bar */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
          <ImageIcon className="h-3.5 w-3.5" />
          <span>
            {currentIndex + 1} / {displayImages.length}
          </span>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-18 w-24 sm:h-20 sm:w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                currentIndex === idx
                  ? "border-indigo-600 shadow-md ring-2 ring-indigo-500/20"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreenOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setIsFullscreenOpen(false)}
            className="absolute top-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            aria-label="Close fullscreen gallery"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative h-[80vh] w-[90vw] max-w-5xl">
            <Image
              src={activeImage.url}
              alt={`${title} - Enlarged photo`}
              fill
              className="object-contain"
            />

            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-all"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-all"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
