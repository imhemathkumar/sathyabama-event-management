"use client"

import { LoadingSpinner } from "@/components/loading-spinner"
import { getCurrentUser, redirectToDashboard } from "@/lib/auth-utils"
import { useRouter } from "next/navigation"
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

  useEffect(() => {
    // Get current user from localStorage
    const user = getCurrentUser()

    if (requireAuth && !user) {
      // Redirect to login if authentication is required but user is not logged in
      router.push("/auth/login")
    } else if (redirectAuthenticated && user) {
      // Redirect to dashboard if user is already authenticated
      redirectToDashboard(router)
    }

    // Finish checking auth state
    setIsChecking(false)
  }, [router, requireAuth, redirectAuthenticated])

  // Show loading spinner while checking authentication
  if (isChecking) {
    return <LoadingSpinner />
  }

  // Return null when done checking - this component doesn't render anything
  return null
}

