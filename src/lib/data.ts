import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Event {
  id: string
  title: string
  description: string
  date: Date
  time: string
  location: string
  category: string
  organizer: string
  capacity: number
  attendees: number
  image: string
  registeredUsers: string[]
}

interface EventStore {
  events: Event[]
  addEvent: (event: Event) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
  registerForEvent: (eventId: string, studentId: string) => void
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (event) =>
        set((state) => ({
          events: [
            ...state.events,
            {
              ...event,
              id: String(Date.now()),
              date: new Date(event.date),
              attendees: 0,
              registeredUsers: [],
              image: event.image || "/placeholder.svg"
            },
          ],
        })),
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id
              ? {
                  ...event,
                  ...updatedEvent,
                  date: new Date(updatedEvent.date || event.date),
                  image: updatedEvent.image || event.image
                }
              : event
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
      registerForEvent: async (eventId: string, studentId: string) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === eventId
              ? {
                  ...event,
                  attendees: event.attendees + 1,
                  registeredUsers: [...(event.registeredUsers || []), studentId],
                }
              : event
          ),
        })),
    }),
    {
      name: 'event-store',
    }
  )
)

export type { Event }

function createJSONStorage(getStorage: () => Storage) {
  return {
    getItem: (name: string) => {
      const str = getStorage().getItem(name);
      if (!str) return null;
      try {
        return JSON.parse(str);
      } catch (err) {
        return null;
      }
    },
    setItem: (name: string, value: any) => {
      try {
        getStorage().setItem(name, JSON.stringify(value));
      } catch (err) {
        console.warn('Error saving to storage:', err);
      }
    },
    removeItem: (name: string) => {
      getStorage().removeItem(name);
    },
  };
}

