export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: string;
  organizer: string;
  capacity: number;
  attendees: number;
  image: string;
  registeredUsers: string[];
}

export interface EventStore {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'attendees' | 'registeredUsers'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (id: string) => void;
}
export interface Student {
  name: string
  id: string
}

export interface ODRequest {
  id: string
  student: Student
  reason: string
  event: string
  date: string
  time?: string // Add time field
  status: "Pending" | "Approved" | "Rejected"
  description?: string
}

export interface NewODRequest {
  reason: string
  event: string
  date: string
  time?: string // Add time field
  description: string
}

