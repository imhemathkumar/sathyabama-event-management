"use client"

import { RegisterForm } from "@/components/register-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEventStore, type Event } from "@/lib/data"
import { Calendar, Clock, Edit, MapPin, Trash, Users } from "lucide-react"
import { useState } from "react"
import { EventForm } from "./event-form"

interface EventDialogProps {
  event: Event
  isOpen: boolean
  onClose: () => void
  userType: "student" | "faculty"
  onRegister?: () => void
  onEdit?: () => void
  onDelete?: () => void
  isRegistered?: boolean
}

export function EventDialog({ event, isOpen, onClose, userType, onRegister, onEdit, onDelete, isRegistered }: Readonly<EventDialogProps>) {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const updateEvent = useEventStore((state) => state.updateEvent)
  const deleteEvent = useEventStore((state) => state.deleteEvent)

  const handleEdit = () => {
    setShowEditForm(true)
  }

  const handleEditSubmit = async (updatedEvent: Event) => {
    try {
      updateEvent(event.id, updatedEvent)
      setShowEditForm(false)
      onClose()
    } catch (error) {
      console.error("Failed to update event:", error)
    }
  }

  if (showEditForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex mb-6 justify-between ">
            <DialogTitle>Edit Event: {event.title}</DialogTitle>
          </DialogHeader>
          <button
    onClick={() => setShowEditForm(false)}
    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
  >
    ✕
  </button>
          <EventForm event={event} onSubmit={handleEditSubmit} onCancel={() => setShowEditForm(false)} />
        </DialogContent>
      </Dialog>
    )
  }

  if (showRegistrationForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex mb-6 justify-between ">
  <DialogTitle>Register for {event.title}</DialogTitle>
  <button
    onClick={() => setShowRegistrationForm(false)}
    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
  >
    ✕
  </button>
</DialogHeader>

          <RegisterForm eventId={event.id} onClose={onClose} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{event.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full">
          {/* Header - Fixed */}
          <div className="sticky top-0 z-10 bg-white p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold mb-1">{event.title}</h2>
                <p className="text-sm text-gray-500">Event details and management options</p>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Event Image */}
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100 relative">
                <img
                  src={event.image || "/placeholder.svg?height=200&width=400"}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                  {event.category}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Event Details</h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>

                {/* Attendance & Organizer */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Attendance</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Users className="h-4 w-4" />
                      <span>
                        Registered: {event.attendees}/{event.capacity}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Organizer</h3>
                    <p className="text-sm text-gray-600">{event.organizer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              {userType === "faculty" ? (
                <>
                  <Button onClick={handleEdit} className="bg-black hover:bg-gray-800 sm:order-2">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Event
                  </Button>
                  <Button variant="destructive" onClick={onDelete} className="sm:order-3">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Event
                  </Button>
                </>
              ) : (
                renderStudentButton()
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  function renderStudentButton() {
    if (isRegistered) {
      return (
        <Button disabled className="bg-gray-500">
          Already Registered
        </Button>
      )
    } else {
      return (
        <Button onClick={() => setShowRegistrationForm(true)} className="bg-black hover:bg-gray-800">
          Register for Event
        </Button>
      )
    }
  }
}
