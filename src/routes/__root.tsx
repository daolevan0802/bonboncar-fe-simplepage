import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/theme-provider.tsx'
import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Navigate, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Outlet />
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
      <Toaster />
    </ThemeProvider>
  ),

  notFoundComponent: () => <Navigate to="/dashboard/bookings" />,
})
