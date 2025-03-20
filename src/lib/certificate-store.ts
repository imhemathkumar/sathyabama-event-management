import { create } from "zustand"

// Certificate store
export interface Certificate {
  id: string
  title: string
  type: string
  issuedBy: string
  date: string
  student: string
  content?: string
  templateUrl?: string
  signatureUrl?: string // Make signature optional
  registerNumber: string // Add register number field
  // Add font styling properties
  nameFont?: string
  nameSize?: number
  nameColor?: string
  descFont?: string
  descSize?: number
  descColor?: string
  dateFont?: string
  dateSize?: number
  dateColor?: string
  signatureSize?: number
}

// Update the CertificateStore interface to include the deleteCertificate function
interface CertificateStore {
  certificates: Certificate[]
  addCertificate: (certificate: Certificate) => void
  deleteCertificate: (id: string) => void
}

// Update the store implementation to include the deleteCertificate function
export const useCertificateStore = create<CertificateStore>((set) => ({
  certificates: [],
  addCertificate: (certificate) =>
    set((state) => ({
      certificates: [...state.certificates, certificate],
    })),
  deleteCertificate: (id) =>
    set((state) => ({
      certificates: state.certificates.filter((cert) => cert.id !== id),
    })),
}))

