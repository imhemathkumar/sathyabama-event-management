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
  image: string
}

interface EventStore {
  events: Event[]
  addEvent: (event: Omit<Event, 'id'>) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
}

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      events: [],
      addEvent: (event) => 
        set((state) => ({
          events: [...state.events, { ...event, id: Math.random().toString(36).slice(2) }]
        })),
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updatedEvent } : event
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id)
        })),
    }),
    {
      name: 'event-store',
    }
  )
)

