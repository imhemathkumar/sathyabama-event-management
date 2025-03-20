"use client"
import { SharedLayout } from "@/components/shared-layout"
import { Button } from "@/components/ui/button"
import { useCertificateStore } from "@/lib/certificate-store"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import dynamic from "next/dynamic"
import { useRouter, useSearchParams } from "next/navigation"

// Dynamically import the certificate generator to avoid SSR issues with html2canvas and jsPDF
const CertificateGenerator = dynamic(() => import("@/components/certificate-generator"), { ssr: false })

export default function AdvancedCertificateGenerator() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const facultyId = searchParams.get("id") ?? "42611001"
  const { addCertificate } = useCertificateStore()

  // Update the handleAdvancedCertificateGenerated function to properly handle register numbers
  const handleAdvancedCertificateGenerated = (data: any) => {
    const newCertificate = {
      id: `cert-${Date.now().toString()}`,
      title: data.description || "Certificate of Achievement",
      type: data.description?.includes("Completion") ? "Course Completion" : "Achievement",
      issuedBy: "Prof. Sarah Johnson", // Current faculty
      registerNumber: data.registerNumber || "STU" + Date.now().toString().slice(-6), // Ensure register number is included
      date: data.date || new Date().toISOString().split("T")[0],
      student: data.name,
      content: data.description || "Certificate of Achievement",
      templateUrl: data.templateUrl || "/placeholder.svg?height=800&width=1200&text=Certificate+Template",
      nameFont: data.nameFont,
      nameSize: data.nameSize,
      nameColor: data.nameColor,
      descFont: data.descFont,
      descSize: data.descSize,
      descColor: data.descColor,
    }

    addCertificate(newCertificate)

    // Don't show an alert, just log to console
    console.log(
      `Certificate for ${data.name} (${data.registerNumber}) has been successfully created and added to your certificates list.`,
    )
  }

  return (
    <SharedLayout userType="faculty">
      <main className="flex-1 p-4 sm:p-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="mb-6 flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/certificates/faculty?id=${facultyId}`)}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold">Advanced Certificate Generator</h2>
              <p className="text-muted-foreground">Create customized certificates with advanced options</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CertificateGenerator onCertificateGenerated={handleAdvancedCertificateGenerated} />
          </motion.div>
        </div>
      </main>
    </SharedLayout>
  )
}

