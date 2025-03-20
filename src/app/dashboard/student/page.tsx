"use client"

import { AuthRedirect } from "@/components/auth-redirect"
import { EventCardV2 } from "@/components/event-card-v2"
import { SharedLayout } from "@/components/shared-layout"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/lib/auth-utils"
import { useEventStore } from "@/lib/data"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function StudentDashboard() {
  const searchParams = useSearchParams()
  const studentId = searchParams.get("id") || "SIST2022CS001"
  const [searchTerm, setSearchTerm] = useState("")

  const router = useRouter()
  const events = useEventStore((state) => state.events)
  const registerForEvent = useEventStore((state) => state.registerForEvent)

  useEffect(() => {
    if (!searchParams.get("id")) {
      const user = getCurrentUser()
      if (user && user.userType === "student") {
        router.replace(`/dashboard/student?id=${user.userId}`)
      }
    }

    // Prefetch other main routes for faster navigation
    router.prefetch(`/certificates/student?id=${studentId}`)
    router.prefetch(`/on-duty/student?id=${studentId}`)
  }, [router, searchParams, studentId])

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleRegister = async (eventId: string) => {
    try {
      await registerForEvent(eventId, studentId)
      router.refresh()
    } catch (error) {
      console.error("Failed to register for event:", error)
    }
  }

  return (
    <>
      <AuthRedirect requireAuth={true} />
      <SharedLayout userType="student">
        <main className="flex-1 p-4 sm:p-6 bg-gray-50">
          <div className="container mx-auto">
            <motion.div
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <h2 className="text-2xl font-bold">Campus Events</h2>
                <p className="text-muted-foreground">Discover and register for upcoming events</p>
              </div>
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
                    userType="student"
                    onRegister={() => handleRegister(event.id)}
                    isRegistered={event.registeredUsers?.includes(studentId)}
                  />
                </motion.div>
              ))}

              {filteredEvents.length === 0 && (
                <motion.div
                  className="col-span-full text-center py-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-gray-500">No events found matching your search criteria.</p>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </SharedLayout>
    </>
  )
}

