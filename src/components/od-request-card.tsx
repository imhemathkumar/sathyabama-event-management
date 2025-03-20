"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { ODRequest } from "@/lib/types"
import { motion } from "framer-motion"
import { Check, Clock, FileText, X } from "lucide-react"
import { useState } from "react"

interface ODRequestCardProps {
  request: ODRequest
  userType: "student" | "faculty"
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function ODRequestCard({ request, userType, onApprove, onReject }: Readonly<ODRequestCardProps>) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <motion.div
        className="bg-white rounded-lg shadow-sm p-4 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{request.id}</span>
            <Badge
              variant={
                request.status === "Approved" ? "default" : request.status === "Rejected" ? "destructive" : "secondary"
              }
              className={
                request.status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : request.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }
            >
              {request.status}
            </Badge>
          </div>
          <span className="text-sm text-gray-500">{request.date}</span>
        </div>

        <div className="space-y-2">
          <div>
            <div className="font-medium">{request.student.name}</div>
            <div className="text-xs text-gray-500">{request.student.id}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm">
              <span className="text-gray-500">Reason:</span> {request.reason}
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Event:</span> {request.event}
            </div>
            {request.time && (
              <div className="text-sm flex items-center">
                <span className="text-gray-500 mr-1">Time:</span>
                <Clock className="h-3 w-3 mr-1 text-gray-500" />
                {request.time}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          {userType === "faculty" && request.status === "Pending" ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                onClick={() => onApprove?.(request.id)}
              >
                <Check className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                onClick={() => onReject?.(request.id)}
              >
                <X className="h-4 w-4 mr-1" />
                Reject
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" className="w-full" onClick={() => setShowDetails(true)}>
              <FileText className="h-4 w-4 mr-1" />
              View Details
            </Button>
          )}
        </div>
      </motion.div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>On-Duty Request Details</DialogTitle>
            <DialogDescription>Request ID: {request.id}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Badge
                variant={
                  request.status === "Approved"
                    ? "default"
                    : request.status === "Rejected"
                      ? "destructive"
                      : "secondary"
                }
                className={
                  request.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : request.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }
              >
                {request.status}
              </Badge>
              <div className="text-right">
                <div className="text-sm text-gray-500">{request.date}</div>
                {request.time && (
                  <div className="text-sm text-gray-500 flex items-center justify-end mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {request.time}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Student Details</h4>
                <p className="font-medium">{request.student.name}</p>
                <p className="text-sm text-gray-500">{request.student.id}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Reason</h4>
                <p>{request.reason}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Event</h4>
                <p>{request.event}</p>
              </div>

              {request.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="text-sm text-gray-600">{request.description}</p>
                </div>
              )}
            </div>

            {userType === "faculty" && request.status === "Pending" && (
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                  onClick={() => {
                    onApprove?.(request.id)
                    setShowDetails(false)
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                  onClick={() => {
                    onReject?.(request.id)
                    setShowDetails(false)
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
