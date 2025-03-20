"use client"

import { SharedLayout } from "@/components/shared-layout"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCertificateStore, type Certificate } from "@/lib/certificate-store"
import { motion } from "framer-motion"
import { Download, Eye, FileText, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
// Import the certificate component
import { CertificateComponent } from "@/lib/certificate-template"

export default function StudentCertificates() {
  const searchParams = useSearchParams()
  const studentId = searchParams.get("id")
  const studentName = "John Doe" // In a real app, this would come from user data
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [viewCertificate, setViewCertificate] = useState<Certificate | null>(null)

  const { certificates } = useCertificateStore()

  // Filter certificates for this student
  const studentCertificates = certificates.filter((cert) => cert.student.toLowerCase() === studentName.toLowerCase())

  // Apply search and type filters
  const filteredCertificates = certificates.filter((cert) => {
    // Filter certificates for this student by name and register number
    const isForCurrentStudent =
      cert.student.toLowerCase() === studentName.toLowerCase() ||
      (studentId && cert.registerNumber.toLowerCase() === studentId.toLowerCase())

    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuedBy.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || cert.type.toLowerCase() === typeFilter.toLowerCase()

    return isForCurrentStudent && matchesSearch && matchesType
  })
  // Update the handleViewCertificate function to set the initial date (around line 60-70)
  const handleViewCertificate = (certificate: Certificate) => {
    setViewCertificate(certificate)
  }

  // Find the handleDownloadCertificate function and replace it with this optimized version
  const handleDownloadCertificate = async (certificate: Certificate) => {
    try {
      // Create a temporary div to render the certificate with exact positioning
      const tempDiv = document.createElement("div")
      tempDiv.className = "relative w-full h-full bg-white"
      tempDiv.style.width = "1200px"
      tempDiv.style.height = "800px"

      // Render the certificate component to a string
      const ReactDOMServer = (await import("react-dom/server")).default
      const certificateElement = CertificateComponent({ certificate })
      const certificateHtml = ReactDOMServer.renderToStaticMarkup(certificateElement)

      tempDiv.innerHTML = certificateHtml
      document.body.appendChild(tempDiv)

      // Use html2canvas with optimized settings
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(tempDiv, {
        scale: 1.5, // Reduced from 2 to 1.5 for better file size
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        imageTimeout: 0, // No timeout for image loading
        allowTaint: true, // Allow tainted canvas if needed
      })

      // Generate optimized PDF
      const jsPDF = (await import("jspdf")).default
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true, // Enable PDF compression
      })

      // Optimize the image quality/compression
      const imgData = canvas.toDataURL("image/jpeg", 0.85) // Use JPEG with 85% quality instead of PNG

      pdf.addImage(imgData, "JPEG", 0, 0, 297, 210, undefined, "FAST") // Use FAST compression

      // Apply additional PDF compression
      pdf.setProperties({
        title: `Certificate for ${certificate.student} (${certificate.registerNumber})`,
        subject: certificate.title,
        creator: "Sathyabama Institute Portal",
        keywords: "certificate, achievement",
        compressed: true,
      })

      pdf.save(`certificate-${certificate.student.replace(/\s+/g, "-")}-${certificate.registerNumber}.pdf`)

      // Clean up
      document.body.removeChild(tempDiv)

      console.log(`Downloaded certificate for ${certificate.student} (${certificate.registerNumber})`)
    } catch (error) {
      console.error("Error generating certificate PDF:", error)
      alert(`Failed to download certificate. Please try again.`)
    }
  }

  return (
    <SharedLayout userType="student">
      <main className="flex-1 p-4 sm:p-6 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold">My Certificates</h2>
            <p className="text-muted-foreground">View and download your certificates</p>
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
                placeholder="Search certificates..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="course completion">Course Completion</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="participation">Participation</SelectItem>
                <SelectItem value="award">Award</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Certificates List */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {filteredCertificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="bg-white rounded-lg border p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{certificate.student}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <span className="text-gray-500 font-medium">Type:</span> {certificate.type}
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="text-gray-500 font-medium">Register Number:</span> {certificate.registerNumber}
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="text-gray-500 font-medium">Date:</span> {certificate.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 self-start sm:self-center mt-2 sm:mt-0">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleViewCertificate(certificate)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </motion.div>
                    {/* Update the certificate card download button to pass the certificate object */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full bg-[#800000] hover:bg-[#600000]"
                        onClick={() => handleDownloadCertificate(certificate)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredCertificates.length === 0 && (
              <div className="bg-white rounded-lg border p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <h3 className="text-lg font-medium">No certificates found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Update the View Certificate Dialog to match the certificate generator preview - keeping this part unchanged as requested */}
      {viewCertificate && (
        <Dialog open={!!viewCertificate} onOpenChange={() => setViewCertificate(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{viewCertificate.title}</DialogTitle>
              <DialogDescription>
                Issued on {viewCertificate.date} | Register Number: {viewCertificate.registerNumber}
              </DialogDescription>
            </DialogHeader>

            <div
              className="bg-white border rounded-lg overflow-hidden relative"
              style={{ width: "100%", height: "500px" }}
            >
              {/* Template background */}
              <img
                src={viewCertificate.templateUrl || "/placeholder.svg?height=800&width=1200&text=Certificate+Template"}
                alt="Certificate Template"
                className="w-full h-full object-contain"
              />

              {/* Certificate content with exact positioning to match the generator preview */}
              <div className="absolute inset-0">
                <input
                  type="text"
                  value={viewCertificate.student}
                  disabled
                  className="absolute top-[220px] left-[52px] w-[84%] max-w-[600px] text-center bg-transparent border-none"
                  style={{
                    fontFamily: viewCertificate.nameFont || "Arial",
                    fontSize: `${viewCertificate.nameSize || 24}px`,
                    color: viewCertificate.nameColor || "#000000",
                    fontWeight: "bold",
                  }}
                />

                <textarea
                  value={viewCertificate.content}
                  disabled
                  className="absolute top-[260px] left-[50px] w-[84%] max-w-[600px] text-center bg-transparent border-none resize-none overflow-hidden min-h-[61px]"
                  style={{
                    fontFamily: viewCertificate.descFont || "Arial",
                    fontSize: `${viewCertificate.descSize || 18}px`,
                    color: viewCertificate.descColor || "#000000",
                    fontWeight: "bold",
                  }}
                />

                <input
                  type="text"
                  value={`Reg. No: ${viewCertificate.registerNumber}`}
                  disabled
                  className="absolute top-[250px] left-[52px] w-[84%] max-w-[600px] text-center bg-transparent border-none"
                  style={{
                    fontFamily: viewCertificate.descFont || "Arial",
                    fontSize: `${(viewCertificate.descSize || 18) * 0.7}px`,
                    color: viewCertificate.descColor || "#000000",
                  }}
                />

                <input
                  type="text"
                  value={`Issued on: ${new Date(viewCertificate.date).toLocaleDateString("en-GB")}`}
                  disabled
                  className="absolute bottom-[50px] left-0 w-full text-center bg-transparent border-none"
                  style={{
                    fontFamily: "Arial",
                    fontSize: "14px",
                    color: "#555555",
                  }}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="default"
                className="bg-[#800000] hover:bg-[#600000]"
                onClick={() => handleDownloadCertificate(viewCertificate)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </SharedLayout>
  )
}

