"use client"

import type React from "react"

declare global {
  interface Window {
    ethereum: any
  }
}

import { fontFamilies } from "@/components/fontFamilies"
import { ModalComponent } from "@/components/modal-component"
import { TemplateManager } from "@/components/template-manager"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { downloadSampleCSV, parseCSV, type BulkCertificate } from "@/lib/csv-parser"
import { uploadFileToIPFS, uploadJSONToIPFS } from "@/lib/pinata"
import domToImage from "dom-to-image"
import { Download, FileText, Type, Upload } from "lucide-react"
import moment from "moment"
import { useRef, useState } from "react"

// Mock ABI - replace with your actual ABI
const Marketplace = {
  address: "0x0000000000000000000000000000000000000000",
  abi: [],
}

const certificateTemplates = [
  "https://i.imgur.com/idG3CLO.png",
  "https://i.imgur.com/RFeCLoi.png",
  "https://i.imgur.com/XmfD44T.png",
  "https://i.imgur.com/oTYOlAM.png",
]

// Add font size options
const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72]

// Add color options
const colorOptions = [
  { name: "Black", value: "#000000" },
  { name: "Dark Gray", value: "#333333" },
  { name: "Navy Blue", value: "#000080" },
  { name: "Dark Red", value: "#800000" },
  { name: "Dark Green", value: "#006400" },
  { name: "Purple", value: "#800080" },
  { name: "Gold", value: "#FFD700" },
  { name: "Brown", value: "#8B4513" },
]

interface CertificateGeneratorProps {
  onCertificateGenerated?: (data: any) => void
}

