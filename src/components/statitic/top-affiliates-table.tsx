import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/formatters'
import type { AffiliateStats } from '@/schemas/affiliate.schemas'

interface TopAffiliatesTableProps {
  topAffiliates: AffiliateStats['topAffiliates']
}

export function TopAffiliatesTable({ topAffiliates }: TopAffiliatesTableProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Top đại lý xuất sắc</CardTitle>
        <CardDescription>Danh sách các đại lý có thành tích tốt nhất</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hạng</TableHead>
              <TableHead>Mã đại lý</TableHead>
              <TableHead>Tên đại lý</TableHead>
              <TableHead>Số đơn</TableHead>
              <TableHead>Doanh thu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => {
              const affiliate = topAffiliates[index]
              return (
                <TableRow key={affiliate?.id || index}>
                  <TableCell>
                    <Badge variant={index < 3 ? 'default' : 'secondary'}>#{index + 1}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{affiliate?.affiliate_code || '-'}</TableCell>
                  <TableCell>{affiliate?.affiliate_name || '-'}</TableCell>
                  <TableCell>{affiliate?.totalBookings ? affiliate.totalBookings.toLocaleString() : '0'}</TableCell>
                  <TableCell>{affiliate?.totalRevenue ? formatCurrency(affiliate.totalRevenue) : '0 ₫'}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
