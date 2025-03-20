"use client"

import { motion } from "framer-motion"
import { CalendarDays, ChevronDown, ChevronUp, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Event } from "@/lib/data"

interface EventCardProps {
  event: Event
}

const EventImage = ({ src, alt }: { src: string; alt: string }) => {
  const [imageSrc, setImageSrc] = useState(src)

  return (
    <img
      src={imageSrc}
      alt={alt}
      className="h-48 w-full object-cover rounded-t-lg"
      onError={() => setImageSrc("/placeholder.svg")}
    />
  )
}

export function EventCard({ event }: Readonly<EventCardProps>) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="aspect-video w-full overflow-hidden relative">
          <EventImage src={event.image || "/placeholder.svg?height=200&width=400"} alt={event.title} />
          <div className="absolute top-2 right-2">
            <Badge variant={event.category === "Academic" ? "default" : "secondary"}>{event.category}</Badge>
          </div>
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="mr-1 h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              <span>
                {event.attendees}/{event.capacity}
              </span>
            </div>
          </div>
          <CardTitle className="line-clamp-1 mt-2">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{event.location}</span>
            </div>
            <motion.div
              className={`mt-2 text-muted-foreground overflow-hidden`}
              initial={{ height: "3rem" }}
              animate={{ height: isExpanded ? "auto" : "3rem" }}
              transition={{ duration: 0.3 }}
            >
              <p className={isExpanded ? "" : "line-clamp-2"}>{event.description}</p>
            </motion.div>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto font-normal text-muted-foreground"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Read more
                </>
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Link href={`/events/${event.id}`} className="w-full">
            <Button className="w-full">View Details</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

