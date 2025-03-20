"use client"

import type React from "react"

import { SharedLayout } from "@/components/shared-layout"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { motion } from "framer-motion"
// Update the imports to include Trash icon and add useState for the issue all dialog
import { CalendarIcon, Download, Eye, FileText, Plus, Search, Send, Trash } from "lucide-react"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
// Add these imports for the issue all dialog
import { Label } from "@/components/ui/label"
// Import the certificate store
import { useCertificateStore, type Certificate } from "@/lib/certificate-store"
// Import the certificate template generator and component
import { TemplateManager } from "@/components/template-manager"
import { CertificateComponent } from "@/lib/certificate-template"
// Update the imports to include Trash icon and add useState for the issue all dialog
import { useRef, useState } from "react"

// Dynamically import the certificate generator to avoid SSR issues with html2canvas and jsPDF
const CertificateGenerator = dynamic(() => import("@/components/certificate-generator"), { ssr: false })

// Certificate templates
const certificateTemplates = [
  "https://i.imgur.com/idG3CLO.png",
  "https://i.imgur.com/RFeCLoi.png",
  "https://i.imgur.com/XmfD44T.png",
  "https://i.imgur.com/oTYOlAM.png",
]

export default function FacultyCertificates() {
  const searchParams = useSearchParams()
  const facultyId = searchParams.get("id")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showNewCertificate, setShowNewCertificate] = useState(false)
  const [viewCertificate, setViewCertificate] = useState<Certificate | null>(null)
  const [statusFilter, setStatusFilter] = useState("all") // Added state for status filter
  const [showAdvancedGenerator, setShowAdvancedGenerator] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [index, setIndex] = useState(0)
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([certificateTemplates[0]])
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>(certificateTemplates[0])
  const signatureInputRef = useRef<HTMLInputElement>(null)
  const [issuingCertificate, setIssuingCertificate] = useState(false)
  const [issueSuccess, setIssueSuccess] = useState<string | null>(null)
  // Add these state variables after the existing state declarations (around line 50-60)
  const [showIssueAllDialog, setShowIssueAllDialog] = useState(false)
  const [targetRegisterNumber, setTargetRegisterNumber] = useState("")
  const [issuingAll, setIssuingAll] = useState(false)
  const [issueAllSuccess, setIssueAllSuccess] = useState<string | null>(null)

  // Add the deleteCertificate function to the certificate store destructuring
  const { certificates, addCertificate, deleteCertificate } = useCertificateStore()

  // Add state variables to track form input values for the preview
  const [previewStudentName, setPreviewStudentName] = useState("Student Name")
  const [previewContent, setPreviewContent] = useState("Certificate content will appear here")

  // Filter certificates
  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.registerNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || cert.type.toLowerCase() === typeFilter.toLowerCase()

    return matchesSearch && matchesType
  })

  const handleAddTemplate = (newTemplate: string) => {
    setSelectedTemplates([...selectedTemplates, newTemplate])
  }
  // Update the handleViewCertificate function to set the initial date (around line 60-70)
  const handleViewCertificate = (certificate: Certificate) => {
    setViewCertificate(certificate)
  }
  const handleSelectTemplate = (template: string) => {
    // Check if the template is already in certificateTemplates
    const templateIndex = certificateTemplates.indexOf(template)

    if (templateIndex >= 0) {
      // If it's in the original array, just set the index
      setIndex(templateIndex)
    } else {
      // If it's a custom template, we need to add it to the array
      // and set the index to the new position
      const newTemplates = [...certificateTemplates]
      if (!newTemplates.includes(template)) {
        newTemplates.push(template)
        // Update the certificate templates array
        // Note: In a real app, you might want to store this in state
        // Here we're just updating the reference for simplicity
        Object.assign(certificateTemplates, newTemplates)
        setIndex(newTemplates.length - 1)
      }
    }
  }

  const handleRemoveTemplate = (index: number) => {
    setSelectedTemplates(selectedTemplates.filter((_, i) => i !== index))
  }

  const handleIssueCertificate = () => {
    setShowNewCertificate(true)
  }

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSignatureFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setSignaturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Update the handleNewCertificateSubmit function to properly include register number
  const handleNewCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const newCertificate: Certificate = {
      id: `cert-${(certificates.length + 1).toString().padStart(3, "0")}`,
      title: formData.get("title") as string,
      type: formData.get("type") as string,
      issuedBy: "Prof. Sarah Johnson", // Current faculty
      registerNumber: formData.get("registerNumber") as string, // Ensure register number is included
      date: selectedDate.toISOString().split("T")[0],
      student: formData.get("student") as string,
      content: formData.get("content") as string,
      templateUrl: selectedTemplate, // Use selected template
    }

    addCertificate(newCertificate)
    setShowNewCertificate(false)

    // Reset form state
    setSelectedDate(new Date())
    setSelectedTemplate(certificateTemplates[0])
  }
  // Update the handleAdvancedCertificateGenerated function to properly include register number
  const handleAdvancedCertificateGenerated = (data: any) => {
    const newCertificate: Certificate = {
      id: `cert-${(certificates.length + 1).toString().padStart(3, "0")}`,
      title: data.description || "Certificate of Achievement",
      type: data.description?.includes("Completion") ? "Course Completion" : "Achievement",
      issuedBy: "Prof. Sarah Johnson", // Current faculty
      registerNumber: data.registerNumber || "STU" + Date.now().toString().slice(-6), // Ensure register number is included
      date: data.date || new Date().toISOString().split("T")[0],
      student: data.name,
      content: data.description || "Certificate of Achievement",
      templateUrl: data.templateUrl || "/placeholder.svg?height=800&width=1200&text=Certificate+Template",
      // Include font styling properties
      nameFont: data.nameFont,
      nameSize: data.nameSize,
      nameColor: data.nameColor,
      descFont: data.descFont,
      descSize: data.descSize,
      descColor: data.descColor,
    }

    addCertificate(newCertificate)
    console.log(
      `Certificate issued for ${data.name} with register number ${data.registerNumber} and added to the certificates list`,
    )
  }

  // Add a function to handle issuing a certificate to a student
  const handleIssueToCertificate = async (certificate: Certificate) => {
    setIssuingCertificate(true)

    try {
      // In a real application, this would make an API call to issue the certificate
      // For this demo, we'll simulate a delay and then show a success message
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIssueSuccess(`Certificate successfully issued to ${certificate.student} (${certificate.registerNumber})`)

      // Clear the success message after 3 seconds
      setTimeout(() => {
        setIssueSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Error issuing certificate:", error)
    } finally {
      setIssuingCertificate(false)
    }
  }

  // Updated handleDownloadCertificate function to use the React component
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
        title: `Certificate for ${certificate.student}`,
        subject: certificate.title,
        creator: "Sathyabama Institute Portal",
        keywords: "certificate, achievement",
        compressed: true,
      })

      pdf.save(`certificate-${certificate.student.replace(/\s+/g, "-")}.pdf`)

      // Clean up
      document.body.removeChild(tempDiv)

      console.log(`Downloaded certificate for ${certificate.student}`)
    } catch (error) {
      console.error("Error generating certificate PDF:", error)
      alert(`Failed to download certificate. Please try again.`)
    }
  }

  // Add the handleDeleteCertificate function after the handleDownloadCertificate function
  const handleDeleteCertificate = (certificate: Certificate) => {
    // Delete the certificate directly without confirmation
      deleteCertificate(certificate.id)
      console.log(`Deleted certificate for ${certificate.student}`)
  }

  // Add the handleIssueAllCertificates function
  const handleIssueAllCertificates = async () => {
    setIssuingAll(true)

    try {
      // Get all certificates from the filtered list
      const certificatesToIssue = filteredCertificates

      if (certificatesToIssue.length === 0) {
        alert("No certificates found to issue")
        setIssuingAll(false)
        return
      }

      // Issue all certificates one by one
      for (const certificate of certificatesToIssue) {
        // Simulate API call to issue certificate
        await new Promise((resolve) => setTimeout(resolve, 300))
        console.log(`Issued certificate ${certificate.id} to ${certificate.student}`)
      }

      setIssueAllSuccess(`Successfully issued ${certificatesToIssue.length} certificates`)

      // Clear success message after 3 seconds
      setTimeout(() => {
        setIssueAllSuccess(null)
      }, 3000)

      setShowIssueAllDialog(false)
    } catch (error) {
      console.error("Error issuing all certificates:", error)
      alert("Failed to issue all certificates. Please try again.")
    } finally {
      setIssuingAll(false)
    }
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
            <h2 className="text-2xl font-bold">Certificate Portal</h2>
            <p className="text-muted-foreground">Issue and manage certificates for students</p>
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
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
              <div className="flex gap-2 w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-auto">
                  <Button
                    className="bg-[#800000] hover:bg-[#600000] text-white w-full"
                    onClick={handleIssueCertificate}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Issue Certificate
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-auto">
                  <Button
                    className="bg-[#800000] hover:bg-[#600000] text-white w-full"
                    onClick={() => window.open(`/certificates/faculty/advanced?id=${facultyId}`, "_blank")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Advanced
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1 sm:flex-auto">
                  <Button
                    className="bg-[#800000] hover:bg-[#600000] text-white w-full"
                    onClick={handleIssueAllCertificates}
                    disabled={issuingAll}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {issuingAll ? "Issuing..." : "Issue All"}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Success message */}
          {issueSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{issueSuccess}</span>
            </div>
          )}

          {/* Issue All Success message */}
          {issueAllSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{issueAllSuccess}</span>
            </div>
          )}

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
                      <p className="flex items-center gap-1">
                        <span className="text-gray-500 font-medium">Title:</span> {certificate.title}
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
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-[#800000] text-[#800000] hover:bg-[#800000]/10"
                        onClick={() => handleIssueToCertificate(certificate)}
                        disabled={issuingCertificate}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Issue
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                        onClick={() => handleDeleteCertificate(certificate)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
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

      {/* View Certificate Dialog - Keeping this part unchanged as requested */}
      {viewCertificate && (
        <Dialog open={!!viewCertificate} onOpenChange={() => setViewCertificate(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{viewCertificate.title}</DialogTitle>
              <DialogDescription>
                Issued to {viewCertificate.student} on {viewCertificate.date} | Register Number:{" "}
                {viewCertificate.registerNumber}
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

              {/* Certificate content with exact positioning and font styling */}
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
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button
                variant="outline"
                className="border-[#800000] text-[#800000] hover:bg-[#800000]/10"
                onClick={() => {
                  handleIssueToCertificate(viewCertificate)
                  setViewCertificate(null)
                }}
                disabled={issuingCertificate}
              >
                <Send className="h-4 w-4 mr-2" />
                Issue Certificate
              </Button>
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

      {/* New Certificate Dialog */}
      <Dialog open={showNewCertificate} onOpenChange={setShowNewCertificate}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Issue New Certificate</DialogTitle>
            <DialogDescription>Create a new certificate for a student</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleNewCertificateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Certificate Title
                </label>
                <Input id="title" name="title" placeholder="e.g. Web Development Course Completion" required />
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Certificate Type
                </label>
                <Select name="type" defaultValue="Course Completion">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Course Completion">Course Completion</SelectItem>
                    <SelectItem value="Achievement">Achievement</SelectItem>
                    <SelectItem value="Participation">Participation</SelectItem>
                    <SelectItem value="Award">Award</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="student" className="text-sm font-medium">
                  Student Name
                </label>
                <Input
                  id="student"
                  name="student"
                  placeholder="Student's full name"
                  required
                  onChange={(e) => setPreviewStudentName(e.target.value || "Student Name")}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="registerNumber" className="text-sm font-medium">
                  Register Number
                </label>
                <Input id="registerNumber" name="registerNumber" placeholder="e.g. STU2024001" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Issue Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Certificate Content
              </label>
              <textarea
                id="content"
                name="content"
                placeholder="Enter the certificate text content"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                onChange={(e) => setPreviewContent(e.target.value || "Certificate content will appear here")}
              ></textarea>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Certificate Template</label>
                <TemplateManager
                  templates={selectedTemplates}
                  onAddTemplate={handleAddTemplate}
                  onRemoveTemplate={handleRemoveTemplate}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selectedTemplates.map((template, i) => (
                  <div
                    key={i}
                    className={`border rounded-md overflow-
                    className={\`border rounded-md overflow-hidden cursor-pointer transition-all ${
                      selectedTemplate === template ? "ring-2 ring-primary" : "hover:border-primary"
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <img
                      src={template || "/placeholder.svg"}
                      alt={`Template ${i + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNewCertificate(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#800000] hover:bg-[#600000]">
                Issue Certificate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Issue All Certificates Dialog */}
      <Dialog open={showIssueAllDialog} onOpenChange={setShowIssueAllDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Issue All Certificates</DialogTitle>
            <DialogDescription>
              Issue all certificates to a student with the specified register number
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleIssueAllCertificates} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="registerNumber">Register Number</Label>
              <Input
                id="registerNumber"
                placeholder="Enter student's register number"
                value={targetRegisterNumber}
                onChange={(e) => setTargetRegisterNumber(e.target.value)}
                required
              />
              <p className="text-sm text-muted-foreground">
                All certificates matching this register number will be issued to the student
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowIssueAllDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#800000] hover:bg-[#600000]" disabled={issuingAll}>
                {issuingAll ? "Issuing..." : "Issue All Certificates"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SharedLayout>
  )
}

