export interface Notification {
  id: string;
  receiverId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
