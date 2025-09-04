import { AppSidebar } from '@/components/app-sidebar'
import { DynamicBreadcrumb } from '@/components/dynamic-breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { authGuard } from '@/lib/auth-guard.tsx'
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: authGuard,
  component: RouteComponent,
  notFoundComponent: () => <Navigate to="/dashboard/bookings" />,
})

function RouteComponent() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
              <DynamicBreadcrumb />
            </div>
          </header>
          <div className="p-4 pt-0 2xl:max-w-7xl 2xl:min-w-7xl max-w-5xl min-w-5xl mx-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
