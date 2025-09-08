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
    <Card>
      <CardHeader>
        <CardTitle>Top đại lý xuất sắc</CardTitle>
        <CardDescription>Danh sách các đại lý có thành tích tốt nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hạng</TableHead>
              <TableHead>Mã đại lý</TableHead>
              <TableHead>Tên đại lý</TableHead>
              <TableHead>Số đơn</TableHead>
              <TableHead>Doanh thu</TableHead>
              <TableHead>Hoa hồng</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topAffiliates.map((affiliate, index) => (
              <TableRow key={affiliate.id}>
                <TableCell>
                  <Badge variant={index < 3 ? 'default' : 'secondary'}>#{index + 1}</Badge>
                </TableCell>
                <TableCell className="font-medium">{affiliate.affiliate_code}</TableCell>
                <TableCell>{affiliate.affiliate_name}</TableCell>
                <TableCell>{affiliate.totalBookings.toLocaleString()}</TableCell>
                <TableCell>{formatCurrency(affiliate.totalRevenue)}</TableCell>
                <TableCell className="text-green-600 font-medium">{formatCurrency(affiliate.commission)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
