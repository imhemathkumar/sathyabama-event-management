"use client"

import { AuthRedirect } from "@/components/auth-redirect"
import { EventCardV2 } from "@/components/event-card-v2"
import { EventForm } from "@/components/event-form"
import { LoadingSpinner } from "@/components/loading-spinner"
import { SharedLayout } from "@/components/shared-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/lib/auth-utils"
import { useEventStore } from "@/lib/data"
import { motion } from "framer-motion"
import { Plus, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

export default function FacultyDashboard() {
  const searchParams = useSearchParams()
  const facultyId = searchParams.get("id") ?? "42611001"
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddEventModal, setShowAddEventModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const events = useEventStore((state) => state.events)
  const deleteEvent = useEventStore((state) => state.deleteEvent)
  const addEvent = useEventStore((state) => state.addEvent)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Check if user is authenticated and get ID from localStorage if not in URL
  useEffect(() => {
    if (!searchParams.get("id")) {
      const user = getCurrentUser()
      if (user && user.userType === "faculty") {
        router.replace(`/dashboard/faculty?id=${user.userId}`)
      }
    }

    // Prefetch other main routes for faster navigation
    router.prefetch(`/certificates/faculty?id=${facultyId}`)
    router.prefetch(`/on-duty/faculty?id=${facultyId}`)
  }, [router, searchParams, facultyId])

  // Memoize filtered events to prevent unnecessary recalculations
  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [events, searchTerm])

  // Memoize event handlers to prevent unnecessary re-renders
  const handleEditEvent = useCallback((eventId: string) => {
    console.log("Edit event:", eventId)
  }, [])

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      // Delete the event directly without confirmation
        deleteEvent(eventId)
      
    },
    [deleteEvent],
  )

  const handleSubmit = useCallback(
    async (eventData: Event) => {
      try {
        addEvent(eventData)
        setShowAddEventModal(false)
        router.refresh()
      } catch (error) {
        console.error("Failed to create event:", error)
      }
    },
    [addEvent, router],
  )

  const handleCancel = useCallback(() => {
    setShowAddEventModal(false)
  }, [])

  if (isLoading) {
    return (
      <>
        <AuthRedirect requireAuth={true} />
        <SharedLayout userType="faculty">
          <LoadingSpinner />
        </SharedLayout>
      </>
    )
  }

  return (
    <>
      <AuthRedirect requireAuth={true} />
      <SharedLayout userType="faculty">
        <main className="flex-1 p-4 sm:p-6 bg-gray-50">
          <div className="container mx-auto">
            <motion.div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <h2 className="text-2xl font-bold">Event Management</h2>
                <p className="text-muted-foreground">Manage and monitor campus events</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search events..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    className="bg-[#800000] hover:bg-[#600000] text-white w-full sm:w-auto"
                    onClick={() => setShowAddEventModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EventCardV2
                    event={event}
                    userType="faculty"
                    onEdit={() => handleEditEvent(event.id)}
                    onDelete={() => handleDeleteEvent(event.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </main>

        {showAddEventModal && (
          <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddEventModal(false)} />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Create New Event</h3>
                    <button onClick={() => setShowAddEventModal(false)} className="text-gray-500 hover:text-gray-700">
                      ✕
                    </button>
                  </div>
                </div>
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <EventForm onSubmit={handleSubmit} onCancel={handleCancel} />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </SharedLayout>
    </>
  )
}

