"use client"

import { EventDialog } from "@/components/event-dialog"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEventStore, type Event } from "@/lib/data"
import { motion } from "framer-motion"
import { Calendar, Edit, Trash } from "lucide-react"
import { useState } from "react"
import { EventForm } from "./event-form"

interface EventCardV2Props {
  event: Event
  userType: "student" | "faculty"
  onEdit?: () => void
  onDelete?: () => void
  onRegister?: () => void
  isRegistered?: boolean
}

const EventImage = ({ src, alt }: { src: string; alt: string }) => {
  const [imageSrc, setImageSrc] = useState(src)

  return (
    <img
      src={imageSrc}
      alt={alt}
      className="h-full w-full object-cover"
      onError={() => setImageSrc("/placeholder.svg")} // Fallback image
    />
  )
}

export function EventCardV2({ event, userType, onEdit, onDelete, onRegister, isRegistered }: Readonly<EventCardV2Props>) {
  const [showDialog, setShowDialog] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const updateEvent = useEventStore((state) => state.updateEvent)
  const handleEditSubmit = async (updatedEvent: Event) => {
    try {
      if (event.id) {

        updateEvent(event.id, { ...updatedEvent, id: event.id })
        setShowEditForm(false)
        setShowDialog(false)
      }
    } catch (error) {
      console.error("Failed to update event:", error)
    }
  }

  if (showEditForm) {
    return (
      <Dialog open={showEditForm} onOpenChange={() => setShowEditForm(false)}>
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
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowEditForm(true);
    onEdit?.();
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group cursor-pointer"
        onClick={() => setShowDialog(true)}
      >
        <Card className="overflow-hidden">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100 relative">
            <EventImage
              src={event.image || "/placeholder.svg"}
              alt={event.title}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                {event.category}
              </span>
              {isRegistered && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  Registered
                </span>
              )}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2 line-clamp-1">{event.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {event.attendees}/{event.capacity} registered
              </span>
              {userType === "faculty" && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleEdit}

                    className="p-2 hover:bg-accent rounded-md"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete?.()
                    }}
                    className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-md"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      <EventDialog
        event={event}
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        userType={userType}
        onEdit={onEdit}
        onDelete={onDelete}
        onRegister={onRegister}
        isRegistered={isRegistered}
      />
    </>
  )
}