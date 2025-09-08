import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getStatusColor, getStatusDisplay } from '@/configs/badge-configs'
import type { AffiliateStats } from '@/schemas/affiliate.schemas'

interface BookingStatusChartProps {
  bookingStatusStats: AffiliateStats['bookingStatusStats']
}

export function BookingStatusChart({ bookingStatusStats }: BookingStatusChartProps) {
  const totalBookings = bookingStatusStats.reduce((sum, stat) => sum + stat.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê trạng thái đơn đặt xe</CardTitle>
        <CardDescription>Tổng cộng {totalBookings.toLocaleString()} đơn đặt xe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bookingStatusStats.map((stat, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(stat.status as any).split(' ')[0]}`} />
                <span className="text-sm font-medium">{getStatusDisplay(stat.status as any)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.count.toLocaleString()} ({stat.percentage.toFixed(1)}%)
              </div>
            </div>
            <Progress value={stat.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
