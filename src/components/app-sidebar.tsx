import * as React from 'react'
import { FolderKanban } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { getUserEmail } from '@/utils/user'

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
      items: [
        {
          title: 'Quản lý đặt đơn',
          url: '/dashboard/bookings',
        },
        {
          title: 'Quản lý đại lý',
          url: '/dashboard/referrers',
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
