import routes from '@/configs/routes'
import { useAuthStore } from '@/stores/useAuthStore'
import { getToken } from '@/utils/cookies'
import { getUserRole } from '@/utils/user'
import { redirect } from '@tanstack/react-router'

// AuthGuard function to be used with TanStack Router's beforeLoad
export const authGuard = () => {
  const { isAuthenticated } = useAuthStore.getState()
  const token = getToken()

  // Check if user is authenticated
  if (!isAuthenticated || !token) {
    throw redirect({
      to: routes.login,
      replace: true,
    })
  }
}

// Optional: Guest guard for already authenticated users (redirect from login)
export const guestGuard = () => {
  const { isAuthenticated } = useAuthStore.getState()
  const token = getToken()

  // If user is already authenticated, redirect based on role
  if (isAuthenticated && token) {
    const userRole = getUserRole()

    // Redirect based on role
    if (userRole === 'b2b_user') {
      throw redirect({
        to: routes.dashboardBookingsAffiliate,
        replace: true,
      })
    } else if (userRole === 'admin' || userRole === 'superadmin' || userRole === 'strapi-super-admin') {
      throw redirect({
        to: routes.dashboardStatistics,
        replace: true,
      })
    } else {
      // Default fallback
      throw redirect({
        to: routes.notFound,
        replace: true,
      })
    }
  }
}
