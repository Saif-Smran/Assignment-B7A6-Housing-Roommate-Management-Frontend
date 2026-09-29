export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string | null;
  roomType: string;
  capacity: number;
  rentAmount: number;
  securityDeposit: number | null;
  availableFrom: string | null;
  availableTo: string | null;
  isAvailable: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
