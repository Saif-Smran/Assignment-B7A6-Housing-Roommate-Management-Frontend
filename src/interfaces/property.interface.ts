import type { Role } from "./enums.interface";
import type { Room } from "./room.interface";

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string | null;
  address: string;
  city: string;
  state: string | null;
  country: string;
  zipCode: string | null;
  propertyType: string;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface PropertyDetails extends Property {
  owner?: {
    id?: string;
    fullName: string;
    email?: string;
    phone?: string | null;
    role?: Role;
  };
  images?: PropertyImage[];
  rooms?: Room[];
}

export interface PropertyFilterParams {
  page?: number;
  limit?: number;
  city?: string;
  minRent?: number;
  maxRent?: number;
  propertyType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  q?: string;
}

export interface PropertyCardProps {
  property: PropertyDetails;
}

export interface PropertiesPageProps {
  searchParams: Promise<{
    city?: string;
    minRent?: string;
    maxRent?: string;
    propertyType?: string;
    q?: string;
    page?: string;
  }>;
}

export interface PropertiesDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export interface RoomGalleryProps {
  images?: PropertyImage[];
  title: string;
}

export interface RoomDetailsContentProps {
  property: PropertyDetails;
}

export interface PropertyMapProps {
  address: string;
  city: string;
  state?: string | null;
  country?: string;
  zipCode?: string | null;
  title: string;
}
