"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth-utils"
import { AnimatePresence, motion } from "framer-motion"
import { Award, Calendar, Menu, Users, X } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState, type ReactNode } from "react"

interface SharedLayoutProps {
  children: ReactNode
  userType: "faculty" | "student"
}

export function SharedLayout({ children, userType }: Readonly<SharedLayoutProps>) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const userId = searchParams.get("id") ?? (userType === "faculty" ? "rdxtcfygvbhinjokml" : "brahman1123")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentPath, setCurrentPath] = useState(pathname)

  const isActive = (path: string) => {
    return pathname.includes(path)
  }

  const dashboardPath = userType === "faculty" ? "/dashboard/faculty" : "/dashboard/student"
  const certificatesPath = userType === "faculty" ? "/certificates/faculty" : "/certificates/student"
  const onDutyPath = userType === "faculty" ? "/on-duty/faculty" : "/on-duty/student"

  // Prefetch all main navigation routes for faster navigation
  useEffect(() => {
    router.prefetch(`${dashboardPath}?id=${userId}`)
    router.prefetch(`${certificatesPath}?id=${userId}`)
    router.prefetch(`${onDutyPath}?id=${userId}`)
  }, [router, dashboardPath, certificatesPath, onDutyPath, userId])

  // Track navigation state changes
  useEffect(() => {
    if (currentPath !== pathname) {
      setIsNavigating(true)

      // Reset navigation state after transition completes
      const timer = setTimeout(() => {
        setIsNavigating(false)
        setCurrentPath(pathname)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [pathname, currentPath])

  // Handle navigation with loading state
  const handleNavigation = (path: string) => {
    if (pathname !== path) {
      setIsNavigating(true)
      setIsMobileMenuOpen(false)
      router.push(`${path}?id=${userId}`)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header
        className="bg-[#5e0f0f] text-white p-4 py-8 shadow-md sticky top-0 z-30"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3 pl-4">
            <motion.div whileHover={{ rotate: 10 }} whileTap={{ scale: 0.9 }}>
              <Image
                src="/logo2.jpg"
                alt="Institute Logo"
                width={40}
                height={40}
                className="rounded-md bg-white p-1"
                priority
              />
            </motion.div>
            <h1 className="text-xl font-bold hidden sm:block">Sathyabama Institute Portal</h1>
          </div>
          <div className="flex items-center gap-4 pr-4">
            <span className="text-sm sm:text-base"></span>
            <span className="hidden sm:inline">{userType}</span>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-black  hover:bg-white"
                onClick={handleLogout}
              >
                Logout
              </Button>
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
          className="hidden sm:block w-48 bg-[#800000] text-white"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        >
          <nav className="p-4 space-y-2 sticky top-20">
            <button
              onClick={() => handleNavigation(dashboardPath)}
              className={`flex w-full items-center gap-2 p-2 ${isActive(dashboardPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
            >
              <Calendar className="h-5 w-5" />
              <span>Events</span>
            </button>
            <button
              onClick={() => handleNavigation(certificatesPath)}
              className={`flex w-full items-center gap-2 p-2 ${isActive(certificatesPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
            >
              <Award className="h-5 w-5" />
              <span>Certificates</span>
            </button>
            <button
              onClick={() => handleNavigation(onDutyPath)}
              className={`flex w-full items-center gap-2 p-2 ${isActive(onDutyPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
            >
              <Users className="h-5 w-5" />
              <span>On-Duty</span>
            </button>
          </nav>
        </motion.aside>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
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
                  <button
                    onClick={() => handleNavigation(dashboardPath)}
                    className={`flex w-full items-center gap-2 p-2 ${isActive(dashboardPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Events</span>
                  </button>
                  <button
                    onClick={() => handleNavigation(certificatesPath)}
                    className={`flex w-full items-center gap-2 p-2 ${isActive(certificatesPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
                  >
                    <Award className="h-5 w-5" />
                    <span>Certificates</span>
                  </button>
                  <button
                    onClick={() => handleNavigation(onDutyPath)}
                    className={`flex w-full items-center gap-2 p-2 ${isActive(onDutyPath) ? "bg-[#600000]" : "hover:bg-[#600000]"} rounded transition-colors`}
                  >
                    <Users className="h-5 w-5" />
                    <span>On-Duty</span>
                  </button>
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content with Loading State */}
        <div className="flex-1 relative">
          {isNavigating && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <LoadingSpinner />
            </div>
          )}

          <Suspense fallback={<LoadingSpinner />}>
            <PageTransition>{children}</PageTransition>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

