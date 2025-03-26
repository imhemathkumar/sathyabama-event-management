"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { getCurrentUser, redirectToDashboard } from "@/lib/auth-utils"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface AuthRedirectProps {
  requireAuth?: boolean
  redirectAuthenticated?: boolean
}

/**
 * Component to handle authentication redirects
 * - If requireAuth is true, redirects to login if not authenticated
 * - If redirectAuthenticated is true, redirects to dashboard if already authenticated
 */
export function AuthRedirect({ requireAuth = false, redirectAuthenticated = false }: Readonly<AuthRedirectProps>) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const pathname = usePathname() // Add this to check current path

  useEffect(() => {
    // Get current user from localStorage
    const user = getCurrentUser()

    // Don't redirect if we're already on the home page
    const isHomePage = pathname === "/"
    if (requireAuth && !user) {
      // Redirect to login if authentication is required but user is not logged in
      router.push("/auth/login")
    } else if (redirectAuthenticated && user && !isHomePage) {
      // Only redirect to dashboard if user is authenticated, redirectAuthenticated is true,
      // and we're not already on the home page
      redirectToDashboard(router)
    }

    // Finish checking auth state
    setIsChecking(false)
  }, [router, requireAuth, redirectAuthenticated, pathname])

  // Show loading spinner while checking authentication
  if (isChecking) {
    return <LoadingSpinner />
  }

  // Return null when done checking - this component doesn't render anything
  return null
}