export default function CertificateGenerator(props: Readonly<CertificateGeneratorProps>) {
  const [modalOpen, setModalOpen] = useState(false)
  const [registerNumber, setRegisterNumber] = useState("")
  const [addressSaved, setAddressSaved] = useState(false)
  const [receiverName, setReceiverName] = useState("")
  const [receiverDes, setReceiverDes] = useState("")
  const [sign, setSign] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [message, updateMessage] = useState("")
  const [index, setIndex] = useState(0)
  const [certificateDate, setCertificateDate] = useState(moment().format("DD/MM/YYYY"))

  // Add font styling state
  const [nameFont, setNameFont] = useState("Arial")
  const [nameSize, setNameSize] = useState(24)
  const [nameColor, setNameColor] = useState("#000000")

  const [descFont, setDescFont] = useState("Arial")
  const [descSize, setDescSize] = useState(18)
  const [descColor, setDescColor] = useState("#000000")

  const [dateFont, setDateFont] = useState("Arial")
  const [dateSize, setDateSize] = useState(16)
  const [dateColor, setDateColor] = useState("#000000")

  // Show font controls
  const [showFontControls, setShowFontControls] = useState(false)

  const [bulkCertificates, setBulkCertificates] = useState<BulkCertificate[]>([])
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([certificateTemplates[0]])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Add signature size state
  const [signatureSize, setSignatureSize] = useState(50)

  const handleChangeSign = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSign(URL.createObjectURL(e.target.files[0]))
    }
  }

  async function dataUrlToFile(url: string, filename = "certificate.jpg", quality = 0.85) {
    // Extract the base64 data
    const base64Data = url.split(",")[1]

    // Convert to blob with compression
    const mimeType = "image/jpeg" // Use JPEG for better compression

    // Create a canvas to compress the image
    const img = new Image()
    img.src = url
    await new Promise((resolve) => (img.onload = resolve))

    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height

    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Could not get canvas context")

    ctx.drawImage(img, 0, 0)

    // Get compressed data URL
    const compressedDataUrl = canvas.toDataURL(mimeType, quality)

    // Convert to blob
    const byteString = atob(compressedDataUrl.split(",")[1])
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    const blob = new Blob([ab], { type: mimeType })
    return new File([blob], filename, { type: mimeType })
  }

  // Update the uploadMeta function to include register number
  const uploadMeta = async (fileUrl: string) => {
    if (!fileUrl) {
      updateMessage("Please try again")
      console.log("name or fileURL not set", receiverName, fileUrl)
      return
    }

    const name = receiverName || "SAMPLE"
    const nftJson = {
      name: name,
      image: fileUrl,
      register_number: registerNumber || "SAMPLE",
    }

    try {
      updateMessage("Uploading JSON to IPFS")
      const response = await uploadJSONToIPFS(nftJson)
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata", response)
        return response.pinataURL
      }
    } catch (e) {
      updateMessage("Error uploading JSON metadata")
      alert("Error uploading JSON metadata: " + e)
    }
  }

  // Update the uploadImage function to include register number in certificate data
  async function uploadImage(e: React.FormEvent) {
    e.preventDefault()

    try {
      const certificateElement = document.getElementById("certificate-image")
      if (!certificateElement) return

      updateMessage("Generating certificate image")
      const dataUrl = await domToImage.toJpeg(certificateElement, {
        quality: 0.85, // Compress to 85% quality
        bgcolor: "#ffffff",
      })

      // Use the optimized function
      const img = await dataUrlToFile(dataUrl, "certificate.jpg", 0.85)

      updateMessage("Uploading image. Please wait...")
      const uploadResponse = await uploadFileToIPFS(img)

      if (uploadResponse && uploadResponse.success) {
        updateMessage("Uploaded image successfully")
        setFileUrl(uploadResponse.pinataURL)

        // Prepare certificate data for callback with fixed date and no signature
        const certificateData = {
          name: receiverName || "",
          description: receiverDes || "",
          date: moment().format("YYYY-MM-DD"), // Use current date
          templateUrl:
            certificateTemplates[index] || "/placeholder.svg?height=800&width=1200&text=Certificate+Template",
          registerNumber: registerNumber || "", // Ensure register number is included
          // Include font styling
          nameFont,
          nameSize,
          nameColor,
          descFont,
          descSize,
          descColor,
        }

        // Call the onCertificateGenerated callback with the certificate data
        if (props.onCertificateGenerated) {
          props.onCertificateGenerated(certificateData)
        }

        const metadataURL = await uploadMeta(uploadResponse.pinataURL)
        if (!metadataURL) {
          throw new Error("Failed to upload metadata")
        }

        // Don't show an alert, just update the message
        updateMessage("Certificate generated successfully")
        setModalOpen(false)
      } else {
        throw new Error("Failed to upload image")
      }
    } catch (error) {
      console.error("Error in certificate creation:", error)
      updateMessage("Please try again")
      console.error(`Upload error: ${error}`)
    }
  }

  // Update the handleAddTemplate function to properly add and preview templates
  const [selectedTemplate, setSelectedTemplate] = useState<string>(certificateTemplates[0])

  const handleAddTemplate = (newTemplate: string) => {
    // Add the template to the selected templates
    setSelectedTemplates([...selectedTemplates, newTemplate])

    // Also add it to the certificateTemplates array if it's not already there
    if (!certificateTemplates.includes(newTemplate)) {
      certificateTemplates.push(newTemplate)
    }

    // Set the selected template to the new one
    setSelectedTemplate(newTemplate)

    // Update the index to show the new template
    setIndex(certificateTemplates.length - 1)
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

  const handleUploadCSV = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string
        const newCertificates = parseCSV(csvData)

        setBulkCertificates(newCertificates)
        updateMessage(`Loaded ${newCertificates.length} certificates from CSV`)
      } catch (error) {
        console.error("Error parsing CSV:", error)
        updateMessage("Error parsing CSV file")
      }
    }

    reader.readAsText(file)
  }

  const handleDownloadSampleCSV = () => {
    downloadSampleCSV()
  }

  // Update the generateSingleCertificate function to include register number
  const generateSingleCertificate = async (certificate: any) => {
    try {
      // Set the form values to the certificate data
      setReceiverName(certificate.name || "")
      setRegisterNumber(certificate.register_number || "")
      setReceiverDes(certificate.description || "")

      // Wait a moment for the DOM to update
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Generate and upload the certificate
      const certificateElement = document.getElementById("certificate-image")
      if (!certificateElement) return

      updateMessage(`Generating certificate for ${certificate.name}...`)
      const dataUrl = await domToImage.toJpeg(certificateElement)
      const img = await dataUrlToFile(dataUrl)

      updateMessage(`Uploading certificate for ${certificate.name}...`)
      const uploadResponse = await uploadFileToIPFS(img)

      if (uploadResponse && uploadResponse.success) {
        // Prepare certificate data for callback with fixed date and no signature
        const certificateData = {
          name: certificate.name || "",
          description: certificate.description || "",
          date: moment().format("YYYY-MM-DD"), // Use current date
          templateUrl:
            certificateTemplates[index] || "/placeholder.svg?height=800&width=1200&text=Certificate+Template",
          registerNumber: certificate.register_number || "", // Ensure register number is included
          // Include font styling
          nameFont,
          nameSize,
          nameColor,
          descFont,
          descSize,
          descColor,
        }

        // Call the onCertificateGenerated callback with the certificate data
        if (props.onCertificateGenerated) {
          props.onCertificateGenerated(certificateData)
        }

        updateMessage(`Certificate for ${certificate.name} created successfully`)
        return true
      }
      return false
    } catch (error) {
      console.error(`Error generating certificate for ${certificate.name}:`, error)
      updateMessage(`Error generating certificate for ${certificate.name}`)
      return false
    }
  }

  // Update the generateAllCertificates function to not show alerts for each certificate
  const generateAllCertificates = async () => {
    updateMessage(`Generating ${bulkCertificates.length} certificates...`)
    let successCount = 0

    for (const certificate of bulkCertificates) {
      const success = await generateSingleCertificate(certificate)
      if (success) successCount++
    }

    updateMessage(`Generated ${successCount} of ${bulkCertificates.length} certificates successfully`)
  }

  return (
    <>
      <div className="flex flex-col gap-8 w-full h-full bg-background rounded-lg p-4">
        <div className="flex items-end justify-between gap-2">
          <h1 className="text-3xl font-bold">Issue a new certificate</h1>
          <Button
            onClick={() => setShowFontControls(!showFontControls)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Type className="h-4 w-4" />
            {showFontControls ? "Hide Font Controls" : "Show Font Controls"}
          </Button>
        </div>

        <div className="flex gap-8 w-full">
          {/* Form Section */}
          <div className="flex flex-col gap-4 w-full md:w-1/3 p-4 bg-card rounded-lg shadow">
            <h2 className="text-xl font-semibold">Enter Details</h2>

            <div className="flex gap-4">
              <Input
                placeholder="Enter student's register number"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                type={addressSaved ? "password" : "text"}
                disabled={addressSaved}
                className="flex-1"
              />
              <Button onClick={() => setAddressSaved((prev) => !prev)}>{addressSaved ? "Update" : "Save"}</Button>
            </div>

            <Input
              placeholder="Receiver's name"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
            />

            <Textarea
              placeholder="Description"
              value={receiverDes}
              onChange={(e) => setReceiverDes(e.target.value)}
              rows={5}
              className="resize-none"
            />

            <Button onClick={() => setModalOpen(true)}>Submit</Button>

            {message && <div className="mt-2 p-2 bg-muted rounded text-center">{message}</div>}
          </div>

          {/* Certificate Preview */}
          <div className="flex-1 bg-card rounded-lg shadow p-4 flex justify-center">
            <div id="certificate-image" className="relative">
              <img
                src={certificateTemplates[index] || "/placeholder.svg"}
                alt="Certificate Template"
                className="w-[700px] h-[500px] object-contain"
              />

              <input
                type="text"
                value={receiverName}
                disabled
                className="absolute top-[220px] left-[52px] w-[84%] max-w-[600px] text-center bg-transparent border-none"
                style={{
                  fontFamily: nameFont,
                  fontSize: `${nameSize}px`,
                  color: nameColor,
                  fontWeight: "bold",
                }}
              />

              <textarea
                value={receiverDes}
                disabled
                className="absolute top-[260px] left-[50px] w-[84%] max-w-[600px] text-center bg-transparent border-none resize-none overflow-hidden min-h-[61px]"
                style={{
                  fontFamily: descFont,
                  fontSize: `${descSize}px`,
                  color: descColor,
                  fontWeight: "bold",
                }}
              />
            </div>
          </div>
        </div>

        {/* Font Controls Section */}
        {showFontControls && (
          <div className="w-full bg-card rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Font Styling</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Name Font Controls */}
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="font-medium text-lg">Name Styling</h3>

                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select value={nameFont} onValueChange={setNameFont}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size: {nameSize}px</Label>
                  <Input
                    type="number"
                    value={nameSize}
                    onChange={(e) => setNameSize(Number(e.target.value))}
                    min="8"
                    max="72"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Font Color</Label>
                  <div className="flex gap-2">
                    <Select value={nameColor} onValueChange={setNameColor}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }}></div>
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="color"
                      value={nameColor}
                      onChange={(e) => setNameColor(e.target.value)}
                      className="w-10 p-0 h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Description Font Controls */}
              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="font-medium text-lg">Description Styling</h3>

                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select value={descFont} onValueChange={setDescFont}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontFamilies.map((font) => (
                        <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Size: {descSize}px</Label>
                  <Input
                    type="number"
                    value={descSize}
                    onChange={(e) => setDescSize(Number(e.target.value))}
                    min="8"
                    max="72"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Font Color</Label>
                  <div className="flex gap-2">
                    <Select value={descColor} onValueChange={setDescColor}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }}></div>
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="color"
                      value={descColor}
                      onChange={(e) => setDescColor(e.target.value)}
                      className="w-10 p-0 h-10"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Templates Section */}
        <div className="w-full bg-card rounded-lg shadow p-4">
          <div className="text-center mb-16">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Available Templates</h2>
              <TemplateManager
                templates={selectedTemplates}
                onAddTemplate={handleAddTemplate}
                onRemoveTemplate={handleRemoveTemplate}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-evenly">
            {certificateTemplates.map((template, i) => (
              <Card key={i} className="bg-muted max-w-[300px]">
                <div className="p-2">
                  <img
                    src={template || "/placeholder.svg"}
                    alt={`Certificate ${i + 1}`}
                    className="w-[300px] object-contain"
                  />
                </div>

                <CardContent className="p-2 text-center">
                  <p className="text-muted-foreground">{`Certificate ${i + 1}`}</p>
                </CardContent>

                <CardFooter className="p-2">
                  <Button size="sm" variant="default" className="w-full" onClick={() => setIndex(i)}>
                    Choose
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Certificates Section */}
      <div className="w-full bg-card rounded-lg shadow p-4 mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bulk Certificates</h2>
          <div className="flex gap-2">
            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleCSVUpload} className="hidden" />
            <Button
              variant="outline"
              onClick={handleDownloadSampleCSV}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Download className="mr-2 h-4 w-4" /> Sample CSV
            </Button>
            <Button
              variant="outline"
              onClick={handleUploadCSV}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload New CSV
            </Button>
            <Button
              onClick={generateAllCertificates}
              className="bg-[#800000] hover:bg-[#600000] text-white"
              disabled={bulkCertificates.length === 0}
            >
              Generate All ({bulkCertificates.length})
            </Button>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6 ">
          <h4 className="text-sky-500 font-medium mb-2">CSV File Requirements:</h4>
          <ul className="list-disc pl-5 text-black/70 space-y-1">
            <li>
              The CSV file must contain a column named{" "}
              <span className="font-mono bg-blue-900/30 px-1 rounded">register_number</span> for targeting specific
              students
            </li>
            <li>
              Include columns for <span className="font-mono bg-blue-900/30 px-1 rounded">name</span>,{" "}
              <span className="font-mono bg-blue-900/30 px-1 rounded">description</span>, and other certificate details
            </li>
            <li>Each row represents a single certificate to be generated</li>
          </ul>
        </div>

        {bulkCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bulkCertificates.map((certificate) => (
              <div key={certificate.id} className="border rounded-lg p-4">
                <div className="space-y-2 mb-4">
                  <p>
                    <span className="font-semibold">Name:</span> {certificate.name}
                  </p>
                  <p>
                    <span className="font-semibold">Register Number:</span> {certificate.register_number}
                  </p>
                  <p>
                    <span className="font-semibold">Description:</span> {certificate.description}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span> {certificate.date}
                  </p>
                </div>
                <Button
                  onClick={() => generateSingleCertificate(certificate)}
                  className="w-full bg-[#800000] hover:bg-[#600000] text-white"
                >
                  Generate Certificate
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="mx-auto h-12 w-12 mb-4" />
            <p>No certificates loaded. Upload a CSV file to get started.</p>
          </div>
        )}
      </div>

      <ModalComponent
        open={modalOpen}
        setOpen={setModalOpen}
        finalSubmit={uploadImage}
        message="Are you sure you want to submit?"
      />
    </>
  )
}

