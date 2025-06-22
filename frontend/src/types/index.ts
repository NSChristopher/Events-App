export interface User {
  id: number;
  email: string;
  username: string;
  createdAt?: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  eventDate: string;
  creatorId: number;
  creator: User;
  createdAt: string;
  updatedAt: string;
  invitations?: Invitation[];
  rsvps?: Rsvp[];
  attendeeCount?: number;
}

export interface Invitation {
  id: number;
  eventId: number;
  inviterId: number;
  inviteeId: number;
  status: 'pending' | 'accepted' | 'declined';
  event?: Event;
  inviter?: User;
  invitee?: User;
  sentAt: string;
}

export interface Rsvp {
  id: number;
  eventId: number;
  userId: number;
  response: 'attending' | 'not_attending' | 'maybe';
  event?: Event;
  user?: User;
  respondedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface CreateEventData {
  title: string;
  description?: string;
  location?: string;
  eventDate: string;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  location?: string;
  eventDate?: string;
}

export interface InviteUserData {
  eventId: number;
  inviteeId: number;
}

export interface RsvpData {
  eventId: number;
  response: 'attending' | 'not_attending' | 'maybe';
}