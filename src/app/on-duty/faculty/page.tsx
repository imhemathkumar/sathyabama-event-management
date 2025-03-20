"use client"

import { ODRequestCard } from "@/components/od-request-card"
import { SharedLayout } from "@/components/shared-layout"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useODStore } from "@/lib/store"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function FacultyOnDuty() {
  const searchParams = useSearchParams()
  const facultyId = searchParams.get("id")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const { requests, updateRequestStatus } = useODStore()

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.event.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || req.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const handleApprove = (id: string) => {
    updateRequestStatus(id, "Approved")
  }

  const handleReject = (id: string) => {
    updateRequestStatus(id, "Rejected")
  }

  return (
    <SharedLayout userType="faculty">
      <main className="flex-1 p-4 sm:p-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold">On-Duty Management</h2>
            <p className="text-muted-foreground">Manage on-duty requests from students</p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search requests..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ODRequestCard request={request} userType="faculty" onApprove={handleApprove} onReject={handleReject} />
              </motion.div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <motion.div
              className="text-center py-10 bg-white rounded-lg shadow mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-500">No requests found matching your criteria.</p>
            </motion.div>
          )}
        </div>
      </main>
    </SharedLayout>
  )
}

