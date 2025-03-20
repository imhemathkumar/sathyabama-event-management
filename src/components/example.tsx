"use client"

import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Award, Calendar, Menu, Users, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useState, type ReactNode } from "react"


interface SharedLayoutProps {
  children: ReactNode
  userType: "faculty" | "student"
}

export function SharedLayout({ children, userType }: Readonly<SharedLayoutProps>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const userId = searchParams.get("id") ?? (userType === "faculty")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname.includes(path)
  }

  const dashboardPath = userType === "faculty" ? "/dashboard/faculty" : "/dashboard/student"
  const certificatesPath = userType === "faculty" ? "/certificates/faculty" : "/certificates/student"
  const onDutyPath = userType === "faculty" ? "/on-duty/faculty" : "/on-duty/student"

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header
        className="bg-[#5e0f0f] text-white p-4 py-8 shadow-md sticky top-0 z-30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ rotate: 10 }} whileTap={{ scale: 0.9 }}>
              <Image src="/logo2.jpg" alt="Institute Logo" width={40} height={40} className="rounded-md bg-white p-1" />
            </motion.div>
            <h1 className="text-xl font-bold hidden sm:block">Sathyabama Institute Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">{userType}</span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/">
                <Button variant="outline" size="sm" className="bg-white text-black  hover:bg-white">
                  Logout
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden text-white hover:bg-[#600000]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <motion.aside
          className="hidden sm:block w-48 bg-[#5e0f0f] text-white"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        >
          <nav className="p-4 space-y-2 sticky top-20">
            <Link
              href={`${dashboardPath}`}
              className={`flex items-center gap-2 p-2 ${isActive(dashboardPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
            >
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link
              href={`${certificatesPath}`}
              className={`flex items-center gap-2 p-2 ${isActive(certificatesPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
            >
              <Award className="h-5 w-5" />
              <span>Certificates</span>
            </Link>
            <Link
              href={`${onDutyPath}`}
              className={`flex items-center gap-2 p-2 ${isActive(onDutyPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
            >
              <Users className="h-5 w-5" />
              <span>On-Duty</span>
            </Link>
          </nav>
        </motion.aside>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <motion.div
              className="bg-[#800000] text-white w-64 h-full p-4"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-[#600000]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X />
                </Button>
              </div>
              <nav className="space-y-2">
                <Link
                  href={`${dashboardPath}?id=${userId}`}
                  className={`flex items-center gap-2 p-2 ${isActive(dashboardPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Events</span>
                </Link>
                <Link
                  href={`${certificatesPath}?id=${userId}`}
                  className={`flex items-center gap-2 p-2 ${isActive(certificatesPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Award className="h-5 w-5" />
                  <span>Certificates</span>
                </Link>
                <Link
                  href={`${onDutyPath}?id=${userId}`}
                  className={`flex items-center gap-2 p-2 ${isActive(onDutyPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span>On-Duty</span>
                </Link>
              </nav>
            </motion.div>
          </div>
        )}

        {/* Main Content */}
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  )
}

