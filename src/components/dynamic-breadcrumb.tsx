import { useMemo } from 'react'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Link, useRouterState } from '@tanstack/react-router'

// Route configuration cho breadcrumb
const ROUTE_CONFIG = {
  '/': {
    title: 'Trang chủ',
    showInBreadcrumb: false,
  },
  '/dashboard': {
    title: 'Quản lý',
    showInBreadcrumb: true,
  },
  '/dashboard/': {
    title: 'Tổng quan',
    showInBreadcrumb: true,
  },
  '/dashboard/bookings': {
    title: 'Quản lý đặt xe',
    showInBreadcrumb: true,
  },
  '/dashboard/booking-configs': {
    title: 'Quản lý thiết lập đặt xe',
    showInBreadcrumb: true,
  },
  '/dashboard/cars': {
    title: 'Quản lý xe',
    showInBreadcrumb: true,
  },
  '/dashboard/insurances': {
    title: 'Thông tin bảo hiểm',
    showInBreadcrumb: true,
  },
  '/dashboard/transactions': {
    title: 'Quản lý giao dịch',
    showInBreadcrumb: true,
  },
  '/dashboard/notifications': {
    title: 'Quản lý thông báo',
    showInBreadcrumb: true,
  },
  '/dashboard/affiliate-balances': {
    title: 'Quản lý tài khoản đại lý',
    showInBreadcrumb: true,
  },
  '/dashboard/affiliates': {
    title: 'Quản lý đại lý',
    showInBreadcrumb: true,
  },
} as const

interface BreadcrumbItem {
  title: string
  href?: string
  isCurrentPage: boolean
}

export function DynamicBreadcrumb() {
  const routerState = useRouterState()

  const breadcrumbItems = useMemo(() => {
    const currentPath = routerState.location.pathname
    const items: Array<BreadcrumbItem> = []

    // Tách path thành các segments
    const pathSegments = currentPath.split('/').filter(Boolean)

    // Tạo breadcrumb items từ path segments
    let accumulatedPath = ''

    for (let i = 0; i < pathSegments.length; i++) {
      accumulatedPath += `/${pathSegments[i]}`

      // Xử lý trường hợp đặc biệt cho /dashboard/
      const routeKey =
        accumulatedPath === '/dashboard' && i === pathSegments.length - 1 ? '/dashboard/' : accumulatedPath

      const routeConfig = ROUTE_CONFIG[routeKey as keyof typeof ROUTE_CONFIG]

      if (routeConfig && routeConfig.showInBreadcrumb) {
        const isCurrentPage = i === pathSegments.length - 1

        items.push({
          title: routeConfig.title,
          href: isCurrentPage ? undefined : accumulatedPath,
          isCurrentPage,
        })
      }
    }

    // Thêm breadcrumb cho trang chi tiết đơn đặt xe
    if (
      pathSegments.length === 3 &&
      pathSegments[0] === 'dashboard' &&
      pathSegments[1] === 'bookings' &&
      pathSegments[2] &&
      !isNaN(Number(pathSegments[2]))
    ) {
      items.push({
        title: 'Chi tiết đơn',
        isCurrentPage: true,
      })
    }

    return items
  }, [routerState.location.pathname])

  // Nếu chỉ có 1 item hoặc không có item nào, không hiển thị breadcrumb
  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1

          return (
            <div key={item.title} className="flex items-center">
              <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
                {isLast || !item.href ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// Hook để lấy thông tin breadcrumb cho route hiện tại
// export function useBreadcrumb() {
//   const routerState = useRouterState()
//   const currentPath = routerState.location.pathname

//   return useMemo(() => {
//     const routeKey = currentPath === '/dashboard' ? '/dashboard/' : currentPath
//     const routeConfig = ROUTE_CONFIG[routeKey as keyof typeof ROUTE_CONFIG]

//     return {
//       title: routeConfig?.title || 'Không xác định',
//       showInBreadcrumb: routeConfig?.showInBreadcrumb || false,
//     }
//   }, [currentPath])
// }
