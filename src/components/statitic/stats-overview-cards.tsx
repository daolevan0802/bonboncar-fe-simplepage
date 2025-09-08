import { Calendar, DollarSign, TrendingUp, Users } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/formatters'
import type { AffiliateStats } from '@/schemas/affiliate.schemas'

interface StatsOverviewCardsProps {
  stats: AffiliateStats
}

export function StatsOverviewCards({ stats }: StatsOverviewCardsProps) {
  const cards = [
    {
      title: 'Tổng đại lý',
      value: stats.totalAffiliates.toLocaleString(),
      description: `${stats.activeAffiliates} đang hoạt động`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Tổng đơn đặt xe',
      value: stats.totalBookings.toLocaleString(),
      description: 'Từ tất cả đại lý',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(stats.totalRevenue),
      description: 'Từ các đơn đặt xe',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Tổng hoa hồng',
      value: formatCurrency(stats.totalCommission),
      description: 'Đã trả cho đại lý',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`rounded-full p-2 ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
