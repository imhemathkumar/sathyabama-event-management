// Authentication utility functions

/**
 * Checks if the user is authenticated by verifying localStorage data
 */
export function isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
  
    const userId = localStorage.getItem("userId")
    const userType = localStorage.getItem("userType")
  
    return !!userId && !!userType
  }
  
  /**
   * Gets the current user information from localStorage
   */
  export function getCurrentUser(): { userId: string; userType: "student" | "faculty" } | null {
    if (typeof window === "undefined") return null
  
    const userId = localStorage.getItem("userId")
    const userType = localStorage.getItem("userType") as "student" | "faculty"
  
    if (!userId || !userType) return null
  
    return { userId, userType }
  }
  
  /**
   * Logs out the user by clearing localStorage
   */
  export function logout(): void {
    if (typeof window === "undefined") return
  
    localStorage.removeItem("userId")
    localStorage.removeItem("userType")
  }
  
  /**
   * Redirects to the appropriate dashboard based on user type
   */
  export function redirectToDashboard(router: any): void {
    const user = getCurrentUser()
  
    if (!user) {
      router.push("/auth/login")
      return
    }
  
    const { userId, userType } = user
    const dashboardPath = userType === "student" ? "/student-dashboard" : "/faculty-dashboard"
  
    router.push(`${dashboardPath}?id=${userId}`)
  }
  
  