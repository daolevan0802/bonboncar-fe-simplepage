import * as React from 'react'
import { FolderKanban } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { getUserEmail, getUserRole } from '@/utils/user'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Get navigation items based on user role
  const getNavItems = () => {
    const userRole = getUserRole()
    console.log('Current user role:', userRole) // Debug log

    // Temporary test - remove this after testing
    if (!userRole) {
      console.log('No role found, using default behavior')
    }

    const allNavItems = [
      {
        title: 'Thống kê',
        url: '/dashboard/statistics',
      },
      {
        title: 'Quản lý đại lý',
        url: '/dashboard/affiliates',
      },
      {
        title: 'Quản lý đặt đơn',
        url: '/dashboard/bookings',
      },
      {
        title: 'Quản lý đặt đơn của đại lý',
        url: '/dashboard/bookings-affiliate',
      },
      {
        title: 'Quản lý phụ thu',
        url: '/dashboard/surcharges',
      },
    ]

    // Filter navigation items based on role
    let filteredItems: typeof allNavItems = []

    if (userRole === 'b2b_user') {
      // Affiliate chỉ thấy "Quản lý đặt đơn của đại lý"
      filteredItems = allNavItems.filter((item) => item.url === '/dashboard/bookings-affiliate')
    } else if (userRole === 'admin' || userRole === 'superadmin' || userRole === 'strapi-super-admin') {
      // Admin, SuperAdmin và Strapi Super Admin thấy tất cả trừ "Quản lý đặt đơn của đại lý"
      filteredItems = allNavItems.filter((item) => item.url !== '/dashboard/bookings-affiliate')
    } else {
      // Không có role hoặc role không đúng: không hiển thị nav gì
      filteredItems = []
    }

    console.log('Filtered items:', filteredItems) // Debug log
    return filteredItems
  }

  // This is sample data.
  const data = {
    user: {
      name: getUserEmail(),
      email: getUserEmail(),
      avatar: '/avatars/shadcn.jpg',
    },

    navMain: [
      {
        title: 'Quản lý',
        url: '#',
        icon: FolderKanban,
        isActive: true,
        items: getNavItems(),
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
