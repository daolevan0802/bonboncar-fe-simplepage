import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401 errors for booking APIs
        if (error?.response?.status === 401) {
          const url = error?.config?.url || ''
          if (url.includes('/bookings/')) {
            console.warn('401 error on booking API, not retrying:', url)
            return false
          }
        }
        return failureCount < 3
      },
      retryDelay: 1000,
    },
    mutations: {
      retry: (error: any) => {
        // Don't retry mutations on 401 errors for booking APIs
        if (error?.response?.status === 401) {
          const url = error?.config?.url || ''
          if (url.includes('/bookings/')) {
            console.warn('401 error on booking mutation, not retrying:', url)
            return false
          }
        }
        return false // Don't retry mutations by default
      },
    },
  },
})

export function getContext() {
  return {
    queryClient,
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
