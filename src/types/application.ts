import type { ApplicationStatus } from "./enums";

export interface Application {
	id: string;
	tenantId: string;
	roomId: string;
	status: ApplicationStatus;
	moveInDate: string;
	moveOutDate: string | null;
	message: string | null;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}
