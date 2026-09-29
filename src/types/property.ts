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
