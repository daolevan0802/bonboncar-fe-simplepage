import { useEffect, useRef, useState } from 'react'
import { z } from 'zod'

import { BookingStatusChart } from '@/components/statitic/booking-status-chart'
import { CityStatsChart } from '@/components/statitic/city-stats-chart'
import { StatsOverviewCards } from '@/components/statitic/stats-overview-cards'
import { TopAffiliatesTable } from '@/components/statitic/top-affiliates-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAffiliateDashboardStatsQueries } from '@/queries/affiliate.queries'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

const statisticsSearchSchema = z.object({
  year: z.string().optional().default('2024'),
})

export const Route = createFileRoute('/dashboard/statistics/')({
  validateSearch: statisticsSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { year } = Route.useSearch()
  const yearNumber = parseInt(year || '2024', 10)
  const navigate = useNavigate()
  const [isYearSelectorOpen, setIsYearSelectorOpen] = useState(false)
  const yearSelectorRef = useRef<HTMLDivElement>(null)

  const { data: statsResponse, isLoading, error } = useAffiliateDashboardStatsQueries(yearNumber)
  const statsData = statsResponse?.data?.overview

  const handleYearChange = (newYear: string) => {
    navigate({
      to: '/dashboard/statistics',
      search: { year: newYear },
    })
    setIsYearSelectorOpen(false)
  }

  const currentYear = new Date().getFullYear()
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - i)

  // Close year selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearSelectorRef.current && !yearSelectorRef.current.contains(event.target as Node)) {
        setIsYearSelectorOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (error) {
    return (
      <div className="container mx-auto space-y-6">
        <div className="flex items-center justify-center h-64">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu thống kê</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thống kê đại lý</h1>
          <p className="text-muted-foreground">Tổng quan về hoạt động của hệ thống đại lý</p>
        </div>
        <div className="flex gap-2">
          <div className="relative" ref={yearSelectorRef}>
            <Button variant="outline" onClick={() => setIsYearSelectorOpen(!isYearSelectorOpen)} className="h-auto p-4">
              <div className="text-left">
                <div className="text-sm text-muted-foreground">Kỳ báo cáo</div>
                <div className="text-lg font-semibold">{year}</div>
              </div>
            </Button>
            {isYearSelectorOpen && (
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border rounded-md shadow-lg z-10">
                {availableYears.map((yearOption) => (
                  <button
                    key={yearOption}
                    onClick={() => handleYearChange(yearOption.toString())}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                      year === yearOption.toString() ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    {yearOption}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : statsData ? (
        <StatsOverviewCards stats={statsData} />
      ) : null}

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Affiliates */}
        <div className="md:col-span-1 flex flex-col">
          {isLoading ? (
            <Card className="w-full flex-1 flex flex-col">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-6 w-8" />
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="w-full flex-1">
              <TopAffiliatesTable topAffiliates={statsData?.topAffiliates || []} />
            </div>
          )}
        </div>

        {/* Booking Status Chart */}
        <div className="md:col-span-1 flex flex-col">
          {isLoading ? (
            <Card className="w-full flex-1 flex flex-col">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent className="flex-1">
                <Skeleton className="h-full w-full" />
              </CardContent>
            </Card>
          ) : (
            <div className="w-full flex-1">
              <BookingStatusChart bookingStatusStats={statsData?.bookingStatusStats || []} />
            </div>
          )}
        </div>
      </div>

      {/* City Stats */}
      <div className="grid gap-6">
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ) : (
          <CityStatsChart cityStats={statsData?.cityStats || []} />
        )}
      </div>

      {/* Monthly Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê theo tháng</CardTitle>
          <CardDescription>Xu hướng phát triển trong năm {year}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => {
                const monthIndex = index + 1
                const monthString = `${yearNumber}-${monthIndex.toString().padStart(2, '0')}`
                const monthData = statsData?.monthlyStats?.find((month) => month.month === monthString)
                return (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {new Date(yearNumber, index).toLocaleDateString('vi-VN', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Đơn đặt:</span>
                        <span className="text-sm font-medium">{monthData?.totalBookings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Doanh thu:</span>
                        <span className="text-sm font-medium text-green-600">
                          {monthData?.totalRevenue ? `${(monthData.totalRevenue / 1000000).toFixed(1)}M` : '0.0M'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Đại lý mới:</span>
                        <span className="text-sm font-medium text-blue-600">{monthData?.newAffiliates || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
