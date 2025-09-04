import { authAPI } from '@/apis/auth.api'
import routes from '@/configs/routes'
import { useAuthStore } from '@/stores/useAuthStore'
import { setToken } from '@/utils/cookies'
import { setUserEmail } from '@/utils/user'
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
      setAuthenticated(true)

      // Clear any cached data
      queryClient.clear()

      // Redirect to dashboard
      navigate({ to: routes.dashboardBookings })
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

      // Clear all cached data
      queryClient.clear()

      // Redirect to login
      navigate({ to: routes.login })
    },
  })
}
