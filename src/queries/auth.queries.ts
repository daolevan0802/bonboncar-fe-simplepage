import { authAPI } from '@/apis/auth.api'
import routes from '@/configs/routes'
import { useAuthStore } from '@/stores/useAuthStore'
import { setToken } from '@/utils/cookies'
import { removeUserEmail, removeUserRole, setUserEmail, setUserRole } from '@/utils/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

// Login mutation
export const useLoginMutation = () => {
  const { setAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['login'],
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      // Update auth store
      setToken(response.token)
      setUserEmail(response.email)
      setUserRole(response.role)
      setAuthenticated(true)

      // Clear any cached data
      queryClient.clear()

      // Redirect based on role
      if (response.role === 'affiliate') {
        navigate({ to: routes.dashboardBookingsAffiliate })
      } else if (
        response.role === 'admin' ||
        response.role === 'superadmin' ||
        response.role === 'strapi-super-admin'
      ) {
        navigate({ to: routes.dashboardStatistics })
      } else {
        // Default fallback - redirect to not found for unknown roles
        navigate({ to: routes.notFound })
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}

// Logout mutation
export const useLogoutMutation = () => {
  const { clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: authAPI.logout,
    onSettled: () => {
      // Always clear auth state regardless of API success/failure
      clearAuth()

      // Clear user data
      removeUserEmail()
      removeUserRole()

      // Clear all cached data
      queryClient.clear()

      // Redirect to login
      navigate({ to: routes.login })
    },
  })
}
