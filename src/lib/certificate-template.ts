import type { Certificate } from "@/lib/certificate-store"
import React from "react"

/**
 * Creates a React component for certificate rendering
 * @param certificate The certificate data to render
 * @returns React element for the certificate
 */
export function CertificateComponent({ certificate }: { certificate: Certificate }) {
  return React.createElement(
    "div",
    {
      className: "relative w-full h-full bg-white",
    },
    // Background template image
    React.createElement("img", {
      src: certificate.templateUrl ?? "/placeholder.svg?height=800&width=1200&text=Certificate+Template",
      className: "w-full h-full object-cover",
      crossOrigin: "anonymous",
      key: "template-img",
    }),

    // Student Name
    React.createElement(
      "div",
      {
        className: "absolute top-[35%] left-0 w-full text-center",
        key: "student-container",
      },
      React.createElement(
        "div",
        {
          className: "font-bold",
          style: {
            fontFamily: certificate.nameFont || "Arial",
            fontSize: `${certificate.nameSize || 24}px`,
            color: certificate.nameColor || "#000000",
          },
          key: "student-name",
        },
        certificate.student,
      ),
      // Add register number below student name
      
    ),

    // Certificate Content (Description)
    React.createElement(
      "div",
      {
        className: "absolute top-[45%] left-0 w-full text-center px-[100px]",
        key: "content-text-container",
      },
      React.createElement(
        "div",
        {
          className: "leading-relaxed max-w-[800px] mx-auto",
          style: {
            fontFamily: certificate.descFont || "Arial",
            fontSize: `${certificate.descSize || 18}px`,
            color: certificate.descColor || "#000000",
          },
          key: "content-text",
        },
        certificate.content,
      ),
    ),

    
  )
}

