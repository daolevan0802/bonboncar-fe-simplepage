import { z } from 'zod'

import { BookingStatusChart } from '@/components/statitic/booking-status-chart'
import { CityStatsChart } from '@/components/statitic/city-stats-chart'
import { StatsOverviewCards } from '@/components/statitic/stats-overview-cards'
import { TopAffiliatesTable } from '@/components/statitic/top-affiliates-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mockAffiliateStatsData } from '@/mocks/affiliateStatsData'
import { createFileRoute } from '@tanstack/react-router'

const statisticsSearchSchema = z.object({
  period: z.string().optional(),
})

export const Route = createFileRoute('/dashboard/statistics/')({
  validateSearch: statisticsSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  // Sử dụng mock data
  const statsData = mockAffiliateStatsData.overview

  return (
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thống kê đại lý</h1>
          <p className="text-muted-foreground">Tổng quan về hoạt động của hệ thống đại lý</p>
        </div>
        <div className="flex gap-2">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Kỳ báo cáo</div>
              <div className="text-lg font-semibold">2024</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Overview Cards */}
      <StatsOverviewCards stats={statsData} />

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Affiliates */}
        <div className="md:col-span-1">
          <TopAffiliatesTable topAffiliates={statsData.topAffiliates} />
        </div>

        {/* Booking Status Chart */}
        <div className="md:col-span-1">
          <BookingStatusChart bookingStatusStats={statsData.bookingStatusStats} />
        </div>
      </div>

      {/* City Stats */}
      <div className="grid gap-6">
        <CityStatsChart cityStats={statsData.cityStats} />
      </div>

      {/* Monthly Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê theo tháng</CardTitle>
          <CardDescription>Xu hướng phát triển trong năm 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statsData.monthlyStats.slice(-6).map((month, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {new Date(month.month).toLocaleDateString('vi-VN', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Đơn đặt:</span>
                    <span className="text-sm font-medium">{month.totalBookings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Doanh thu:</span>
                    <span className="text-sm font-medium text-green-600">
                      {(month.totalRevenue / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Đại lý mới:</span>
                    <span className="text-sm font-medium text-blue-600">{month.newAffiliates}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
