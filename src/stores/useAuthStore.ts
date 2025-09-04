import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  // New setter methods for TanStack Query
  setAuthenticated: (isAuthenticated: boolean) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      isLoading: false,

      setAuthenticated: (isAuthenticated: boolean) => {
        set({ isAuthenticated })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      clearAuth: () => {
        set({
          isAuthenticated: false,
          isLoading: false,
        })
      },
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
