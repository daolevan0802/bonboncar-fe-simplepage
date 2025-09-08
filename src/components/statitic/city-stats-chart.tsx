import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/formatters'
import type { AffiliateStats } from '@/schemas/affiliate.schemas'

interface CityStatsChartProps {
  cityStats: AffiliateStats['cityStats']
}

export function CityStatsChart({ cityStats }: CityStatsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê theo thành phố</CardTitle>
        <CardDescription>Phân bố đại lý và doanh thu theo từng thành phố</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Thành phố</TableHead>
              <TableHead>Số đại lý</TableHead>
              <TableHead>Số đơn đặt</TableHead>
              <TableHead>Doanh thu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cityStats.map((city, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{city.city}</TableCell>
                <TableCell>{city.affiliateCount}</TableCell>
                <TableCell>{city.bookingCount.toLocaleString()}</TableCell>
                <TableCell className="text-green-600 font-medium">{formatCurrency(city.revenue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
