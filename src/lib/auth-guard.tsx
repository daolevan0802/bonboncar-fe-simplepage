import routes from '@/configs/routes'
import { useAuthStore } from '@/stores/useAuthStore'
import { getToken } from '@/utils/cookies'
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

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && token) {
    throw redirect({
      to: routes.dashboardBookings,
      replace: true,
    })
  }
}
